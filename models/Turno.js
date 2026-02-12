const db = require('./Db');

class Turno {

  // ==========================
  // OBTENER TODOS LOS TURNOS
  // ==========================
  static obtenerTodos(callback) {

    const sql = `
      SELECT 
        t.id,
        t.fecha,
        t.hora,
        t.estado,

        p.nombre AS paciente_nombre,
        pr.nombre_completo AS profesional_nombre,
        e.nombre AS especialidad_nombre,
        s.nombre AS sucursal_nombre

      FROM turnos t
      LEFT JOIN pacientes p ON t.paciente_id = p.id
      LEFT JOIN profesionales pr ON t.profesional_id = pr.id
      LEFT JOIN especialidades e ON t.especialidad_id = e.id
      LEFT JOIN sucursales s ON t.sucursal_id = s.id
      ORDER BY t.fecha, t.hora
    `;

    db.query(sql, (err, filas) => {
      if (err) {
        console.error('❌ ERROR SQL TURNOS:', err);
        return callback(err);
      }

      callback(null, filas || []);
    });
  }


  // ==========================
  // OBTENER UN TURNO POR ID
  // ==========================
  static obtenerPorId(id, callback) {

  const sql = `
    SELECT 
      t.id,
      t.fecha,
      t.hora,
      t.estado,

      t.paciente_id,
      t.profesional_id,
      t.especialidad_id,
      t.sucursal_id,

      p.nombre AS paciente_nombre,
      pr.nombre_completo AS profesional_nombre,
      e.nombre AS especialidad_nombre,
      s.nombre AS sucursal_nombre

    FROM turnos t
    LEFT JOIN pacientes p ON t.paciente_id = p.id
    LEFT JOIN profesionales pr ON t.profesional_id = pr.id
    LEFT JOIN especialidades e ON t.especialidad_id = e.id
    LEFT JOIN sucursales s ON t.sucursal_id = s.id
    WHERE t.id = ?
  `;

  db.query(sql, [id], (err, filas) => {
    if (err) return callback(err);
    callback(null, filas[0] || null);
  });
}



  // ==========================
  // CREAR TURNO
  // ==========================
  static crear(datos, callback) {

    const {
      paciente_id,
      profesional_id,
      especialidad_id,
      sucursal_id,
      fecha,
      hora
    } = datos;

    const sql = `
      INSERT INTO turnos 
      (paciente_id, profesional_id, especialidad_id, sucursal_id, fecha, hora)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [paciente_id, profesional_id, especialidad_id, sucursal_id, fecha, hora],
      callback
    );
  }


  // ==========================
  // EDITAR TURNO
  // ==========================
  static editar(id, datos, callback) {

    const {
      paciente_id,
      profesional_id,
      especialidad_id,
      sucursal_id,
      fecha,
      hora,
      estado
    } = datos;

    const sql = `
      UPDATE turnos 
      SET 
        paciente_id = ?,
        profesional_id = ?,
        especialidad_id = ?,
        sucursal_id = ?,
        fecha = ?,
        hora = ?,
        estado = ?
      WHERE id = ?
    `;

    db.query(
      sql,
      [
        paciente_id,
        profesional_id,
        especialidad_id,
        sucursal_id,
        fecha,
        hora,
        estado,
        id
      ],
      callback
    );
  }


  // ==========================
  // ELIMINAR TURNO
  // ==========================
  static eliminar(id, callback) {
    db.query('DELETE FROM turnos WHERE id = ?', [id], callback);
  }


  // ==========================
  // HORARIOS OCUPADOS
  // ==========================
  static obtenerHorariosOcupados(profesionalId, fecha, callback) {

    const sql = `
      SELECT hora
      FROM turnos
      WHERE profesional_id = ? 
        AND fecha = ?
    `;

    db.query(sql, [profesionalId, fecha], (err, filas) => {
      if (err) return callback(err);

      const ocupados = filas.map(f => f.hora);
      callback(null, ocupados);
    });
  }

}

module.exports = Turno;
