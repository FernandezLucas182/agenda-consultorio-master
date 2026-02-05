const Turno = require('../models/Turno');
const db = require('../models/Db');

// Función para formatear la fecha en el formato "jueves 30 de noviembre"
function formatearFecha(fecha) {
  const opciones = { weekday: 'long', day: 'numeric', month: 'long' };
  return new Date(fecha).toLocaleDateString('es-ES', opciones);
}

// Mostrar todos los turnos
exports.mostrarTurnos = (req, res) => {
  Turno.obtenerTodos((err, turnos) => {
    if (err) return res.status(500).send('Error al obtener turnos.');
    
    // Formatear la fecha de cada turno
    turnos = turnos.map(turno => {
      turno.fecha = formatearFecha(turno.fecha);
      return turno;
    });
    
    res.render('turnos', { turnos });
  });
};

// Mostrar el detalle de un turno
exports.mostrarTurno = (req, res) => {
  const turnoId = req.params.id;
  Turno.obtenerPorId(turnoId, (err, turno) => {
    if (err || !turno) return res.status(404).send('Turno no encontrado.');
    
    // Formatear la fecha del turno antes de enviarlo a la vista
    turno.fecha = formatearFecha(turno.fecha);
    
    res.render('turno', { turno });
  });
};

// Controlador para mostrar el formulario de nuevo turno
// Función para obtener todas las especialidades y pacientes
exports.mostrarFormularioNuevoTurno = (req, res) => {
  // Obtener las especialidades y pacientes
  db.query('SELECT * FROM especialidades', (err, especialidades) => {
      if (err) return res.status(500).send('Error al obtener especialidades.');

      db.query('SELECT * FROM pacientes', (err, pacientes) => {
          if (err) return res.status(500).send('Error al obtener pacientes.');

          // Obtener todas las sucursales
          db.query('SELECT * FROM sucursales', (err, sucursales) => {
              if (err) return res.status(500).send('Error al obtener sucursales.');

              // Pasar las sucursales a la vista junto con las demás opciones
              res.render('nuevoTurno', {
                  especialidades,
                  pacientes,
                  sucursales, // Incluir las sucursales en el render
                  profesionales: [] // Inicialmente vacío, se actualizará después
              });
          });
      });
  });
};


exports.obtenerProfesionalesPorEspecialidad = (req, res) => {
  const especialidadId = req.params.especialidadId;

  db.query(
    `SELECT profesionales.id, profesionales.nombre_completo, 
            profesionales.hora_inicio_turno1, profesionales.hora_fin_turno1, 
            profesionales.hora_inicio_turno2, profesionales.hora_fin_turno2
     FROM profesionales
     JOIN profesional_especialidad ON profesionales.id = profesional_especialidad.profesional_id
     WHERE profesional_especialidad.especialidad_id = ?`,
    [especialidadId],
    (err, profesionales) => {
      if (err) return res.status(500).send('Error al obtener profesionales.');
      res.json(profesionales);
    }
  );
};


// Función para crear un nuevo turno
exports.crearTurno = (req, res) => {
    const { paciente_id, profesional_id, especialidad_id, sucursal_id, fecha, hora } = req.body;

    if (!paciente_id || !profesional_id || !especialidad_id || !sucursal_id || !fecha || !hora) {
        return res.status(400).send('Todos los campos son obligatorios.');
    }

    db.query(
        'INSERT INTO turnos (paciente_id, profesional_id, especialidad_id, sucursal_id, fecha, hora) VALUES (?, ?, ?, ?, ?, ?)',
        [paciente_id, profesional_id, especialidad_id, sucursal_id, fecha, hora],
        (err) => {
            if (err) return res.status(500).send('Error al crear turno.');
            res.redirect('/turnos');
        }
    );
};

// Mostrar el formulario para editar un turno existente
exports.mostrarFormularioEditarTurno = (req, res) => {
  const turnoId = req.params.id;

  Turno.obtenerPorId(turnoId, (err, turno) => {
    if (err || !turno) return res.status(404).send('Turno no encontrado.');

    db.query('SELECT * FROM pacientes', (err, pacientes) => {
      if (err) return res.status(500).send('Error al obtener pacientes.');

      db.query(`SELECT id, nombre_completo, hora_inicio_turno1, hora_fin_turno1, hora_inicio_turno2, hora_fin_turno2 FROM profesionales`, 
        (err, profesionales) => {
          if (err) return res.status(500).send('Error al obtener profesionales.');
        
          db.query('SELECT * FROM especialidades', (err, especialidades) => {
            if (err) return res.status(500).send('Error al obtener especialidades.');

            db.query('SELECT * FROM sucursales', (err, sucursales) => {
              if (err) return res.status(500).send('Error al obtener sucursales.');

              res.render('editarTurno', {
                turno,
                pacientes,
                profesionales,
                especialidades,
                sucursales
              });
            });
          });
        }
      );
    });
  });
};

// Editar un turno existente
exports.editarTurno = (req, res) => {
  const turnoId = req.params.id;
  const { paciente_id, profesional_id, especialidad_id, sucursal_id, fecha, hora, estado } = req.body;

  Turno.editar(turnoId, { paciente_id, profesional_id, especialidad_id, sucursal_id, fecha, hora, estado }, (err) => {
    if (err) return res.status(500).send('Error al editar turno.');
    res.redirect('/turnos');
  });
};

// Eliminar un turno
exports.eliminarTurno = (req, res) => {
  const turnoId = req.params.id;

  Turno.eliminar(turnoId, (err) => {
    if (err) return res.status(500).send('Error al eliminar turno.');
    res.redirect('/turnos');
  });
};

exports.obtenerHorariosOcupados = (req, res) => {
  const { profesionalId, fecha } = req.params;

  Turno.obtenerHorariosOcupados(profesionalId, fecha, (err, horariosOcupados) => {
    if (err) return res.status(500).json({ error: 'Error al obtener horarios ocupados' });

    // Responder con los horarios ocupados como una lista
    res.json(horariosOcupados);
  });
};

