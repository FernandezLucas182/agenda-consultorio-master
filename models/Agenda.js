const db = require('./Db');

class Agenda {

  static obtenerAgendasBase(buscar, callback) {

    let sql = `
      SELECT 
        a.id,
        CONCAT(p.nombre, ' ', p.apellido) AS nombre_completo,
        e.nombre AS especialidad,
        a.max_sobreturnos
      FROM agendas a
      JOIN profesionales p ON a.profesional_id = p.id
      JOIN especialidades e ON a.especialidad_id = e.id
      WHERE (a.activo = 1 OR a.activo IS NULL)
    `;

    let params = [];

    if (buscar) {
      sql += ` AND (CONCAT(p.nombre, ' ', p.apellido) LIKE ? OR e.nombre LIKE ?)`;
      params.push(`%${buscar}%`, `%${buscar}%`);
    }

    db.query(sql, params, (err, resultados) => {
      if (err) return callback(err);
      callback(null, resultados || []);
    });
  }



  static obtenerAgendaCompleta(buscar, callback) {

    let sql = `
      SELECT 
        a.profesional_id,
        p.nombre,
        p.apellido,
        p.dni,
        p.telefono,
        p.email,
        e.nombre AS especialidad,
        ah.id AS horario_id,
        ah.dia_semana,
        ah.hora_inicio,
        ah.hora_fin,
        a.duracion_turno,
        a.max_sobreturnos,
        a.id AS agenda_id,
        s.nombre AS sucursal
      FROM agenda_horarios ah
      JOIN agendas a ON ah.agenda_id = a.id
      JOIN profesionales p ON a.profesional_id = p.id
      JOIN especialidades e ON a.especialidad_id = e.id
      LEFT JOIN sucursales s ON a.sucursal_id = s.id
      WHERE a.activo = 1
    `;

    let params = [];

    if (buscar) {
      sql += `
        AND (
          p.nombre LIKE ?
          OR p.apellido LIKE ?
          OR CONCAT(p.nombre, ' ', p.apellido) LIKE ?
          OR e.nombre LIKE ?
          OR s.nombre LIKE ?
        )
      `;

      params.push(
        `%${buscar}%`,
        `%${buscar}%`,
        `%${buscar}%`,
        `%${buscar}%`,
        `%${buscar}%`
      );
    }

    sql += `
      ORDER BY p.nombre, p.apellido, e.nombre, ah.dia_semana, ah.hora_inicio
    `;

    db.query(sql, params, (err, resultados) => {
      if (err) return callback(err);
      callback(null, resultados || []);
    });
  }



  static actualizarAgendaBase(id, duracion_turno, max_sobreturnos, callback) {

    const sql = `
      UPDATE agendas
      SET duracion_turno = ?, 
          max_sobreturnos = ?
      WHERE id = ?
    `;

    db.query(sql, [duracion_turno, max_sobreturnos || 0, id], (err) => {
      if (err) return callback(err);
      callback(null);
    });
  }



  static crearAgendaBase(datos, callback) {

    const { profesional_id, especialidad_id, duracion_turno, sucursal_id } = datos;

    db.query(
      `INSERT INTO agendas 
      (profesional_id, especialidad_id, duracion_turno, sucursal_id, activo)
      VALUES (?, ?, ?, ?, 1)`,
      [profesional_id, especialidad_id, duracion_turno, sucursal_id],
      callback
    );
  }



  static agregarHorario(datos, callback) {

    const { agenda_id, dia_semana, hora_inicio, hora_fin } = datos;

    const sqlValidacion = `
      SELECT id
      FROM agenda_horarios
      WHERE agenda_id = ?
        AND dia_semana = ?
        AND NOT (hora_fin <= ? OR hora_inicio >= ?)
    `;

    db.query(sqlValidacion,
      [agenda_id, dia_semana, hora_inicio, hora_fin],
      (err, resultados) => {

        if (err) return callback(err);

        if (resultados.length > 0) {
          return callback(new Error('Horario solapado'));
        }

        db.query(
          `INSERT INTO agenda_horarios 
           (agenda_id, dia_semana, hora_inicio, hora_fin)
           VALUES (?, ?, ?, ?)`,
          [agenda_id, dia_semana, hora_inicio, hora_fin],
          callback
        );
      }
    );
  }



