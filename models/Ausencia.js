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

  static obtenerTodas(buscar, usuario, callback) {

    let sql = `
    SELECT 
      a.id,
      a.fecha_inicio,
      a.fecha_fin,
      a.motivo,

      CONCAT(p.nombre,' ',p.apellido) AS nombre_completo

    FROM ausencias a

    JOIN agendas ag
      ON a.agenda_id = ag.id

    JOIN profesionales p
      ON ag.profesional_id = p.id

    WHERE 1=1
  `;


    const params = [];


    if (usuario.rol === 'medico') {

      sql += `
      AND ag.profesional_id = ?
    `;

      params.push(usuario.profesional_id);

    }


    if (buscar) {

      sql += `
      AND (
        p.nombre LIKE ?
        OR p.apellido LIKE ?
        OR a.motivo LIKE ?
      )
    `;

      const like = `%${buscar}%`;

      params.push(
        like,
        like,
        like
      );

    }


    sql += `
    ORDER BY a.fecha_inicio DESC
  `;


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
  static existeAusenciaEnFecha(profesional_id, fecha, callback) {

    const sql = `
    SELECT au.id
    FROM ausencias au
    INNER JOIN agendas a
      ON a.id = au.agenda_id
    WHERE a.profesional_id = ?
      AND ? BETWEEN au.fecha_inicio AND au.fecha_fin
  `;

    db.query(sql, [profesional_id, fecha], (err, rows) => {

      if (err) return callback(err);

      callback(null, rows.length > 0);

    });

  }


  static obtenerPorAgenda(agenda_id, callback) {

    const sql = `
    SELECT
      id,
      fecha_inicio,
      fecha_fin,
      motivo
    FROM ausencias
    WHERE agenda_id = ?
    ORDER BY fecha_inicio
  `;

    db.query(sql, [agenda_id], callback);

  }

  static contarPendientes(callback) {

    const sql = `
    SELECT COUNT(*) AS total
    FROM solicitudes_ausencias
    WHERE estado = 'pendiente'
  `;


    db.query(sql, (err, rows) => {

      if (err) return callback(err);

      callback(null, rows[0].total);

    });

  }

  static obtenerConfirmadas(buscar, fecha, usuario, callback) {

    let sql = `

  SELECT
      a.*,
      CONCAT(p.nombre,' ',p.apellido) AS nombre_completo

  FROM ausencias a

  JOIN agendas ag
      ON a.agenda_id = ag.id

  JOIN profesionales p
      ON ag.profesional_id = p.id

  WHERE 1=1

  `;


    const params = [];


    if (usuario.rol === 'medico') {

      sql += `
      AND ag.profesional_id = ?
    `;

      params.push(usuario.profesional_id);

    }


    if (buscar) {

      sql += `
      AND (
        p.nombre LIKE ?
        OR p.apellido LIKE ?
        OR a.motivo LIKE ?
      )
    `;


      const like = `%${buscar}%`;

      params.push(
        like,
        like,
        like
      );

    }

    if (fecha) {

      sql += `
    AND ? BETWEEN a.fecha_inicio AND a.fecha_fin
  `;

      params.push(fecha);

    }


    sql += `
    ORDER BY a.fecha_inicio DESC
  `;


    db.query(sql, params, callback);

  }

}

module.exports = Ausencia;