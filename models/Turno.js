const db = require('./Db');

class Turno {

  // ==========================
  // CRUD BÁSICO
  // ==========================

  static obtenerTodos(callback) {
    db.query('SELECT * FROM turnos', callback);
  }

  static obtenerPorId(id, callback) {
    db.query('SELECT * FROM turnos WHERE id = ?', [id], (err, rows) => {
      if (err) return callback(err);
      callback(null, rows[0]);
    });
  }

  static crear(data, callback) {
    db.query(
      `INSERT INTO turnos
       (paciente_id, profesional_id, especialidad_id, sucursal_id, fecha, hora, estado, tipo_turno)
       VALUES (?, ?, ?, ?, ?, ?, 'reservado', ?)`,
      [
        data.paciente_id,
        data.profesional_id,
        data.especialidad_id,
        data.sucursal_id,
        data.fecha,
        data.hora,
        data.tipo_turno || 'normal'
      ],
      callback
    );
  }

  static actualizar(id, data, callback) {
    db.query(
      `UPDATE turnos SET
        paciente_id = ?,
        profesional_id = ?,
        especialidad_id = ?,
        sucursal_id = ?,
        fecha = ?,
        hora = ?,
        estado = ?
       WHERE id = ?`,
      [
        data.paciente_id,
        data.profesional_id,
        data.especialidad_id,
        data.sucursal_id,
        data.fecha,
        data.hora,
        data.estado,
        id
      ],
      callback
    );
  }

  static eliminar(id, callback) {
    db.query(`DELETE FROM turnos WHERE id = ?`, [id], callback);
  }

  // ==========================
  // HORARIOS
  // ==========================

  static obtenerHorariosOcupados(profesional_id, fecha, callback) {
    db.query(
      `SELECT hora
       FROM turnos
       WHERE profesional_id = ?
         AND fecha = ?
         AND estado IN ('reservado','confirmado')`,
      [profesional_id, fecha],
      (err, rows) => {
        if (err) return callback(err);
        callback(null, rows.map(r => r.hora));
      }
    );
  }

  // ==========================
  // SOBRETURNOS
  // ==========================

  static contarSobreturnos(profesional_id, fecha, callback) {
    db.query(
      `SELECT COUNT(*) as total
       FROM turnos
       WHERE profesional_id = ?
         AND fecha = ?
         AND tipo_turno = 'sobreturno'
         AND estado IN ('reservado','confirmado')`,
      [profesional_id, fecha],
      (err, rows) => {
        if (err) return callback(err);
        callback(null, rows[0].total);
      }
    );
  }

  static obtenerMaxSobreturnos(profesional_id, especialidad_id, callback) {
    db.query(
      `SELECT max_sobreturnos
       FROM agendas_nueva
       WHERE profesional_id = ?
         AND especialidad_id = ?
         AND activo = 1`,
      [profesional_id, especialidad_id],
      (err, rows) => {
        if (err) return callback(err);
        callback(null, rows[0]?.max_sobreturnos || 0);
      }
    );
  }

  // ==========================
  // CONFIRMAR
  // ==========================

  static buscarPorToken(token, callback) {
    db.query(
      `SELECT * FROM turnos WHERE token_confirmacion = ?`,
      [token],
      (err, rows) => {
        if (err) return callback(err);
        callback(null, rows[0]);
      }
    );
  }

  static confirmar(id, callback) {
    db.query(
      `UPDATE turnos
       SET estado = 'confirmado',
           token_confirmacion = NULL,
           requiere_confirmacion = 0
       WHERE id = ?`,
      [id],
      callback
    );
  }

  // ==========================
  // LISTADOS AUXILIARES
  // ==========================

  static obtenerEspecialidades(callback) {
    db.query('SELECT * FROM especialidades', callback);
  }

  static obtenerPacientes(callback) {
    db.query('SELECT * FROM pacientes', callback);
  }

  static obtenerSucursales(callback) {
    db.query('SELECT * FROM sucursales', callback);
  }

  static obtenerEspecialidadesPorProfesional(profesionalId, callback) {
    db.query(
      `SELECT e.id, e.nombre
       FROM especialidades e
       JOIN profesional_especialidad pe
         ON e.id = pe.especialidad_id
       WHERE pe.profesional_id = ?`,
      [profesionalId],
      callback
    );
  }

  static obtenerProfesionalesPorEspecialidad(especialidadId, callback) {
    db.query(
      `SELECT p.id, p.nombre_completo
       FROM profesionales p
       JOIN profesional_especialidad pe
         ON p.id = pe.profesional_id
       WHERE pe.especialidad_id = ?
         AND p.estado = 'activo'`,
      [especialidadId],
      callback
    );
  }

}

module.exports = Turno;