  static obtenerAgendaBasePorId(id, callback) {

    const sql = `
      SELECT 
        a.id,
        CONCAT(p.nombre, ' ', p.apellido) AS nombre_completo,
        e.nombre AS especialidad,
        s.nombre AS sucursal,
        a.duracion_turno,
        a.max_sobreturnos
      FROM agendas a
      JOIN profesionales p ON a.profesional_id = p.id
      JOIN especialidades e ON a.especialidad_id = e.id
      LEFT JOIN sucursales s ON a.sucursal_id = s.id
      WHERE a.id = ?
    `;

    db.query(sql, [id], (err, resultados) => {
      if (err) return callback(err);
      callback(null, resultados[0] || null);
    });
  }



  static obtenerHorariosPorAgenda(agenda_id, callback) {

    const sql = `
      SELECT id, dia_semana, hora_inicio, hora_fin
      FROM agenda_horarios
      WHERE agenda_id = ?
      ORDER BY dia_semana, hora_inicio
    `;

    db.query(sql, [agenda_id], (err, resultados) => {
      if (err) return callback(err);
      callback(null, resultados || []);
    });
  }



  static reemplazarHorarios(agenda_id, listaHorarios, callback) {

    if (!listaHorarios || listaHorarios.length === 0) {
      return callback(new Error("Debe existir al menos un horario"));
    }

    db.getConnection((err, connection) => {

      if (err) return callback(err);

      connection.beginTransaction(err => {
        let errorEncontrado = false;

        if (err) {
          connection.release();
          return callback(err);
        }

        connection.query(
          `SELECT profesional_id
         FROM agendas
         WHERE id = ?`,
          [agenda_id],
          (err, agendaRows) => {

            if (err) {
              errorEncontrado = true;

              return connection.rollback(() => {
                connection.release();
                callback(err);
              });
            }

            const profesional_id = agendaRows[0].profesional_id;



            connection.query(
              "DELETE FROM agenda_horarios WHERE agenda_id = ?",
              [agenda_id],
              (err) => {

                if (err) {
                  errorEncontrado = true;

                  return connection.rollback(() => {
                    connection.release();
                    callback(err);
                  });
                }

                let pendientes = listaHorarios.length;
                //const idsFinales = [];


                listaHorarios.forEach(h => {

                  if (errorEncontrado) return;

                  if (h.desde >= h.hasta) {
                    errorEncontrado = true;

                    return connection.rollback(() => {
                      connection.release();
                      callback(new Error("Hora inicio debe ser menor que hora fin"));
                    });
                  }

                  connection.query(
                    `SELECT ah.id
                   FROM agenda_horarios ah
                   JOIN agendas a ON ah.agenda_id = a.id
                   WHERE a.profesional_id = ?
                     AND ah.dia_semana = ?
                     AND NOT (ah.hora_fin <= ? OR ah.hora_inicio >= ?)`,
                    [profesional_id, h.dia, h.desde, h.hasta],

                    (err, conflictos) => {
                      if (errorEncontrado) return;

                      if (err) {
                        errorEncontrado = true;

                        return connection.rollback(() => {
                          connection.release();
                          callback(err);
                        });
                      }

                      if (conflictos.length > 0) {

                        errorEncontrado = true;

                        return connection.rollback(() => {
                          connection.release();

                          callback({
                            type: 'BUSINESS_RULE',
                            message: 'El profesional ya tiene un horario que se solapa en ese día'
                          });
                        });
                      }

                      connection.query(
                        `INSERT INTO agenda_horarios 
                       (agenda_id, dia_semana, hora_inicio, hora_fin)
                       VALUES (?, ?, ?, ?)`,
                        [agenda_id, h.dia, h.desde, h.hasta],
                        (err) => {
                          if (errorEncontrado) return;

                          if (err) {
                            errorEncontrado = true;

                            return connection.rollback(() => {
                              connection.release();
                              callback(err);
                            });
                          }

                          pendientes--;

                          if (pendientes === 0) {

                            connection.commit(err => {

                              if (err) {
                                errorEncontrado = true;

                                return connection.rollback(() => {
                                  connection.release();
                                  callback(err);
                                });
                              }

                              connection.release();
                              callback(null, { agenda_id });

                            });
                          }
                        }
                      );
                    }
                  );
                });
              }
            );
          }
        );
      });
    });
  }



