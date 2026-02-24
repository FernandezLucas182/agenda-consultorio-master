const crypto = require('crypto');
const db = require('../models/Db');
const Agenda = require('../models/Agenda');
const generarTurnos = require('../utils/generarTurnos');
const Turno = require('../models/Turno');
const { enviarMailConfirmacion } = require('./emailService');

//============================================================

function procesarAusencia(profesional_id, fecha_inicio, fecha_fin) {

  const sql = `
    SELECT *
    FROM turnos
    WHERE profesional_id = ?
      AND fecha BETWEEN ? AND ?
      AND estado IN ('reservado','confirmado')
  `;

  db.query(sql, [profesional_id, fecha_inicio, fecha_fin], (err, turnos) => {
    if (err) return console.error(err);
    if (!turnos || !turnos.length) return;

    turnos.forEach(turno => {
      buscarNuevoHorario(turno);
    });
  });
}

//==================================================

function buscarNuevoHorario(turno) {

  const fechaObj = new Date(turno.fecha);
  let diaJS = fechaObj.getDay();
  let diaBD = diaJS === 0 ? 7 : diaJS;

  Agenda.obtenerHorariosProfesional(
    turno.profesional_id,
    diaBD,
    (err, bloques) => {

      if (err) return console.error(err);

      if (!bloques || !bloques.length) {
        buscarOtroProfesional(turno, (resultado) => {
          if (!resultado) marcarNoDisponible(turno.id);
        });
        return;
      }

      Turno.obtenerHorariosOcupados(
        turno.profesional_id,
        turno.fecha,
        (err2, ocupados) => {

          if (err2) return console.error(err2);

          let posibles = [];

          bloques.forEach(b => {
            posibles.push(
              ...generarTurnos(
                b.hora_inicio,
                b.hora_fin,
                b.duracion_turno
              )
            );
          });

          const libres = posibles.filter(h => !ocupados.includes(h));

          if (libres.length > 0) {

            const nuevaHora = libres[0];
            const token = crypto.randomBytes(32).toString('hex');

            // 🔒 TRANSACCIÓN
            db.beginTransaction(err => {
              if (err) return console.error(err);

              db.query(
                `UPDATE turnos
                 SET fecha = ?,
                     hora = ?,
                     estado = 'reservado',
                     requiere_confirmacion = 1,
                     token_confirmacion = ?
                 WHERE id = ?`,
                [turno.fecha, nuevaHora, token, turno.id],
                (err2) => {

                  if (err2) {
                    return db.rollback(() => {
                      console.error(err2);
                    });
                  }

                  db.commit(err3 => {
                    if (err3) {
                      return db.rollback(() => {
                        console.error(err3);
                      });
                    }

                    enviarMail(turno, token);
                  });

                }
              );
            });

          } else {

            buscarOtroProfesional(turno, (resultado) => {
              if (!resultado) marcarNoDisponible(turno.id);
            });

          }

        }
      );
    }
  );
}

//========================================================

function buscarOtroProfesional(turno, callback) {

  const sql = `
    SELECT p.id
    FROM profesionales p
    JOIN profesional_especialidad pe
      ON p.id = pe.profesional_id
    WHERE pe.especialidad_id = ?
      AND p.id != ?
      AND p.estado = 'activo'
  `;

  db.query(sql, [turno.especialidad_id, turno.profesional_id], (err, profesionales) => {

    if (err || !profesionales.length) {
      return callback(null);
    }

    let encontrado = false;

    for (const prof of profesionales) {

      if (encontrado) break;

      const fechaObj = new Date(turno.fecha);
      let diaJS = fechaObj.getDay();
      let diaBD = diaJS === 0 ? 7 : diaJS;

      Turno.obtenerHorariosOcupados(
        prof.id,
        turno.fecha,
        (err2, ocupados) => {

          if (err2) return;

          Agenda.obtenerHorariosProfesional(
            prof.id,
            diaBD,
            (err3, bloques) => {

              if (!bloques || !bloques.length) return;

              let posibles = [];

              bloques.forEach(b => {
                posibles.push(
                  ...generarTurnos(
                    b.hora_inicio,
                    b.hora_fin,
                    b.duracion_turno
                  )
                );
              });

              const libres = posibles.filter(h => !ocupados.includes(h));

              if (libres.length > 0 && !encontrado) {

                encontrado = true;

                const nuevaHora = libres[0];
                const token = crypto.randomBytes(32).toString('hex');

                // 🔒 TRANSACCIÓN
                db.beginTransaction(err => {
                  if (err) return console.error(err);

                  db.query(
                    `UPDATE turnos
                     SET profesional_id = ?,
                         hora = ?,
                         estado = 'reservado',
                         requiere_confirmacion = 1,
                         token_confirmacion = ?
                     WHERE id = ?`,
                    [prof.id, nuevaHora, token, turno.id],
                    (err2) => {

                      if (err2) {
                        return db.rollback(() => {
                          console.error(err2);
                        });
                      }

                      db.commit(err3 => {
                        if (err3) {
                          return db.rollback(() => {
                            console.error(err3);
                          });
                        }

                        enviarMail(turno, token);
                        callback(true);
                      });

                    }
                  );
                });

              }

            }
          );

        }
      );
    }

    if (!encontrado) callback(null);

  });
}

//========================================================

function marcarNoDisponible(turnoId) {
  db.query(
    `UPDATE turnos
     SET estado = 'no_disponible'
     WHERE id = ?`,
    [turnoId]
  );
}

//========================================================

function enviarMail(turno, token) {

  const enlace = `http://localhost:3000/confirmar-turno/${token}`;

  db.query(
    `SELECT contacto FROM pacientes WHERE id = ?`,
    [turno.paciente_id],
    (err, paciente) => {

      if (err) return console.error(err);

      if (paciente && paciente.length > 0) {
        enviarMailConfirmacion(paciente[0].contacto, enlace)
          .catch(console.error);
      }

    }
  );
}

//========================================================

module.exports = { procesarAusencia };