const db = require('./Db');

class Agenda {

  static obtenerAgendasBase(callback) {
    const sql = `
      SELECT 
        a.id,
        p.nombre_completo,
        e.nombre AS especialidad,
        a.duracion_turno
      FROM agendas_nueva a
      JOIN profesionales p ON a.profesional_id = p.id
      JOIN especialidades e ON a.especialidad_id = e.id
      WHERE a.activo = 1
      ORDER BY p.nombre_completo
    `;

    db.query(sql, (err, resultados) => {
      if (err) return callback(err);
      callback(null, resultados || []);
    });
  }

  static obtenerAgendaCompleta(callback) {
    const sql = `
      SELECT 
        a.profesional_id,
        p.nombre_completo,
        e.nombre AS especialidad,
        ah.dia_semana,
        ah.hora_inicio,
        ah.hora_fin,
        a.duracion_turno,
        a.id AS agenda_id,
        a.activo
      FROM agenda_horarios ah
      JOIN agendas_nueva a ON ah.agenda_id = a.id
      JOIN profesionales p ON a.profesional_id = p.id
      JOIN especialidades e ON a.especialidad_id = e.id
      ORDER BY p.nombre_completo, ah.dia_semana, ah.hora_inicio
    `;

    db.query(sql, (err, resultados) => {
      if (err) return callback(err);
      callback(null, resultados || []);
    });
  }

  // ✅ CORREGIDA (único cambio importante)
  static obtenerHorariosProfesional(profesionalId, diaSemana, callback) {
    const sql = `
      SELECT 
        ah.hora_inicio,
        ah.hora_fin,
        a.duracion_turno
      FROM agenda_horarios ah
      JOIN agendas_nueva a ON ah.agenda_id = a.id
      WHERE a.profesional_id = ?
        AND ah.dia_semana = ?
        AND a.activo = 1
    `;

    db.query(sql, [profesionalId, diaSemana], (err, resultados) => {
      if (err) return callback(err);
      callback(null, resultados || []);
    });
  }

  static crearAgendaBase(datos, callback) {
    const { profesional_id, especialidad_id, duracion_turno } = datos;

    db.query(
      `INSERT INTO agendas_nueva 
       (profesional_id, especialidad_id, duracion_turno, activo) 
       VALUES (?, ?, ?, 1)`,
      [profesional_id, especialidad_id, duracion_turno],
      callback
    );
  }

  static agregarHorario(datos, callback) {
    const { agenda_id, dia_semana, hora_inicio, hora_fin } = datos;

    db.query(
      `INSERT INTO agenda_horarios 
       (agenda_id, dia_semana, hora_inicio, hora_fin)
       VALUES (?, ?, ?, ?)`,
      [agenda_id, dia_semana, hora_inicio, hora_fin],
      callback
    );
  }

  static obtenerAgendaBasePorId(id, callback) {
    const sql = `
      SELECT 
        a.id,
        p.nombre_completo,
        e.nombre AS especialidad,
        a.duracion_turno
      FROM agendas_nueva a
      JOIN profesionales p ON a.profesional_id = p.id
      JOIN especialidades e ON a.especialidad_id = e.id
      WHERE a.id = ?
    `;

    db.query(sql, [id], (err, resultados) => {
      if (err) return callback(err);
      callback(null, resultados[0] || null);
    });
  }

}

module.exports = Agenda;
