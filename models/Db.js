const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',          // o tu usuario
  password: '',
  database: 'agenda_consultorio'
});

db.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos agenda_consultorio');
});

module.exports = db;
