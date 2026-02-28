const db = require('./Db');

class Ausencia {

  static crear(datos, callback) {
    const { profesional_id, fecha_inicio, fecha_fin, motivo } = datos;

    const sql = `
      INSERT INTO ausencias
      (profesional_id, fecha_inicio, fecha_fin, motivo)
      VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [profesional_id, fecha_inicio, fecha_fin, motivo], callback);
  }

  static obtenerTodas(callback) {
    db.query(
      `SELECT a.*, p.nombre_completo
       FROM ausencias a
       JOIN profesionales p ON a.profesional_id = p.id
       ORDER BY a.fecha_inicio DESC`,
      callback
    );
  }


  static obtenerPorId(id, callback) {
    db.query(
      `SELECT * FROM ausencias WHERE id = ?`,
      [id],
      (err, rows) => {
        if (err) return callback(err);
        callback(null, rows[0]);
      }
    );
  }

  static actualizar(id, datos, callback) {
    const { profesional_id, fecha_inicio, fecha_fin, motivo } = datos;

    const sql = `
    UPDATE ausencias
    SET profesional_id = ?, 
        fecha_inicio = ?, 
        fecha_fin = ?, 
        motivo = ?
    WHERE id = ?
  `;

    db.query(
      sql,
      [profesional_id, fecha_inicio, fecha_fin, motivo, id],
      callback
    );
  }

  static existeAusenciaEnFecha(profesionalId, fecha, callback) {

    const sql = `
    SELECT a.id
    FROM ausencias a
    JOIN agendas ag ON a.agenda_id = ag.id
    WHERE ag.profesional_id = ?
      AND ag.activo = 1
      AND ? BETWEEN a.fecha_inicio AND a.fecha_fin
  `;

    db.query(sql, [profesionalId, fecha], (err, rows) => {
      if (err) return callback(err);
      callback(null, rows.length > 0);
    });

  }

}

module.exports = Ausencia;