  static actualizarHorarios(agenda_id, listaHorarios, callback) {

    db.beginTransaction(err => {

      if (err) return callback(err);

      if (!listaHorarios || listaHorarios.length === 0) {
        return db.rollback(() =>
          callback(new Error("Debe existir al menos un horario"))
        );
      }

      const idsFinales = [];
      let pendientes = listaHorarios.length;
      let errorEncontrado = false;

      listaHorarios.forEach(h => {
        if (errorEncontrado) return;

        function finalizar() {

          pendientes--;

          if (pendientes === 0 && !errorEncontrado) {

            db.query(
              `DELETE FROM agenda_horarios
               WHERE agenda_id = ?
               AND id NOT IN (?)`,
              [agenda_id, idsFinales],
              (err) => {

                if (err) return db.rollback(() => callback(err));

                db.commit(callback);
              }
            );
          }
        }

        if (h.dia == 7) {
          errorEncontrado = true;
          return db.rollback(() =>
            callback(new Error("Domingos no habilitados"))
          );
        }

        if (h.desde >= h.hasta) {
          errorEncontrado = true;
          return db.rollback(() =>
            callback(new Error("Hora inicio debe ser menor que hora fin"))
          );
        }

        if (h.id) {

          db.query(
            `UPDATE agenda_horarios
             SET hora_inicio = ?, hora_fin = ?
             WHERE id = ?`,
            [h.desde, h.hasta, h.id],
            (err) => {

              if (err && !errorEncontrado) {
                errorEncontrado = true;
                return db.rollback(() => callback(err));
              }

              idsFinales.push(h.id);
              finalizar();
            }
          );

        } else {

          db.query(
            `INSERT INTO agenda_horarios
             (agenda_id, dia_semana, hora_inicio, hora_fin)
             VALUES (?, ?, ?, ?)`,
            [agenda_id, h.dia, h.desde, h.hasta],
            (err, result) => {

              if (err && !errorEncontrado) {
                errorEncontrado = true;
                return db.rollback(() => callback(err));
              }

              idsFinales.push(result.insertId);
              finalizar();
            }
          );
        }
      });
    });
  }



  static verificarSolapamientoProfesional(connection, profesional_id, dia_semana, desde, hasta, callback) {

    const sql = `
      SELECT ah.id
      FROM agenda_horarios ah
      JOIN agendas a ON ah.agenda_id = a.id
      WHERE a.profesional_id = ?
        AND a.activo = 1
        AND ah.dia_semana = ?
        AND NOT (ah.hora_fin <= ? OR ah.hora_inicio >= ?)
      LIMIT 1
    `;

    connection.query(sql,
      [profesional_id, dia_semana, desde, hasta],
      (err, rows) => {
        if (err) return callback(err);
        callback(null, rows.length > 0);
      }
    );
  }



