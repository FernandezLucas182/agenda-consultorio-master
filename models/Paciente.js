const db = require('./Db');

class Paciente {

  static obtenerTodos(callback) {
    db.query(
      'SELECT * FROM pacientes',
      (err, resultados) => {

        if (err) return callback(err);

        callback(null, resultados || []);
      }
    );
  }

  static crear(datos, callback) {

    const {
      nombre,
      apellido,
      dni,
      obra_social,
      telefono,
      email
    } = datos;

    db.query(
      `
    INSERT INTO pacientes
    (
      nombre,
      apellido,
      dni,
      obra_social,
      telefono,
      email
    )
    VALUES (?, ?, ?, ?, ?, ?)
    `,
      [
        nombre,
        apellido || null,
        dni,
        obra_social || null,
        telefono || null,
        email || null
      ],
      callback
    );
  }

  static obtenerPorId(id, callback) {

    db.query(
      'SELECT * FROM pacientes WHERE id = ?',
      [id],
      (err, resultados) => {

        if (err) return callback(err);

        callback(null, resultados[0]);
      }
    );
  }

  static editar(id, datos, callback) {

    const {
      nombre,
      apellido,
      dni,
      obra_social,
      telefono,
      email
    } = datos;

    db.query(
      `
      UPDATE pacientes
      SET
        nombre = ?,
        apellido = ?,
        dni = ?,
        obra_social = ?,
        telefono = ?,
        email = ?
      WHERE id = ?
      `,
      [
        nombre,
        apellido,
        dni,
        obra_social || null,
        telefono || null,
        email || null,
        id
      ],
      callback
    );
  }

  static buscarPorDni(dni, callback) {

    db.query(
      'SELECT * FROM pacientes WHERE dni LIKE ?',
      [`%${dni}%`],
      (err, resultados) => {

        if (err) return callback(err);

        callback(null, resultados);
      }
    );
  }

  static obtenerPaginados(limit, offset, callback) {

    db.query(
      `
      SELECT *
      FROM pacientes
      ORDER BY apellido, nombre
      LIMIT ? OFFSET ?
      `,
      [limit, offset],
      (err, resultados) => {

        if (err) return callback(err);

        callback(null, resultados || []);

      }
    );

  }

  static contarPacientes(callback) {

    db.query(
      `
      SELECT COUNT(*) AS total
      FROM pacientes
      `,
      (err, resultados) => {

        if (err) return callback(err);

        callback(null, resultados[0].total);

      }
    );

  }

}

module.exports = Paciente;