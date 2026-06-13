const db = require('./Db');

function normalizarHora(hora) {
  if (!hora) return null;

  const partes = hora.split(':');

  const hh = partes[0].padStart(2, '0');
  const mm = (partes[1] || '00').padStart(2, '0');

  return `${hh}:${mm}`;
}

class Turno {

  // ==========================
  // CRUD BÁSICO
  // ==========================

  static obtenerTodos(callback) {

    const sql = `
      SELECT 
        t.id,
        t.fecha,
        t.hora,
        t.estado,
        t.tipo_turno,

        p.nombre AS paciente_nombre,
        p.telefono AS paciente_telefono,
        p.email AS paciente_email,
        p.obra_social AS paciente_obra_social,

        CONCAT(pr.nombre, ' ', pr.apellido)
          AS profesional_nombre,

        e.nombre AS especialidad_nombre,
        s.nombre AS sucursal_nombre

      FROM turnos t

      JOIN pacientes p
        ON t.paciente_id = p.id

      JOIN profesionales pr
        ON t.profesional_id = pr.id

      JOIN especialidades e
        ON t.especialidad_id = e.id

      JOIN sucursales s
        ON t.sucursal_id = s.id

      ORDER BY t.fecha DESC, t.hora ASC
    `;

    db.query(sql, callback);
  }
  //=======================
  //Obtener Por Id
  //=======================
  static obtenerPorId(id, callback) {
    const sql = `
    SELECT 
      t.*,
      p.telefono,
      p.email,
      p.obra_social,
      p.nombre AS paciente_nombre,

      CONCAT(pr.nombre, ' ', pr.apellido)
        AS profesional_nombre,

      e.nombre AS especialidad_nombre,
      s.nombre AS sucursal_nombre
      
    FROM turnos t

    JOIN pacientes p
      ON p.id = t.paciente_id

    JOIN profesionales pr
      ON pr.id = t.profesional_id

    JOIN especialidades e
      ON e.id = t.especialidad_id

    LEFT JOIN sucursales s
      ON s.id = t.sucursal_id

    WHERE t.id = ?
  `;

    db.query(sql, [id], (err, rows) => {

      if (err) {
        console.log("ERROR SQL:", err);
        return callback(err);
      }

      console.log("ROWS:", rows);

      callback(null, rows[0]);

    });
  }


  static crear(data, callback) {
    db.query(
      `INSERT INTO turnos
     (agenda_id, paciente_id, profesional_id, especialidad_id, sucursal_id, fecha, hora, estado, tipo_turno)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'reservado', ?)`,
      [
        data.agenda_id,
        data.paciente_id,
        data.profesional_id,
        data.especialidad_id,
        data.sucursal_id,
        data.fecha,
        data.hora,
        data.tipo_turno || 'normal'
      ],
      callback
    );
  }

  static actualizar(id, data, callback) {

    const sql = `
    UPDATE turnos SET
      paciente_id = ?,
      profesional_id = ?,
      especialidad_id = ?,
      fecha = ?,
      hora = ?,
      tipo_turno = ?
    WHERE id = ?
  `;

    db.query(
      sql,
      [
        data.paciente_id,
        data.profesional_id,
        data.especialidad_id,
        data.fecha,
        data.hora,
        data.tipo_turno,
        id
      ],
      callback
    );

  }

  static eliminar(id, callback) {
    db.query(`DELETE FROM turnos WHERE id = ?`, [id], callback);
  }

  // ==========================
  // HORARIOS
  // ==========================

  static obtenerHorariosOcupados(profesional_id, fecha, callback) {

    console.log("BUSCANDO OCUPADOS:", profesional_id, fecha);

    db.query(
      `SELECT DATE_FORMAT(hora, '%H:%i') AS hora
     FROM turnos
     WHERE profesional_id = ?
       AND fecha = ?
       AND estado != 'cancelado'`,
      [profesional_id, fecha],
      (err, rows) => {

        if (err) return callback(err);

        console.log("RESULTADO BD:", rows); // ✅ ahora sí existe

        const horas = rows.map(r => r.hora);

        callback(null, horas);
      }
    );
  }

