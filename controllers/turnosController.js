const Turno = require('../models/Turno');
const Agenda = require('../models/Agenda');
const generarTurnos = require('../utils/generarTurnos');
const db = require('../models/Db');


// ==========================
// UTILIDAD FECHA
// ==========================

function formatearFecha(fecha) {
  const opciones = { weekday: 'long', day: 'numeric', month: 'long' };
  return new Date(fecha).toLocaleDateString('es-ES', opciones);
}


// ==========================
// TURNOS CRUD
// ==========================

exports.mostrarTurnos = (req, res) => {
  Turno.obtenerTodos((err, turnos) => {
    if (err) return res.status(500).send('Error al obtener turnos.');

    turnos = turnos.map(t => ({
      ...t,
      fecha: formatearFecha(t.fecha)
    }));

    res.render('turnos', { turnos });
  });
};


exports.mostrarTurno = (req, res) => {
  Turno.obtenerPorId(req.params.id, (err, turno) => {
    if (err || !turno) return res.status(404).send('Turno no encontrado.');

    turno.fecha = formatearFecha(turno.fecha);

    res.render('turno', { turno });
  });
};


exports.mostrarFormularioNuevoTurno = (req, res) => {
  db.query('SELECT * FROM especialidades', (err, especialidades) => {
    if (err) return res.status(500).send('Error especialidades');

    db.query('SELECT * FROM pacientes', (err, pacientes) => {
      if (err) return res.status(500).send('Error pacientes');

      db.query('SELECT * FROM sucursales', (err, sucursales) => {
        if (err) return res.status(500).send('Error sucursales');

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

  if (!paciente_id || !profesional_id || !especialidad_id || !sucursal_id || !fecha || !hora) {
    return res.status(400).send('Faltan datos');
  }

  db.query(
    `INSERT INTO turnos 
     (paciente_id, profesional_id, especialidad_id, sucursal_id, fecha, hora) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [paciente_id, profesional_id, especialidad_id, sucursal_id, fecha, hora],
    err => {
      if (err) return res.status(500).send('Error crear turno');
      res.redirect('/turnos');
    }
  );
};


// ==========================
// FORM EDITAR TURNO (CORREGIDO)
// ==========================

exports.mostrarFormularioEditarTurno = (req, res) => {
  Turno.obtenerPorId(req.params.id, (err, turno) => {
    if (err || !turno) return res.status(404).send('No encontrado');

    db.query('SELECT * FROM pacientes', (err, pacientes) => {
      if (err) return res.status(500).send('Error pacientes');

      db.query('SELECT * FROM profesionales', (err, profesionales) => {
        if (err) return res.status(500).send('Error profesionales');

        // ✅ SOLO especialidades del profesional
        db.query(
          `SELECT e.id, e.nombre
           FROM especialidades e
           JOIN profesional_especialidad pe 
             ON e.id = pe.especialidad_id
           WHERE pe.profesional_id = ?`,
          [turno.profesional_id],
          (err, especialidades) => {
            if (err) return res.status(500).send('Error especialidades');

            db.query('SELECT * FROM sucursales', (err, sucursales) => {
              if (err) return res.status(500).send('Error sucursales');

              res.render('editarTurno', {
                turno,
                pacientes,
                profesionales,
                especialidades,
                sucursales
              });
            });
          }
        );
      });
    });
  });
};


exports.editarTurno = (req, res) => {
  Turno.editar(req.params.id, req.body, err => {
    if (err) return res.status(500).send('Error editar');
    res.redirect('/turnos');
  });
};


exports.eliminarTurno = (req, res) => {
  Turno.eliminar(req.params.id, err => {
    if (err) return res.status(500).send('Error eliminar');
    res.redirect('/turnos');
  });
};


// ==========================
// PROFESIONALES POR ESPECIALIDAD (AJAX)
// ==========================

exports.obtenerProfesionalesPorEspecialidad = (req, res) => {
  db.query(
    `SELECT p.id, p.nombre_completo
     FROM profesionales p
     JOIN profesional_especialidad pe 
       ON p.id = pe.profesional_id
     WHERE pe.especialidad_id = ?`,
    [req.params.especialidadId],
    (err, profesionales) => {
      if (err) return res.status(500).json([]);
      res.json(profesionales);
    }
  );
};

// ==========================
// ESPECIALIDADES POR PROFESIONAL (AJAX)
// ==========================

exports.obtenerEspecialidadesPorProfesional = (req, res) => {
  db.query(
    `SELECT e.id, e.nombre
     FROM especialidades e
     JOIN profesional_especialidad pe
       ON e.id = pe.especialidad_id
     WHERE pe.profesional_id = ?`,
    [req.params.profesionalId],
    (err, especialidades) => {
      if (err) return res.status(500).json([]);
      res.json(especialidades);
    }
  );
};



// ==========================
// HORARIOS DISPONIBLES (MOTOR BUENO)
// ==========================

exports.obtenerHorariosDisponibles = (req, res) => {
  const { profesionalId, fecha } = req.params;

  const diaSemana = new Date(fecha).getDay();

  Agenda.obtenerHorariosProfesional(profesionalId, diaSemana, (err, bloques) => {
    if (err) return res.status(500).json([]);

    Turno.obtenerHorariosOcupados(profesionalId, fecha, (err2, ocupados) => {
      if (err2) return res.status(500).json([]);

      let posibles = [];

      bloques.forEach(b => {
        const generados = generarTurnos(
          b.hora_inicio,
          b.hora_fin,
          b.duracion_turno
        );
        posibles.push(...generados);
      });

      const disponibles = posibles.filter(h => !ocupados.includes(h));

      res.json(disponibles);
    });
  });
};
