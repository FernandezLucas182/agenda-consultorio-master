const Agenda = require('../models/Agenda');
const Profesional = require('../models/Profesional');
const Especialidad = require('../models/Especialidad'); // asegúrate de tener este model

// 📌 Método para mostrar el formulario de nueva agenda con profesionales y especialidades
exports.formularioNuevaAgenda = (req, res) => {
  Profesional.obtenerTodos((err, profesionales) => {
    if (err) return res.status(500).send('Error al obtener profesionales');

    profesionales = profesionales || []; // 🔹 evita undefined

    Especialidad.obtenerTodas((err, especialidades) => {
      if (err) return res.status(500).send('Error al obtener especialidades');

      especialidades = especialidades || []; // 🔹 evita undefined

      res.render('nuevaAgenda', { profesionales, especialidades });
    });
  });
};


// 📌 Método para mostrar el formulario de nuevo horario con agendas activas
exports.formularioNuevoHorario = (req, res) => {
  Agenda.obtenerAgendaCompleta((err, agendas) => {
    if (err) return res.status(500).send('Error al obtener agendas');

    // Filtrar solo agendas activas
    const agendasActivas = agendas.filter(a => a.activo === 1);

    res.render('nuevoHorario', { agendas: agendasActivas });
  });
};

// 📌 Mostrar agenda completa (profesional + especialidad + horarios)
exports.mostrarAgendas = (req, res) => {
  Agenda.obtenerAgendaCompleta((err, agenda) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error al obtener agenda.');
    }

    res.render('agendas', { agenda });
  });
};

// 📌 Crear agenda base (profesional + especialidad + duración)
exports.crearAgendaBase = (req, res) => {
  const { profesional_id, especialidad_id, duracion_turno } = req.body;

  Agenda.crearAgendaBase(
    { profesional_id, especialidad_id, duracion_turno },
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error al crear agenda base.');
      }

      const agendaId = result.insertId;

      // Redirigir a la página de agregar horarios para esta agenda
      res.redirect(`/agendas/horarios/nuevo`);
    }
  );
};

// 📌 Agregar bloques horarios a una agenda
exports.agregarHorario = (req, res) => {
  const { agenda_id, dia_semana, hora_inicio, hora_fin } = req.body;

  Agenda.agregarHorario(
    { agenda_id, dia_semana, hora_inicio, hora_fin },
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error al agregar horario.');
      }

      res.redirect('/agendas');
    }
  );
};
