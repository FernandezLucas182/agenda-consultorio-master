const mysql = require('mysql2');



const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'agenda_consultorio',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

db.query(
"SELECT DATABASE() as db",
(err,r)=>console.log(r)
);

module.exports = db;