  static crearAgendaConHorarios(datos, callback) {

    const { profesional_id, especialidad_id, duracion_turno, horarios, sucursal_id } = datos;

    const listaHorarios = Array.isArray(horarios) ? horarios : [horarios];

    db.getConnection((err, connection) => {

      if (err) return callback(err);

      connection.beginTransaction(err => {
        let errorEncontrado = false;

        if (err) {
          connection.release();
          return callback(err);
        }



        connection.query(
          `SELECT id 
           FROM agendas
           WHERE profesional_id = ?
             AND especialidad_id = ?
             AND sucursal_id = ?
             AND activo = 1`,
          [profesional_id, especialidad_id, sucursal_id],
          (err, existente) => {

            if (err) {
              errorEncontrado = true;

              return connection.rollback(() => {
                connection.release();
                callback(err);
              });
            }

            if (existente.length > 0) {
              errorEncontrado = true;

              return connection.rollback(() => {
                connection.release();
                callback({
                  type: 'BUSINESS_RULE',
                  message: 'Ya existe una agenda activa para este profesional y especialidad'
                });
              });
            }

            connection.query(
              `INSERT INTO agendas
               (profesional_id, especialidad_id, duracion_turno, sucursal_id, activo)
               VALUES (?, ?, ?, ?, 1)`,
              [profesional_id, especialidad_id, duracion_turno, sucursal_id],
              (err, result) => {

                if (err) {
                  errorEncontrado = true;

                  return connection.rollback(() => {
                    connection.release();
                    callback(err);
                  });
                }

                const agenda_id = result.insertId;
                const agendaResult = result;
                let pendientes = listaHorarios.length;

                listaHorarios.forEach(h => {

                  if (h.desde >= h.hasta) {
                    if (errorEncontrado) return;
                    errorEncontrado = true;

                    return connection.rollback(() => {
                      connection.release();
                      callback(new Error("Hora inicio debe ser menor que hora fin"));
                    });
                  }

                  Agenda.verificarSolapamientoProfesional(
                    connection,
                    profesional_id,
                    h.dia,
                    h.desde,
                    h.hasta,
                    (err, existe) => {
                      if (errorEncontrado) return;
                      if (err) {
                        errorEncontrado = true;

                        return connection.rollback(() => {
                          connection.release();
                          callback(err);
                        });
                      }

                      if (existe) {
                        errorEncontrado = true;

                        return connection.rollback(() => {
                          connection.release();
                          callback({
                            type: "BUSINESS_RULE",
                            message: "El profesional ya tiene un horario que se solapa"
                          });
                        });
                      }

                      connection.query(
                        `INSERT INTO agenda_horarios 
                         (agenda_id, dia_semana, hora_inicio, hora_fin)
                         VALUES (?, ?, ?, ?)`,
                        [agenda_id, h.dia, h.desde, h.hasta],
                        (err) => {

                          if (err) {
                            if (errorEncontrado) return;
                            errorEncontrado = true;

                            return connection.rollback(() => {
                              connection.release();
                              callback(err);
                            });
                          }

                          pendientes--;

                          if (pendientes === 0) {
                            connection.commit(err => {

                              if (err) {
                                errorEncontrado = true;

                                return connection.rollback(() => {
                                  connection.release();
                                  callback(err);
                                });
                              }

                              connection.release();
                              callback(null, agendaResult);
                            });
                          }
                        }
                      );
                    }
                  );
                });

              }
            );
          }
        );
      });
    });
  }



  static obtenerHorariosProfesional(agenda_id, dia_semana, callback) {

    const sql = `
      SELECT ah.hora_inicio, ah.hora_fin, a.duracion_turno
      FROM agenda_horarios ah
      JOIN agendas a ON ah.agenda_id = a.id
      WHERE ah.agenda_id = ?
        AND ah.dia_semana = ?
    `;

    db.query(sql, [agenda_id, dia_semana], (err, resultados) => {
      if (err) return callback(err);
      callback(null, resultados || []);
    });
  }



  static obtenerAgendaPorProfesional(profesional_id, callback) {

    const sql = `
      SELECT id, duracion_turno
      FROM agendas
      WHERE profesional_id = ?
        AND activo = 1
      LIMIT 1
    `;

    db.query(sql, [profesional_id], (err, resultados) => {
      if (err) return callback(err);
      callback(null, resultados[0] || null);
    });
  }



  static verificarDisponibilidad(profesional_id, especialidad_id, sucursal_id, callback) {

    const sql = `
      SELECT id
      FROM agendas
      WHERE profesional_id = ?
        AND especialidad_id = ?
        AND sucursal_id = ?
        AND activo = 1
      LIMIT 1
    `;

    db.query(sql, [profesional_id, especialidad_id, sucursal_id], (err, rows) => {
      if (err) return callback(err);
      callback(null, rows.length === 0);
    });
  }

}

module.exports = Agenda;