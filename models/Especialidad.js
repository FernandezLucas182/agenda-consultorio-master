const db = require('./Db');

class Especialidad {
  static obtenerTodas(callback) {
    db.query('SELECT id, nombre FROM especialidades', callback);
  }
}

module.exports = Especialidad;
