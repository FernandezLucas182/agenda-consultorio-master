const db = require('../models/Db');
const Turno = require('../models/Turno');
const Agenda = require('../models/Agenda');
const { marcarParaReprogramacion } = require('./reprogramacionService');

async function transferirAgendaMasiva(agendaOrigenId, profesionalDestinoId, callback) {
  // 1. Obtener datos de la agenda origen y la agenda destino del profesional
  const sqlAgendaDestino = `
    SELECT id FROM agendas 
    WHERE profesional_id = ? AND activo = 1 
    LIMIT 1`;

  db.query(sqlAgendaDestino, [profesionalDestinoId], (err, resDestino) => {
    if (err || !resDestino.length) {
      return callback(new Error("El profesional destino no posee una agenda activa asignada."));
    }

    const agendaDestinoId = resDestino[0].id;

    // 2. Buscar turnos futuros que requieren migración
    const sqlTurnos = `
      SELECT * FROM turnos 
      WHERE agenda_id = ? 
        AND fecha >= CURDATE() 
        AND estado IN ('pendiente', 'confirmado', 'reservado')`;

    db.query(sqlTurnos, [agendaOrigenId], async (errTurnos, turnos) => {
      if (errTurnos) return callback(errTurnos);

      if (!turnos || turnos.length === 0) {
        return callback(null, { transferidos: 0, aReprogramar: 0 });
      }

      let transferidos = 0;
      let aReprogramar = 0;

      // Iterar sobre cada turno para validar si el profesional destino tiene libre el slot exacto
      for (const turno of turnos) {
        const fechaObj = new Date(turno.fecha);
        let diaJS = fechaObj.getDay();
        let diaBD = diaJS === 0 ? 7 : diaJS;

        // Comprobar horarios ocupados del nuevo profesional en esa fecha
        Turno.obtenerHorariosOcupados(profesionalDestinoId, turno.fecha, (errOcupados, ocupados) => {
          
          const horarioOcupado = ocupados && ocupados.includes(turno.hora);

          if (!horarioOcupado) {
            // Se puede reasignar automáticamente
            db.query(
              `UPDATE turnos 
               SET profesional_id = ?, agenda_id = ? 
               WHERE id = ?`,
              [profesionalDestinoId, agendaDestinoId, turno.id],
              (errUpd) => {
                if (!errUpd) transferidos++;
              }
            );
          } else {
            // Pasa a la vista de Reprogramaciones (reprogramacionTurno.pug)
            marcarParaReprogramacion(turno.id);
            aReprogramar++;
          }
        });
      }

      return callback(null, { total: turnos.length });
    });
  });
}

module.exports = { transferirAgendaMasiva };