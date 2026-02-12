const Agenda = require('../models/Agenda');
const Profesional = require('../models/Profesional');
const Especialidad = require('../models/Especialidad');


// ==========================
// FORM CREAR AGENDA BASE
// ==========================
exports.formularioNuevaAgenda = (req, res) => {
  Profesional.obtenerTodos((err, profesionales) => {
    if (err) profesionales = [];

    Especialidad.obtenerTodas((err2, especialidades) => {
      if (err2) especialidades = [];

      res.render('nuevaAgenda', {
        profesionales,
        especialidades
      });
    });
  });
};


// ==========================
// CREAR AGENDA BASE
// ==========================
exports.crearAgendaBase = (req, res) => {
  const { profesional_id, especialidad_id, duracion_turno } = req.body;

  Agenda.crearAgendaBase(
    { profesional_id, especialidad_id, duracion_turno },
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error al crear agenda');
      }

      // 👉 mandamos el ID recién creado
      res.redirect(`/agendas/horarios/nuevo?agenda_id=${result.insertId}`);
    }
  );
};



// ==========================
// FORM AGREGAR HORARIO
// ==========================
exports.formularioNuevoHorario = (req, res) => {
  const agendaId = req.query.agenda_id;

  // 👉 si viene una agenda puntual (flujo normal)
  if (agendaId) {
    Agenda.obtenerAgendaBasePorId(agendaId, (err, agenda) => {
      if (err || !agenda) return res.render('nuevoHorario', { agendas: [] });

      // lo convertimos en array para que Pug lo pueda recorrer
      res.render('nuevoHorario', { agendas: [agenda] });
    });


  // 👉 si entra directo al formulario (modo libre)
  } else {
    Agenda.obtenerAgendasBase((err, agendas) => {
      if (err) agendas = [];
      res.render('nuevoHorario', { agendas });
    });
  }
};




// ==========================
// GUARDAR HORARIO
// ==========================
exports.agregarHorario = (req, res) => {
  const { agenda_id, dia_semana, hora_inicio, hora_fin } = req.body;

  Agenda.agregarHorario(
    { agenda_id, dia_semana, hora_inicio, hora_fin },
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error al agregar horario');
      }

      // 👉 volvemos para seguir cargando más horarios
     res.redirect(`/agendas/horarios/nuevo?agenda_id=${agenda_id}`);

    }
  );
};


// ==========================
// MOSTRAR AGENDA COMPLETA
// ==========================
exports.mostrarAgendas = (req, res) => {
  Agenda.obtenerAgendaCompleta((err, agenda) => {
    if (err) agenda = [];

    res.render('agendas', { agenda });
  });
};