  static existeTurnoEnHorario(profesional_id, fecha, hora, callback) {
    const sql = `
    SELECT COUNT(*) as total
    FROM turnos
    WHERE profesional_id = ?
      AND fecha = ?
      AND TIME_FORMAT(hora, '%H:%i') = ?
      AND estado IN ('reservado', 'confirmado', 'pendiente')
  `;

    db.query(sql, [profesional_id, fecha, hora], (err, rows) => {
      if (err) return callback(err);
      callback(null, rows[0].total > 0);
    });
  }






  // ==========================
  // SOBRETURNOS
  // ==========================



  static obtenerMaxSobreturnos(profesional_id, especialidad_id, callback) {
    db.query(
      `SELECT max_sobreturnos
       FROM agendas
       WHERE profesional_id = ?
         AND especialidad_id = ?
         AND activo = 1`,
      [profesional_id, especialidad_id],
      (err, rows) => {
        if (err) return callback(err);
        callback(null, rows[0]?.max_sobreturnos || 0);
      }
    );
  }

  // ==========================
  // CONFIRMAR
  // ==========================

  static buscarPorToken(token, callback) {
    db.query(
      `SELECT * FROM turnos WHERE token_confirmacion = ?`,
      [token],
      (err, rows) => {
        if (err) return callback(err);
        callback(null, rows[0]);
      }
    );
  }

  static confirmar(id, callback) {
    db.query(
      `UPDATE turnos
       SET estado = 'confirmado',
           token_confirmacion = NULL,
           requiere_confirmacion = 0
       WHERE id = ?`,
      [id],
      callback
    );
  }

  // ==========================
  // LISTADOS AUXILIARES
  // ==========================

  static obtenerEspecialidades(callback) {
    db.query('SELECT * FROM especialidades', callback);
  }

  static obtenerPacientes(callback) {
    db.query('SELECT * FROM pacientes', callback);
  }

  static obtenerSucursales(callback) {
    db.query('SELECT * FROM sucursales', callback);
  }

  static obtenerTodosProfesionales(callback) {

    const sql = `
      SELECT
        id,
        CONCAT(nombre,' ',apellido) AS nombre_completo
      FROM profesionales
      WHERE estado = 'activo'
      ORDER BY apellido, nombre
    `;

    db.query(sql, callback);

  }

  static obtenerEspecialidadesPorProfesional(profesionalId, callback) {
    db.query(
      `SELECT e.id, e.nombre
       FROM especialidades e
       JOIN profesional_especialidad pe
         ON e.id = pe.especialidad_id
       WHERE pe.profesional_id = ?`,
      [profesionalId],
      callback
    );
  }

  static obtenerProfesionalesPorEspecialidad(especialidadId, callback) {
    db.query(
      `SELECT 
       p.id, 
       CONCAT(p.nombre, ' ', p.apellido) AS nombre_completo
     FROM profesionales p
     JOIN profesional_especialidad pe
       ON p.id = pe.profesional_id
     WHERE pe.especialidad_id = ?
       AND p.estado = 'activo'`,
      [especialidadId],
      callback
    );
  }

  static obtenerEspecialidadesPorProfesional(
    profesionalId,
    callback
  ) {
    db.query(
      `
    SELECT
      e.id,
      e.nombre
    FROM especialidades e
    JOIN profesional_especialidad pe
      ON e.id = pe.especialidad_id
    WHERE pe.profesional_id = ?
    ORDER BY e.nombre
    `,
      [profesionalId],
      callback
    );
  }

