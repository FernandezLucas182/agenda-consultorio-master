const db = require('./Db');

class Profesional {

  // ==========================
  // LISTAR TODOS (para gestión)
  // ==========================
  static obtenerTodos(callback) {
    const query = `
      SELECT p.id, p.nombre_completo, p.estado, p.matricula, 
             GROUP_CONCAT(e.nombre) AS especialidades
      FROM profesionales p
      LEFT JOIN profesional_especialidad pe ON p.id = pe.profesional_id
      LEFT JOIN especialidades e ON pe.especialidad_id = e.id
      GROUP BY p.id
    `;

    db.query(query, (err, resultados) => {
      if (err) return callback(err);
      callback(null, resultados || []);
    });
  }


  // ==========================
  // SOLO PROFESIONALES VÁLIDOS PARA TURNOS / AGENDAS  ✅ NUEVO
  // ==========================
  static obtenerConEspecialidades(callback) {
    const query = `
      SELECT DISTINCT p.id, p.nombre_completo
      FROM profesionales p
      JOIN profesional_especialidad pe
        ON p.id = pe.profesional_id
      WHERE p.estado = 'activo'
    `;

    db.query(query, (err, resultados) => {
      if (err) return callback(err);
      callback(null, resultados || []);
    });
  }


  // ==========================
  // CREAR PROFESIONAL
  // ==========================
  static crear(
    { nombre, matricula, especialidades, hora_inicio_turno1, hora_fin_turno1, hora_inicio_turno2, hora_fin_turno2 },
    callback
  ) {

    const profesionalQuery = `
      INSERT INTO profesionales 
      (nombre_completo, matricula, hora_inicio_turno1, hora_fin_turno1, hora_inicio_turno2, hora_fin_turno2, estado)
      VALUES (?, ?, ?, ?, ?, ?, 'activo')
    `;

    db.query(
      profesionalQuery,
      [nombre, matricula, hora_inicio_turno1, hora_fin_turno1, hora_inicio_turno2, hora_fin_turno2],
      (err, result) => {
        if (err) return callback(err);

        const profesionalId = result.insertId;

        if (especialidades && especialidades.length > 0) {
          especialidades.forEach(eid => {
            db.query(
              'INSERT INTO profesional_especialidad (profesional_id, especialidad_id) VALUES (?, ?)',
              [profesionalId, eid]
            );
          });
        }

        callback(null);
      }
    );
  }


  // ==========================
  // EDITAR PROFESIONAL
  // ==========================
  static editar(
    id,
    { nombre, matricula, especialidades, hora_inicio_turno1, hora_fin_turno1, hora_inicio_turno2, hora_fin_turno2 },
    callback
  ) {

    const profesionalQuery = `
      UPDATE profesionales 
      SET nombre_completo = ?, matricula = ?, 
          hora_inicio_turno1 = ?, hora_fin_turno1 = ?, 
          hora_inicio_turno2 = ?, hora_fin_turno2 = ?
      WHERE id = ?
    `;

    db.query(
      profesionalQuery,
      [nombre, matricula, hora_inicio_turno1, hora_fin_turno1, hora_inicio_turno2, hora_fin_turno2, id],
      err => {
        if (err) return callback(err);

        db.query(
          'DELETE FROM profesional_especialidad WHERE profesional_id = ?',
          [id],
          err => {
            if (err) return callback(err);

            if (especialidades && especialidades.length > 0) {
              const values = especialidades.map(eid => [id, eid]);
              db.query(
                'INSERT INTO profesional_especialidad (profesional_id, especialidad_id) VALUES ?',
                [values],
                callback
              );
            } else {
              callback(null);
            }
          }
        );
      }
    );
  }


  // ==========================
  // ESTADO
  // ==========================
  static inactivar(id, callback) {
    db.query('UPDATE profesionales SET estado = "inactivo" WHERE id = ?', [id], callback);
  }

  static activar(id, callback) {
    db.query('UPDATE profesionales SET estado = "activo" WHERE id = ?', [id], callback);
  }


  // ==========================
  // ESPECIALIDADES
  // ==========================
  static obtenerEspecialidades(callback) {
    db.query('SELECT * FROM especialidades', (err, resultados) => {
      if (err) return callback(err);
      callback(null, resultados || []);
    });
  }


  static obtenerEspecialidadesPorProfesional(profesionalId, callback) {
    const query = `
      SELECT e.id, e.nombre
      FROM especialidades e
      JOIN profesional_especialidad pe 
        ON e.id = pe.especialidad_id
      WHERE pe.profesional_id = ?
    `;

    db.query(query, [profesionalId], (err, resultados) => {
      if (err) return callback(err);
      callback(null, resultados || []);
    });
  }


  // ==========================
  // PROFESIONAL POR ID
  // ==========================
  static obtenerPorId(id, callback) {
    const query = `
      SELECT p.id, p.nombre_completo, p.matricula, p.estado, 
             GROUP_CONCAT(e.nombre) AS especialidades,
             p.hora_inicio_turno1, p.hora_fin_turno1,
             p.hora_inicio_turno2, p.hora_fin_turno2
      FROM profesionales p
      LEFT JOIN profesional_especialidad pe ON p.id = pe.profesional_id
      LEFT JOIN especialidades e ON pe.especialidad_id = e.id
      WHERE p.id = ?
      GROUP BY p.id
    `;

    db.query(query, [id], (err, resultados) => {
      if (err) return callback(err);
      if (!resultados.length) return callback(new Error('No encontrado'));

      const profesional = resultados[0];
      profesional.especialidades = profesional.especialidades
        ? profesional.especialidades.split(',')
        : [];

      callback(null, profesional);
    });
  }

}

module.exports = Profesional;
