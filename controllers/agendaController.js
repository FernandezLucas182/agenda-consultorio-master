const Agenda = require('../models/Agenda');
const Profesional = require('../models/Profesional');
const Especialidad = require('../models/Especialidad');

exports.formularioNuevaAgenda = (req, res) => {
  Profesional.obtenerTodos((err, profesionales) => {
    if (err) {
      console.error(err);
      profesionales = [];
    }

    Especialidad.obtenerTodas((err2, especialidades) => {
      if (err2) {
        console.error(err2);
        especialidades = [];
      }

      res.render('nuevaAgenda', {
        profesionales: profesionales || [],
        especialidades: especialidades || []
      });
    });
  });
};

exports.formularioNuevoHorario = (req, res) => {
  Agenda.obtenerAgendaCompleta((err, agendas) => {
    if (err) {
      console.error(err);
      agendas = [];
    }

    res.render('nuevoHorario', {
      agendas: agendas || []
    });
  });
};

exports.mostrarAgendas = (req, res) => {
  Agenda.obtenerAgendaCompleta((err, agenda) => {
    if (err) {
      console.error(err);
      agenda = [];
    }

    res.render('agendas', { agenda });
  });
};

exports.crearAgendaBase = (req, res) => {
  const { profesional_id, especialidad_id, duracion_turno } = req.body;

  Agenda.crearAgendaBase(
    { profesional_id, especialidad_id, duracion_turno },
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error al crear agenda');
      }

      res.redirect('/agendas/horarios/nuevo');
    }
  );
};

exports.agregarHorario = (req, res) => {
  const { agenda_id, dia_semana, hora_inicio, hora_fin } = req.body;

  Agenda.agregarHorario(
    { agenda_id, dia_semana, hora_inicio, hora_fin },
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error al agregar horario');
      }

      res.redirect('/agendas');
    }
  );
};
