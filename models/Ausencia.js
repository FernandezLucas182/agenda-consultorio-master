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

}

module.exports = Ausencia;