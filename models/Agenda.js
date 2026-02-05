const db = require('./Db');

class Agenda {

  // Agenda completa para mostrar en vistas
 static obtenerAgendaCompleta(callback) {
  const sql = `
    SELECT 
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
  db.query(sql, callback);
}


  // Crear agenda base (por profesional + especialidad)
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

  // Agregar horarios a una agenda
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
}

module.exports = Agenda;
