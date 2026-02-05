const db = require('./Db'); // Asegúrate de tener una configuración de base de datos

class Paciente {
  static obtenerTodos(callback) {
    db.query('SELECT * FROM pacientes', (err, resultados) => {
      if (err) return callback(err);
      callback(null, resultados);
    });
  }

  static crear(datos, callback) {
    const { nombre, dni, obra_social, contacto } = datos;
    db.query('INSERT INTO pacientes (nombre, dni, obra_social, contacto) VALUES (?, ?, ?, ?)', 
      [nombre, dni, obra_social, contacto], 
      (err) => {
        if (err) return callback(err);
        callback(null);
      }
    );
  }

  static obtenerPorId(id, callback) {
    db.query('SELECT * FROM pacientes WHERE id = ?', [id], (err, resultados) => {
      if (err) return callback(err);
      callback(null, resultados[0]);
    });
  }

  static editar(id, datos, callback) {
    const { nombre, dni, obra_social, contacto } = datos;
    db.query('UPDATE pacientes SET nombre = ?, dni = ?, obra_social = ?, contacto = ? WHERE id = ?', 
      [nombre, dni, obra_social, contacto, id], 
      (err) => {
        if (err) return callback(err);
        callback(null);
      }
    );
  }
}

module.exports = Paciente;
