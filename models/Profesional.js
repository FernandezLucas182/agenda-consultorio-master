const db = require('./Db');

class Profesional {

  // ==========================
  // LISTAR TODOS (para gestión)
  // ==========================
  static obtenerTodos(filtro, limite, offset, callback) {

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
      p.created_at,
      p.updated_at,
      GROUP_CONCAT(e.nombre) AS especialidades
    FROM profesionales p
    LEFT JOIN profesional_especialidad pe
      ON p.id = pe.profesional_id
    LEFT JOIN especialidades e
      ON pe.especialidad_id = e.id
    ${where}
    GROUP BY p.id
    ORDER BY p.apellido, p.nombre
    LIMIT ?
    OFFSET ?
  `;

    db.query(
      query,
      [...params, limite, offset],
      (err, resultados) => {

        if (err) {
          console.error("ERROR SQL:", err);
          return callback(err);
        }

        callback(null, resultados || []);

      }
    );

  }

  static contarTodos(filtro, callback) {

    let where = '';
    let params = [];

    if (filtro && filtro.trim() !== '') {

      where = `
      WHERE
        nombre LIKE ?
        OR apellido LIKE ?
        OR dni LIKE ?
        OR matricula LIKE ?
    `;

      const like = `%${filtro}%`;
      params = [like, like, like, like];

    }

    db.query(

      `
    SELECT COUNT(*) AS total
    FROM profesionales
    ${where}
    `,

      params,

      (err, rows) => {

        if (err) return callback(err);

        callback(null, rows[0].total);

      }

    );

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

        callback(null, profesionalId);
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

    especialidades = (especialidades || []).map(Number);

    // Obtener especialidades actuales
    db.query(
      'SELECT especialidad_id FROM profesional_especialidad WHERE profesional_id = ?',
      [id],
      (err, rows) => {

        if (err) return callback(err);

        const actuales = rows.map(r => Number(r.especialidad_id));

        // Especialidades que se intentan eliminar
        const eliminadas = actuales.filter(e => !especialidades.includes(e));

        // Si no se elimina ninguna, continuar normalmente
        if (eliminadas.length === 0) {
          return guardarCambios();
        }

        const placeholders = eliminadas.map(() => '?').join(',');

        db.query(
          `
        SELECT DISTINCT e.nombre
        FROM agendas a
        INNER JOIN especialidades e
          ON e.id = a.especialidad_id
        WHERE a.profesional_id = ?
        AND a.especialidad_id IN (${placeholders})
        `,
          [id, ...eliminadas],
          (err, agendasEnUso) => {

            if (err) return callback(err);

            if (agendasEnUso.length > 0) {

              return callback({
                codigo: 'ESPECIALIDAD_EN_USO',
                especialidades: agendasEnUso.map(a => a.nombre)
              });

            }

            guardarCambios();

          }

        );

      }

    );

    function guardarCambios() {

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

              if (especialidades.length > 0) {

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
      SELECT
        e.id,
        e.nombre,
        EXISTS (
          SELECT 1
          FROM agendas a
          WHERE a.profesional_id = pe.profesional_id
          AND a.especialidad_id = e.id
        ) AS enUso
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


  // ==========================
  // PROFESIONALES POR SUCURSAL
  // ==========================
  static obtenerPorSucursal(sucursalId, callback) {

    const query = `
    SELECT p.id, p.nombre, p.apellido
    FROM profesionales p
    JOIN profesional_sucursal ps 
      ON p.id = ps.profesional_id
    WHERE ps.sucursal_id = ?
      AND p.estado = 'activo'
    ORDER BY p.apellido, p.nombre
  `;

    db.query(query, [sucursalId], (err, resultados) => {
      if (err) return callback(err);
      callback(null, resultados || []);
    });
  }


  // ==========================
  // para copiar agenda
  // ==========================

  static obtenerParaCopiarAgenda(sucursalId, especialidadId, callback) {

    let query;
    let params;

    // ===== PROFESIONALES SIN SUCURSAL =====
    if (sucursalId === 'sin') {

      query = `
      SELECT DISTINCT
          p.id,
          p.nombre,
          p.apellido
      FROM profesionales p

      INNER JOIN profesional_especialidad pe
          ON pe.profesional_id = p.id

      WHERE
          p.estado = 'activo'
          AND pe.especialidad_id = ?
          AND NOT EXISTS (
              SELECT 1
              FROM profesional_sucursal ps
              WHERE ps.profesional_id = p.id
          )

      ORDER BY p.apellido, p.nombre
    `;

      params = [especialidadId];

    } else {

      // ===== PROFESIONALES DE UNA SUCURSAL =====
      query = `
      SELECT DISTINCT
          p.id,
          p.nombre,
          p.apellido
      FROM profesionales p

      INNER JOIN profesional_especialidad pe
          ON pe.profesional_id = p.id

      INNER JOIN profesional_sucursal ps
          ON ps.profesional_id = p.id

      WHERE
          p.estado = 'activo'
          AND pe.especialidad_id = ?
          AND ps.sucursal_id = ?

      ORDER BY p.apellido, p.nombre
    `;

      params = [especialidadId, sucursalId];
    }

    db.query(query, params, (err, resultados) => {
      if (err) return callback(err);

      callback(null, resultados || []);
    });

  }


}

module.exports = Profesional;