  static contarSobreturnos(profesional_id, fecha, callback) {
    const sql = `
    SELECT COUNT(*) as total
    FROM turnos
    WHERE profesional_id = ?
      AND fecha = ?
      AND tipo_turno = 'sobreturno'
      AND estado IN ('reservado','confirmado')
  `;

    db.query(sql, [profesional_id, fecha], (err, rows) => {
      if (err) return callback(err);
      callback(null, rows[0].total);
    });
  }


  //===========================
  //Obtener Agenda x id
  //===========================

  static obtenerAgendaId(profesional_id, callback) {
    const sql = `
    SELECT id
    FROM agendas
    WHERE profesional_id = ?
      AND activo = 1
    LIMIT 1
  `;

    db.query(sql, [profesional_id], (err, rows) => {
      if (err) return callback(err);
      callback(null, rows[0]?.id);
    });
  }


  //============================
  // OBTENER SUCURSAL POR AGENDA
  //============================
  static obtenerSucursalPorAgenda(agenda_id, callback) {
    const sql = `
      SELECT sucursal_id
      FROM agendas
      WHERE id = ?
  `;

    db.query(sql, [agenda_id], (err, rows) => {
      if (err) return callback(err);

      if (!rows.length || !rows[0].sucursal_id) {
        return callback(null, null);
      }

      callback(null, rows[0].sucursal_id);
    });
  }




  //============================
  // VALIDAR HORA DENTRO DE AGENDA
  //============================
  static validarHoraEnAgenda(profesional_id, fecha, hora, callback) {

    const fechaObj = new Date(fecha + "T00:00:00");
    const diaBD = fechaObj.getDay() === 0 ? 7 : fechaObj.getDay();

    console.log("PROFESIONAL:", profesional_id);
    console.log("DIA BD:", diaBD);

    // 🔥 AGREGAR ESTO ACÁ
    db.query("SELECT DATABASE() as db", (err, r) => {
      console.log("DB ACTUAL:", r);
    });


    const sql = `
    SELECT ah.hora_inicio, ah.hora_fin
    FROM agenda_horarios ah
    INNER JOIN agendas a ON a.id = ah.agenda_id
    WHERE a.profesional_id = ?
      AND ah.dia_semana = ?
  `;

    db.query(sql, [profesional_id, diaBD], (err, rows) => {


      if (err) return callback(err);

      console.log("HORARIOS BD:", rows);

      if (!rows.length) {
        console.log("❌ SIN HORARIOS PARA ESE DÍA");
        return callback(null, false);
      }

      function horaASegundos(h) {

        if (!h) {
          return null;
        }

        const [hh, mm, ss = 0] = h.split(':').map(Number);

        return hh * 3600 + mm * 60 + ss;
      }

      const horaNormalizada = normalizarHora(hora);
      const horaSeg = horaASegundos(horaNormalizada);

      if (horaSeg === null) {
        return callback(new Error('Hora inválida'));
      }

      console.log("DEBUG VALIDACION:");
      console.log("hora evaluada:", horaNormalizada);
      console.log("hora en segundos:", horaSeg);
      console.log("bloques:", rows.map(b => ({
        inicio: b.hora_inicio,
        fin: b.hora_fin
      })));

      const dentro = rows.some(bloque => {
        const inicio = horaASegundos(bloque.hora_inicio);
        const fin = horaASegundos(bloque.hora_fin);

        return horaSeg >= inicio && horaSeg < fin;
      });

      console.log(dentro ? "✅ DENTRO DE AGENDA" : "❌ FUERA DE AGENDA");

      callback(null, dentro);

    });

  }



  //============================
  //SOBRETURNOS
  //============================
  static contarSobreturnosEnHora(profesional_id, fecha, hora, callback) {
    const sql = `
    SELECT COUNT(*) as total
    FROM turnos
    WHERE profesional_id = ?
      AND fecha = ?
      AND TIME_FORMAT(hora, '%H:%i') = ?
      AND tipo_turno = 'sobreturno'
      AND estado IN ('reservado','confirmado')
  `;

    db.query(sql, [profesional_id, fecha, hora], (err, rows) => {
      if (err) return callback(err);
      callback(null, rows[0].total);
    });
  }

