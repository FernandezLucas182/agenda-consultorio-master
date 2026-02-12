const Turno = require('../models/Turno');
const Agenda = require('../models/Agenda');
const generarTurnos = require('../utils/generarTurnos');
const db = require('../models/Db');

// ==========================
// UTILIDAD FECHA
// ==========================

function formatearFecha(fecha) {
  return new Date(fecha).toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });
}

// ==========================
// TURNOS CRUD
// ==========================

exports.mostrarTurnos = (req, res) => {
  Turno.obtenerTodos((err, turnos) => {
    if (err) return res.status(500).send('Error al obtener turnos');

    turnos = turnos.map(t => ({
      ...t,
      fecha: formatearFecha(t.fecha)
    }));

    res.render('turnos', { turnos });
  });
};

exports.mostrarTurno = (req, res) => {
  Turno.obtenerPorId(req.params.id, (err, turno) => {
    if (err || !turno) return res.status(404).send('No encontrado');

    turno.fecha = formatearFecha(turno.fecha);
    res.render('turno', { turno });
  });
};

exports.mostrarFormularioNuevoTurno = (req, res) => {
  db.query('SELECT * FROM especialidades', (err, especialidades) => {
    db.query('SELECT * FROM pacientes', (err2, pacientes) => {
      db.query('SELECT * FROM sucursales', (err3, sucursales) => {
        res.render('nuevoTurno', {
          especialidades,
          pacientes,
          sucursales,
          profesionales: []
        });
      });
    });
  });
};

exports.crearTurno = (req, res) => {
  const {
    paciente_id,
    profesional_id,
    especialidad_id,
    sucursal_id,
    fecha,
    hora
  } = req.body;

  db.query(
    `INSERT INTO turnos 
     (paciente_id, profesional_id, especialidad_id, sucursal_id, fecha, hora)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [paciente_id, profesional_id, especialidad_id, sucursal_id, fecha, hora],
    () => res.redirect('/turnos')
  );
};

// ==========================
// 👉 FUNCIONES QUE FALTABAN (CLAVE DEL CRASH)
// ==========================

exports.mostrarFormularioEditarTurno = (req, res) => {
  Turno.obtenerPorId(req.params.id, (err, turno) => {
    if (err || !turno) return res.status(404).send('No encontrado');

    res.render('editarTurno', { turno });
  });
};

exports.editarTurno = (req, res) => {
  const { fecha, hora } = req.body;

  db.query(
    `UPDATE turnos SET fecha = ?, hora = ? WHERE id = ?`,
    [fecha, hora, req.params.id],
    () => res.redirect('/turnos')
  );
};

exports.eliminarTurno = (req, res) => {
  db.query(
    `DELETE FROM turnos WHERE id = ?`,
    [req.params.id],
    () => res.redirect('/turnos')
  );
};

// ==========================
// AJAX RELACIONES
// ==========================

exports.obtenerProfesionalesPorEspecialidad = (req, res) => {
  db.query(
    `SELECT p.id, p.nombre_completo
     FROM profesionales p
     JOIN profesional_especialidad pe 
       ON p.id = pe.profesional_id
     WHERE pe.especialidad_id = ?
       AND p.estado = 'activo'`,
    [req.params.especialidadId],
    (err, rows) => res.json(rows || [])
  );
};

exports.obtenerEspecialidadesPorProfesional = (req, res) => {
  db.query(
    `SELECT e.id, e.nombre
     FROM especialidades e
     JOIN profesional_especialidad pe
       ON e.id = pe.especialidad_id
     WHERE pe.profesional_id = ?`,
    [req.params.profesionalId],
    (err, rows) => res.json(rows || [])
  );
};

// ==========================
// BLOQUEOS
// ==========================

function esFeriado(fecha, cb) {
  db.query(
    'SELECT id FROM feriados WHERE fecha = ?',
    [fecha],
    (err, r) => cb(r && r.length > 0)
  );
}

function estaDeVacaciones(id, fecha, cb) {
  db.query(
    `SELECT id FROM vacaciones 
     WHERE profesional_id = ?
       AND ? BETWEEN fecha_inicio AND fecha_fin`,
    [id, fecha],
    (err, r) => cb(r && r.length > 0)
  );
}

// ==========================
// HORARIOS DISPONIBLES
// ==========================

exports.obtenerHorariosDisponibles = (req, res) => {
  const { profesionalId, fecha } = req.params;

  const [y, m, d] = fecha.split('-');
  const fechaObj = new Date(y, m - 1, d);

  let diaJS = fechaObj.getDay();
  let diaBD = diaJS === 0 ? 7 : diaJS;

  if (diaBD === 6 || diaBD === 7) {
    return res.json({ motivo: 'fin_de_semana' });
  }

  esFeriado(fecha, feriado => {
    if (feriado) return res.json({ motivo: 'feriado' });

    estaDeVacaciones(profesionalId, fecha, vaca => {
      if (vaca) return res.json({ motivo: 'vacaciones' });

      Agenda.obtenerHorariosProfesional(profesionalId, diaBD, (err, bloques) => {
        if (!bloques || !bloques.length) {
          return res.json({ motivo: 'sin_agenda' });
        }

        Turno.obtenerHorariosOcupados(profesionalId, fecha, (err2, ocupados) => {
          let posibles = [];

          bloques.forEach(b => {
            posibles.push(
              ...generarTurnos(b.hora_inicio, b.hora_fin, b.duracion_turno)
            );
          });

          const libres = posibles.filter(h => !ocupados.includes(h));

          res.json(libres);
        });
      });
    });
  });
};
