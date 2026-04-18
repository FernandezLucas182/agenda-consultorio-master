const db = require('./Db');

class Profesional {

  // ==========================
  // LISTAR TODOS (para gestión)
  // ==========================
  static obtenerTodos(filtro, callback) {

    let where = '';
    let params = [];

    if (filtro && filtro.trim() !== '') {
      where = `
      WHERE 
        p.nombre LIKE ? OR
        p.apellido LIKE ? OR
        p.dni LIKE ? OR
        p.matricula LIKE ?
    `;
      const like = `%${filtro}%`;
      params = [like, like, like, like];
    }

    const query = `
    SELECT 
      p.id, 
      p.nombre, 
      p.apellido,
      p.dni,
      p.telefono,
      p.email,
      p.estado, 
      p.matricula,
      GROUP_CONCAT(e.nombre) AS especialidades
    FROM profesionales p
    LEFT JOIN profesional_especialidad pe 
      ON p.id = pe.profesional_id
    LEFT JOIN especialidades e 
      ON pe.especialidad_id = e.id
    ${where}
    GROUP BY p.id
  `;

    db.query(query, params, (err, resultados) => {
      if (err) {
        console.error("ERROR SQL:", err);
        return callback(err);
      }
      callback(null, resultados || []);
    });
  }


  // ==========================
  // SOLO PROFESIONALES VÁLIDOS PARA TURNOS / AGENDAS  ✅ NUEVO
  // ==========================
  static obtenerConEspecialidades(callback) {
    const query = `
      SELECT DISTINCT 
        p.id, 
        CONCAT(p.nombre, ' ', p.apellido) AS nombre_completo
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
    { nombre, apellido, dni, telefono, email, matricula, especialidades },
    callback
  ) {

    const profesionalQuery = `
  INSERT INTO profesionales
  (nombre, apellido, dni, telefono, email, matricula, estado)
  VALUES (?, ?, ?, ?, ?, ?, 'activo')
`;

    db.query(
      profesionalQuery,
      [nombre, apellido, dni, telefono, email, matricula],
      (err, result) => {
        if (err) return callback(err);

        const profesionalId = result.insertId;

        if (especialidades && especialidades.length > 0) {
          especialidades
            .filter(eid => eid) // 🔴 elimina null / undefined
            .forEach(eid => {
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
    { nombre, apellido, dni, telefono, email, matricula, especialidades },
    callback
  ) {

    const profesionalQuery = `
    UPDATE profesionales 
    SET nombre = ?, apellido = ?, dni = ?, telefono = ?, email = ?, matricula = ?
    WHERE id = ?
  `;
    db.query(
      profesionalQuery,
      [nombre, apellido, dni, telefono, email, matricula, id],
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

    console.log("🟡 ID RECIBIDO EN obtenerPorId:", id); // 👈 LOG 1

    const query = `
    SELECT p.id, p.nombre, p.apellido, p.dni, p.telefono, p.email, p.matricula, p.estado
    FROM profesionales p
    WHERE p.id = ?
  `;

    db.query(query, [id], (err, resultados) => {

      if (err) {
        console.error("🔴 ERROR EN QUERY:", err); // 👈 LOG 2
        return callback(err);
      }

      console.log("🟢 RESULTADOS QUERY:", resultados); // 👈 LOG 3

      if (!resultados.length) {
        console.log("⚠️ NO SE ENCONTRÓ PROFESIONAL"); // 👈 LOG 4
        return callback(null, null);
      }

      callback(null, resultados[0]);
    });
  }

  // ==========================
  // SUCURSALES POR PROFESIONAL ✅ NUEVO
  // ==========================
  // ==========================
  // SUCURSALES POR PROFESIONAL 🔥 NUEVO
  // ==========================
  static obtenerSucursalesPorProfesional(profesionalId, callback) {
    const query = `
    SELECT s.id, s.nombre
    FROM sucursales s
    JOIN profesional_sucursal ps 
      ON s.id = ps.sucursal_id
    WHERE ps.profesional_id = ?
  `;

    db.query(query, [profesionalId], (err, resultados) => {
      if (err) return callback(err);
      callback(null, resultados || []);
    });
  }

}

module.exports = Profesional;
