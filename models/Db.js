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

// DEBUG TEMPORAL
const queryOriginal = db.query.bind(db);

db.query = function (sql, params, callback) {

  console.log("\n==============================");
  console.log("SQL:");
  console.log(sql);

  console.log("PARAMS:");
  console.log(params);

  if (Array.isArray(params)) {
    console.log("TIPOS:");
    console.log(params.map(p => typeof p));
  }

  console.log("==============================\n");

  return queryOriginal(sql, params, callback);
};


db.query(
  "SELECT DATABASE() as db",
  (err, r) => console.log(r)
);

module.exports = db;