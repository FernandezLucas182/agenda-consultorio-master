const db = require('./Db');

class Ausencia {

  static crear(datos, callback) {
    const { agenda_id, fecha_inicio, fecha_fin, motivo } = datos;

    const sql = `
    INSERT INTO ausencias
    (agenda_id, fecha_inicio, fecha_fin, motivo)
    VALUES (?, ?, ?, ?)
  `;

    db.query(sql, [agenda_id, fecha_inicio, fecha_fin, motivo], callback);
  }

  static obtenerTodas(buscar, callback) {

    let sql = `
    SELECT 
      a.*, 
      CONCAT(p.nombre, ' ', p.apellido) AS nombre_completo
    FROM ausencias a
    JOIN agendas ag ON a.agenda_id = ag.id
    JOIN profesionales p ON ag.profesional_id = p.id
  `;

    const params = [];

    if (buscar) {
      sql += `
      WHERE 
        p.nombre LIKE ? OR
        p.apellido LIKE ? OR
        a.motivo LIKE ?
    `;

      const like = `%${buscar}%`;
      params.push(like, like, like);
    }

    sql += ` ORDER BY a.fecha_inicio DESC`;

    db.query(sql, params, callback);
  }


  static obtenerPorId(id, callback) {
    db.query(
      `SELECT 
      a.*,
      ag.id AS agenda_id,
      p.id AS profesional_id,
      CONCAT(p.nombre, ' ', p.apellido) AS nombre_completo
    FROM ausencias a
    JOIN agendas ag ON a.agenda_id = ag.id
    JOIN profesionales p ON ag.profesional_id = p.id
    WHERE a.id = ?`,
      [id],
      (err, rows) => {
        if (err) return callback(err);
        callback(null, rows[0]);
      }
    );
  }

  static actualizar(id, datos, callback) {
    const { agenda_id, fecha_inicio, fecha_fin, motivo } = datos;

    const sql = `
  UPDATE ausencias
  SET agenda_id = ?, 
      fecha_inicio = ?, 
      fecha_fin = ?, 
      motivo = ?
  WHERE id = ?
`;

    db.query(
      sql,
      [agenda_id, fecha_inicio, fecha_fin, motivo, id],
      callback
    );
  }
  static existeAusenciaEnFecha(agenda_id, fecha, callback) {
    const sql = `
  SELECT id
  FROM ausencias
  WHERE agenda_id = ?
    AND ? BETWEEN fecha_inicio AND fecha_fin
`;

    db.query(sql, [agenda_id, fecha], (err, rows) => {
      if (err) return callback(err);
      callback(null, rows.length > 0);
    });
  }

}

module.exports = Ausencia;