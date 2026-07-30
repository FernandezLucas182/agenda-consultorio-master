const db = require('../models/Db');

function transferirAgendaMasiva(agendaOrigenId, profesionalDestinoId, callback) {
    db.getConnection((err, connection) => {
        if (err) return callback(err);

        connection.beginTransaction((err) => {
            if (err) {
                connection.release();
                return callback(err);
            }

            // 1️⃣ Buscar turnos de la agenda origen que chocan en fecha y hora con CUALQUIER turno previo del profesional destino
            const sqlColisiones = `
                SELECT t1.id 
                FROM turnos t1
                INNER JOIN turnos t2 
                  ON t1.fecha = t2.fecha 
                 AND t1.hora = t2.hora 
                 AND t2.profesional_id = ?
                WHERE t1.agenda_id = ? 
                  AND t1.fecha >= CURDATE()
                  AND t1.estado IN ('pendiente', 'confirmado', 'reservado')
            `;

            connection.query(sqlColisiones, [profesionalDestinoId, agendaOrigenId], (errCol, colisiones) => {
                if (errCol) {
                    return connection.rollback(() => {
                        connection.release();
                        callback(errCol);
                    });
                }

                const idsEnConflicto = colisiones.map(c => c.id);

                // Función auxiliar para reprogramar si hay conflictos
                const pasoReprogramar = (next) => {
                    if (idsEnConflicto.length === 0) return next();

                    const sqlReprogramar = `
                        UPDATE turnos 
                        SET estado = 'reprogramar' 
                        WHERE id IN (?)
                    `;
                    connection.query(sqlReprogramar, [idsEnConflicto], (errRep) => {
                        if (errRep) {
                            return connection.rollback(() => {
                                connection.release();
                                callback(errRep);
                            });
                        }
                        next();
                    });
                };

                // 2️⃣ Mover a 'reprogramar' los conflictivos y luego transferir los limpios
                pasoReprogramar(() => {
                    const sqlTurnos = `
                        UPDATE turnos 
                        SET profesional_id = ? 
                        WHERE agenda_id = ? 
                          AND fecha >= CURDATE() 
                          AND estado IN ('pendiente', 'confirmado', 'reservado')
                          ${idsEnConflicto.length > 0 ? 'AND id NOT IN (?)' : ''}
                    `;

                    const paramsTurnos = idsEnConflicto.length > 0
                        ? [profesionalDestinoId, agendaOrigenId, idsEnConflicto]
                        : [profesionalDestinoId, agendaOrigenId];

                    connection.query(sqlTurnos, paramsTurnos, (errUpdTurnos, resTurnos) => {
                        if (errUpdTurnos) {
                            return connection.rollback(() => {
                                connection.release();
                                callback(errUpdTurnos);
                            });
                        }

                        // 3️⃣ Desactivar la agenda origen
                        const sqlAgenda = `
                            UPDATE agendas 
                            SET activo = 0 
                            WHERE id = ?
                        `;

                        connection.query(sqlAgenda, [agendaOrigenId], (errUpdAgenda) => {
                            if (errUpdAgenda) {
                                return connection.rollback(() => {
                                    connection.release();
                                    callback(errUpdAgenda);
                                });
                            }

                            connection.commit((errCommit) => {
                                if (errCommit) {
                                    return connection.rollback(() => {
                                        connection.release();
                                        callback(errCommit);
                                    });
                                }

                                connection.release();
                                return callback(null, {
                                    total: resTurnos.affectedRows + idsEnConflicto.length,
                                    transferidos: resTurnos.affectedRows,
                                    reprogramados: idsEnConflicto.length
                                });
                            });
                        });
                    });
                });
            });
        });
    });
}

module.exports = { transferirAgendaMasiva };