  //============================
  //OBTENER SUCURSAL DEL PROFESIONAL
  //============================
  static obtenerSucursalPorProfesional(profesional_id, callback) {
    const sql = `
    SELECT sucursal_id
    FROM profesional_sucursal
    WHERE profesional_id = ?
    LIMIT 1
  `;

    db.query(sql, [profesional_id], (err, rows) => {
      if (err) return callback(err);

      if (!rows.length) {
        return callback(null, null);
      }

      callback(null, rows[0].sucursal_id);
    });
  }

  //============================
  // VALIDAR AGENDA DEL PROFESIONAL
  //============================
  static validarAgendaDeProfesional(agenda_id, profesional_id, callback) {
    const sql = `
    SELECT id
    FROM agendas
    WHERE id = ?
      AND profesional_id = ?
      AND activo = 1
  `;

    db.query(sql, [agenda_id, profesional_id], (err, rows) => {
      if (err) return callback(err);

      if (!rows.length) {
        return callback(null, false);
      }

      callback(null, true);
    });
  }

  //============================
  // DISPONIBILIDAD CALENDARIO
  //============================
  static obtenerDisponibilidadCalendario(profesional_id, callback) {

    const sqlDias = `
    SELECT DISTINCT ah.dia_semana
    FROM agenda_horarios ah
    INNER JOIN agendas a
      ON a.id = ah.agenda_id
    WHERE a.profesional_id = ?
      AND a.activo = 1
  `;

    db.query(sqlDias, [profesional_id], (err, diasRows) => {

      if (err) return callback(err);

      const diasLaborales = diasRows.map(r => Number(r.dia_semana));

      const sqlAusencias = `
      SELECT fecha_inicio, fecha_fin
      FROM ausencias au
      INNER JOIN agendas a
        ON a.id = au.agenda_id
      WHERE a.profesional_id = ?
    `;

      db.query(sqlAusencias, [profesional_id], (err2, ausenciasRows) => {

        if (err2) return callback(err2);

        callback(null, {
          diasLaborales,
          ausencias: ausenciasRows || []
        });

      });

    });

  }


  //============================
  // OCUPACION POR FECHA
  //============================
  static obtenerOcupacionMensual(
    profesional_id,
    desde,
    hasta,
    callback
  ) {

    const sql = `
    SELECT 
      fecha,
      COUNT(*) as total
    FROM turnos
    WHERE profesional_id = ?
      AND fecha BETWEEN ? AND ?
      AND estado IN ('reservado', 'confirmado')
    GROUP BY fecha
  `;

    db.query(
      sql,
      [profesional_id, desde, hasta],
      (err, rows) => {

        if (err) return callback(err);

        callback(null, rows || []);

      }
    );

  }


  //==================================
  //mostrarReprogramaciones
  //==================================

  //============================
  // TURNOS PARA REPROGRAMAR
  //============================
  static obtenerTurnosParaReprogramar(callback) {

    const sql = `
    SELECT
      t.id,
      t.fecha,
      t.hora,
      t.estado,
      t.tipo_turno,

      p.nombre AS paciente_nombre,

      CONCAT(pr.nombre, ' ', pr.apellido)
        AS profesional_nombre,

      e.nombre AS especialidad_nombre,

      s.nombre AS sucursal_nombre

    FROM turnos t

    INNER JOIN pacientes p
      ON p.id = t.paciente_id

    INNER JOIN profesionales pr
      ON pr.id = t.profesional_id

    INNER JOIN especialidades e
      ON e.id = t.especialidad_id

    LEFT JOIN sucursales s
      ON s.id = t.sucursal_id

    WHERE t.estado = 'reprogramar'

    ORDER BY t.fecha ASC, t.hora ASC
  `;

    db.query(sql, callback);

  }



}




module.exports = Turno;