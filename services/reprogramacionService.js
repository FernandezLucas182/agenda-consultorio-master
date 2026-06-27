const crypto = require('crypto');
const db = require('../models/Db');
const Agenda = require('../models/Agenda');
const generarTurnos = require('../utils/generarTurnos');
const Turno = require('../models/Turno');
const { enviarMailConfirmacion } = require('./emailService');
const Ausencia = require('../models/Ausencia');

//============================================================

function procesarAusencia(agenda_id, fecha_inicio, fecha_fin) {

  console.log("🔥 PROCESANDO AUSENCIA");

  const sql = `
  SELECT t.*
  FROM turnos t
  JOIN agendas a ON a.id = t.agenda_id
  WHERE a.profesional_id = (
    SELECT profesional_id FROM agendas WHERE id = ?
  )
  AND t.fecha BETWEEN ? AND ?
  AND t.estado IN ('pendiente','confirmado','reservado')
`;

  db.query(sql, [agenda_id, fecha_inicio, fecha_fin], (err, turnos) => {

    console.log("AGENDA:", agenda_id);
    console.log("FECHAS:", fecha_inicio, fecha_fin);
    console.log("TURNOS ENCONTRADOS:", turnos);

    if (err) return console.error(err);

    if (!turnos || !turnos.length) {
      console.log("⚠️ NO HAY TURNOS PARA REPROGRAMAR");
      return;
    }

    turnos.forEach(turno => {

      console.log("MARCANDO PARA REPROGRAMAR:", turno.id);

      marcarParaReprogramacion(turno.id);

    });

  });
}
//=================================================
function marcarParaReprogramacion(turnoId) {

  db.query(
    `UPDATE turnos
     SET estado = 'reprogramar'
     WHERE id = ?`,
    [turnoId],
    (err) => {

      if (err) {
        console.error(err);
      } else {
        console.log("✅ TURNO MARCADO:", turnoId);
      }

    }
  );

}

//=================================================

function marcarPendienteReprogramacion(turnoId) {

  db.query(
    `UPDATE turnos
     SET estado = 'pendiente_reprogramacion'
     WHERE id = ?`,
    [turnoId],
    (err) => {
      if (err) console.error(err);
    }
  );

}

//==================================================

function buscarNuevoHorario(turno) {

  const fechaObj = new Date(turno.fecha);
  let diaJS = fechaObj.getDay();
  let diaBD = diaJS === 0 ? 7 : diaJS;

  console.log("BUSCANDO NUEVO HORARIO PARA:", turno.id);

  Agenda.obtenerHorariosProfesional(
    turno.agenda_id,
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

          const ocupadosFiltrados = ocupados.filter(h => h !== turno.hora);

          console.log("BLOQUES:", bloques);
          console.log("OCUPADOS:", ocupados);
          console.log("POSIBLES:", posibles);

          const libres = posibles.filter(
            h => !ocupadosFiltrados.includes(h)
          );

          if (libres.length > 0) {

            const nuevaHora = libres[0];
            const token = crypto.randomBytes(32).toString('hex');

            console.log("LIBRES:", libres);

            // 🔒 TRANSACCIÓN
            db.beginTransaction(err => {
              if (err) return console.error(err);

              db.query(
                `UPDATE turnos
                 SET fecha = ?,
                     hora = ?,
                     estado = 'reprogramar'
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
              console.log("TURNO REPROGRAMADO");
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
    SELECT
      a.id as agenda_id,
      a.profesional_id,
      a.sucursal_id
    FROM agendas a
    JOIN profesional_especialidad pe
      ON pe.profesional_id = a.profesional_id
    WHERE pe.especialidad_id = ?
      AND a.id != ?
      AND a.activo = 1
  `;

  db.query(sql, [turno.especialidad_id, turno.agenda_id], (err, profesionales) => {

    if (err || !profesionales.length) {
      return callback(null);
    }

    //    let encontrado = false;

    let index = 0;

    function intentarSiguiente() {

      if (index >= profesionales.length) {
        return callback(null);
      }

      const prof = profesionales[index++];

      const fechaObj = new Date(turno.fecha);
      let diaJS = fechaObj.getDay();
      let diaBD = diaJS === 0 ? 7 : diaJS;

      Ausencia.existeAusenciaEnFecha(
        prof.profesional_id,
        turno.fecha,
        (errAus, ausente) => {

          if (errAus || ausente) {
            return intentarSiguiente();
          }

          Turno.obtenerHorariosOcupados(
            prof.profesional_id,
            turno.fecha,
            (err2, ocupados) => {

              if (err2) return intentarSiguiente();

              Agenda.obtenerHorariosProfesional(
                prof.agenda_id,
                diaBD,
                (err3, bloques) => {

                  if (!bloques || !bloques.length) {
                    return intentarSiguiente();
                  }

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

                  const libres = posibles.filter(
                    h => !ocupados.includes(h)
                  );

                  if (libres.length > 0) {

                    const nuevaHora = libres[0];
                    const token = crypto.randomBytes(32).toString('hex');

                    db.beginTransaction(err => {

                      if (err) return intentarSiguiente();

                      db.query(
                        `UPDATE turnos
                         SET profesional_id = ?,
                             agenda_id = ?,
                             sucursal_id = ?,
                             hora = ?,
                             estado = 'reprogramar',
                             requiere_confirmacion = 1,
                             token_confirmacion = ?
                         WHERE id = ?`,
                        [
                          prof.profesional_id,
                          prof.agenda_id,
                          prof.sucursal_id,
                          nuevaHora,
                          token,
                          turno.id
                        ],
                        (err2) => {

                          if (err2) {
                            return db.rollback(() => intentarSiguiente());
                          }

                          db.commit(err3 => {

                            if (err3) {
                              return db.rollback(() => intentarSiguiente());
                            }

                            enviarMail(turno, token);

                            return callback(true);

                          });

                        }
                      );

                    });

                  } else {

                    intentarSiguiente();

                  }

                }
              );

            }
          );

        }
      );

    }

    intentarSiguiente();

  });

}
//========================================================

function marcarNoDisponible(turnoId) {
  db.query(
    `UPDATE turnos
     SET estado = 'no_disponible'
     WHERE id = ?`,
    [turnoId],
    (err) => {
      if (err) console.error(err);
    }
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