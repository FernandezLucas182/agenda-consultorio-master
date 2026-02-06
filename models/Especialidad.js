const db = require('./Db');

class Especialidad {
  static obtenerTodas(callback) {
    db.query('SELECT id, nombre FROM especialidades', (err, resultados) => {
      if (err) return callback(err);
      callback(null, resultados || []);
    });
  }
}

module.exports = Especialidad;
