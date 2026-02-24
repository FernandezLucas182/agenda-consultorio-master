const db = require('./Db');

class Agenda {

  static obtenerAgendasBase(buscar, callback) {

    let sql = `
      SELECT 
        a.id,
        p.nombre_completo AS nombre_completo,
        e.nombre AS especialidad,
        a.max_sobreturnos
      FROM agendas_nueva a
      JOIN profesionales p ON a.profesional_id = p.id
      JOIN especialidades e ON a.especialidad_id = e.id
      WHERE (a.activo = 1 OR a.activo IS NULL)
    `;

    let params = [];

    if (buscar) {
      sql += ` AND (p.nombre_completo LIKE ? OR e.nombre LIKE ?)`;
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
        p.nombre_completo,
        e.nombre AS especialidad,
        ah.id AS horario_id,
        ah.dia_semana,
        ah.hora_inicio,
        ah.hora_fin,
        a.duracion_turno,
        a.max_sobreturnos,
        a.id AS agenda_id
      FROM agenda_horarios ah
      JOIN agendas_nueva a ON ah.agenda_id = a.id
      JOIN profesionales p ON a.profesional_id = p.id
      JOIN especialidades e ON a.especialidad_id = e.id
      WHERE a.activo = 1
    `;

    let params = [];

    if (buscar) {
      sql += ` AND (p.nombre_completo LIKE ? OR e.nombre LIKE ?)`;
      params.push(`%${buscar}%`, `%${buscar}%`);
    }

    sql += `
      ORDER BY p.nombre_completo, e.nombre, ah.dia_semana, ah.hora_inicio
    `;

    db.query(sql, params, (err, resultados) => {
      if (err) return callback(err);
      callback(null, resultados || []);
    });
  }


  // ==========================
  // ACTUALIZAR AGENDA BASE
  // ==========================
  static actualizarAgendaBase(id, duracion_turno, max_sobreturnos, callback) {

    const sql = `
      UPDATE agendas_nueva
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

    const { profesional_id, especialidad_id, duracion_turno } = datos;

    db.query(
      `INSERT INTO agendas_nueva 
       (profesional_id, especialidad_id, duracion_turno, activo) 
       VALUES (?, ?, ?, 1)`,
      [profesional_id, especialidad_id, duracion_turno],
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

    db.query(
      sqlValidacion,
      [agenda_id, dia_semana, hora_fin, hora_inicio],
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
        p.nombre_completo,
        e.nombre AS especialidad,
        a.duracion_turno,
        a.max_sobreturnos
      FROM agendas_nueva a
      JOIN profesionales p ON a.profesional_id = p.id
      JOIN especialidades e ON a.especialidad_id = e.id
      WHERE a.id = ?
    `;

    db.query(sql, [id], (err, resultados) => {
      if (err) return callback(err);
      callback(null, resultados[0] || null);
    });
  }


  // ==========================
// OBTENER HORARIOS POR AGENDA
// ==========================
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






// ==========================
// REEMPLAZAR HORARIOS COMPLETOS
// ==========================
static reemplazarHorarios(agenda_id, listaHorarios, callback) {

  db.beginTransaction(err => {

    if (err) return callback(err);

    if (!listaHorarios || listaHorarios.length === 0) {
      return db.rollback(() =>
        callback(new Error("Debe existir al menos un horario"))
      );
    }

    // 1️⃣ BORRAR TODOS LOS HORARIOS ACTUALES
    db.query(
      `DELETE FROM agenda_horarios WHERE agenda_id = ?`,
      [agenda_id],
      (err) => {

        if (err) {
          return db.rollback(() => callback(err));
        }

        // 2️⃣ INSERTAR TODOS LOS NUEVOS
        let pendientes = listaHorarios.length;
        let errorEncontrado = false;

        listaHorarios.forEach(h => {

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

          db.query(
            `INSERT INTO agenda_horarios
             (agenda_id, dia_semana, hora_inicio, hora_fin)
             VALUES (?, ?, ?, ?)`,
            [agenda_id, h.dia, h.desde, h.hasta],
            (err) => {

              if (err && !errorEncontrado) {
                errorEncontrado = true;
                return db.rollback(() => callback(err));
              }

              pendientes--;

              if (pendientes === 0 && !errorEncontrado) {
                db.commit(callback);
              }
            }
          );
        });

      }
    );

  });
}





// ==========================
// ACTUALIZAR HORARIOS AGENDA
// ==========================
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

      // UPDATE si tiene id
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

        // INSERT nuevo
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
    });

  });
}



 static crearAgendaConHorarios(datos, dbConn, callback) {

  const { profesional_id, especialidad_id, duracion_turno, horarios } = datos;
  const listaHorarios = Array.isArray(horarios) ? horarios : [horarios];

  dbConn.beginTransaction((err) => {

    if (err) return callback(err);

    dbConn.query(
      `SELECT id 
       FROM agendas_nueva
       WHERE profesional_id = ?
         AND especialidad_id = ?
         AND activo = 1`,
      [profesional_id, especialidad_id],
      (err, existente) => {

        if (err) {
          return dbConn.rollback(() => callback(err));
        }

        if (existente.length > 0) {
          return dbConn.rollback(() =>
            callback(new Error("Ya existe una agenda activa para este profesional y especialidad"))
          );
        }

        dbConn.query(
          `INSERT INTO agendas_nueva 
           (profesional_id, especialidad_id, duracion_turno, activo)
           VALUES (?, ?, ?, 1)`,
          [profesional_id, especialidad_id, duracion_turno],
          (err, result) => {

            if (err) {
              return dbConn.rollback(() => callback(err));
            }

            const agenda_id = result.insertId;

            let pendientes = listaHorarios.length;
            let errorEncontrado = false;

            listaHorarios.forEach((h) => {

              if (h.desde >= h.hasta) {
                errorEncontrado = true;
                return dbConn.rollback(() =>
                  callback(new Error("Hora inicio debe ser menor que hora fin"))
                );
              }

              dbConn.query(
                `INSERT INTO agenda_horarios 
                 (agenda_id, dia_semana, hora_inicio, hora_fin)
                 VALUES (?, ?, ?, ?)`,
                [agenda_id, h.dia, h.desde, h.hasta],
                (err) => {

                  if (err && !errorEncontrado) {
                    errorEncontrado = true;
                    return dbConn.rollback(() => callback(err));
                  }

                  pendientes--;

                  if (pendientes === 0 && !errorEncontrado) {
                    dbConn.commit((err) => {
                      if (err) {
                        return dbConn.rollback(() => callback(err));
                      }
                      callback(null);
                    });
                  }
                }
              );
            });
          }
        );
      }
    );
  });
}

static obtenerHorariosProfesional(profesional_id, dia_semana, callback) {

  const sql = `
    SELECT ah.hora_inicio, ah.hora_fin, a.duracion_turno
    FROM agendas_nueva a
    JOIN agenda_horarios ah ON ah.agenda_id = a.id
    WHERE a.profesional_id = ?
      AND a.activo = 1
      AND ah.dia_semana = ?
  `;

  db.query(sql, [profesional_id, dia_semana], (err, resultados) => {
    if (err) return callback(err);
    callback(null, resultados || []);
  });
}

}

module.exports = Agenda;