const Agenda = require('../models/Agenda');
const Profesional = require('../models/Profesional');
const Especialidad = require('../models/Especialidad');
const db = require('../models/Db');




// ==========================
// FORM CREAR AGENDA BASE
// ==========================
exports.formularioNuevaAgenda = (req, res) => {
  Profesional.obtenerTodos((err, profesionales) => {
    if (err) profesionales = [];

    Especialidad.obtenerTodas((err2, especialidades) => {
      if (err2) especialidades = [];

      res.render('nuevaAgenda', { profesionales, especialidades });
    });
  });
};


// ==========================
// CREAR AGENDA + HORARIOS (AHORA LIMPIO)
// ==========================
exports.crearAgendaBase = (req, res) => {

  const { profesional_id, especialidad_id, duracion_turno } = req.body;

  const horarios = req.body.horarios;

  if (!horarios || Object.keys(horarios).length === 0) {
    return res.status(400).send("Debe agregar al menos un bloque horario");
  }

  const listaHorarios = Object.values(horarios);

  const datos = {
    profesional_id,
    especialidad_id,
    duracion_turno,
    horarios: listaHorarios
  };

  Agenda.crearAgendaConHorarios(datos, db, (err) => {

    if (err) {
      console.error(err);
      return res.status(400).send(err.message);
    }

    res.redirect('/agendas');
  });
};


// ==========================
// FORM AGREGAR HORARIO (SE MANTIENE)
// ==========================
exports.formularioNuevoHorario = (req, res) => {

  const agendaId = req.query.agenda_id;

  if (agendaId) {
    Agenda.obtenerAgendaBasePorId(agendaId, (err, agenda) => {
      if (err || !agenda)
        return res.render('nuevoHorario', { agendas: [] });

      res.render('nuevoHorario', { agendas: [agenda] });
    });
  } else {
    Agenda.obtenerAgendasBase(null, (err, agendas) => {
      if (err) return res.render('nuevoHorario', { agendas: [] });

      res.render('nuevoHorario', { agendas });
    });
  }
};


// ==========================
// GUARDAR HORARIO (SE MANTIENE)
// ==========================
exports.agregarHorario = (req, res) => {

  const { agenda_id, dia_semana, hora_inicio, hora_fin } = req.body;

  if (hora_inicio >= hora_fin) {
    return res.send('La hora de inicio debe ser menor que la hora de fin');
  }

  Agenda.agregarHorario(
    { agenda_id, dia_semana, hora_inicio, hora_fin },
    (err) => {

      if (err) {
        if (err.message === 'Horario solapado') {
          return res.send('Ya existe una franja horaria que se superpone en ese día');
        }

        console.error(err);
        return res.status(500).send('Error al agregar horario');
      }

      res.redirect(`/agendas/horarios/nuevo?agenda_id=${agenda_id}`);
    }
  );
};


// ==========================
// MOSTRAR AGENDA COMPLETA
// ==========================
exports.mostrarAgendas = (req, res) => {

  const buscar = req.query.buscar || null;

  Agenda.obtenerAgendaCompleta(buscar, (err, agenda) => {
    if (err) agenda = [];

    res.render('agendas', { agenda, buscar });
  });
};


// ==========================
// DETALLE AGENDA
// ==========================
exports.detalleAgenda = (req, res) => {

  const id = req.params.id;

  Agenda.obtenerAgendaCompleta(null, (err, agendas) => {

    if (err) return res.status(500).send('Error');

    const agendaFiltrada = agendas.filter(a => a.agenda_id == id);

    if (agendaFiltrada.length === 0)
      return res.status(404).send('Agenda no encontrada');

    res.render('detalleAgenda', { agenda: agendaFiltrada });
  });
};



// ==========================
// FORM EDITAR AGENDA COMPLETA
// ==========================
exports.formularioEditarAgenda = (req, res) => {

  const id = req.params.id;

  const dias = [
    { id: 1, nombre: "Lunes" },
    { id: 2, nombre: "Martes" },
    { id: 3, nombre: "Miércoles" },
    { id: 4, nombre: "Jueves" },
    { id: 5, nombre: "Viernes" },
    { id: 6, nombre: "Sábado" },
    { id: 7, nombre: "Domingo" }
  ];

  Agenda.obtenerAgendaBasePorId(id, (err, agenda) => {

    if (err || !agenda)
      return res.status(404).send('Agenda no encontrada');

    Agenda.obtenerHorariosPorAgenda(id, (err, horarios) => {

      if (err || !horarios) horarios = [];

      res.render('editarAgenda', {
        agenda,
        horarios,
        dias
      });

    });

  });
};



// ==========================
// EDITAR AGENDA COMPLETA
// ==========================
exports.editarAgenda = (req, res) => {

  const id = req.params.id;
  const { duracion_turno, max_sobreturnos } = req.body;

  if (!duracion_turno || duracion_turno <= 0) {
    return res.status(400).send('Duración inválida');
  }

  const listaHorarios = Object.values(req.body.horarios || {});

  if (listaHorarios.length === 0) {
    return res.status(400).send('Debe agregar al menos un horario');
  }

  Agenda.actualizarAgendaBase(
    id,
    duracion_turno,
    max_sobreturnos,
    (err) => {

      if (err) {
        console.error(err);
        return res.status(500).send('Error al actualizar agenda');
      }

      Agenda.reemplazarHorarios(id, listaHorarios, (err) => {

        if (err) {
          console.error(err);
          return res.status(400).send(err.message);
        }

        res.redirect('/agendas');
      });

    }
  );
};



// ==========================
// ELIMINAR AGENDA
// ==========================
exports.eliminarAgenda = (req, res) => {

  const id = req.params.id;

  db.query('DELETE FROM agenda_horarios WHERE agenda_id = ?', [id], (err) => {

    if (err) {
      console.error(err);
      return res.status(500).send('Error al eliminar horarios');
    }

    db.query('DELETE FROM agendas_nueva WHERE id = ?', [id], (err2) => {

      if (err2) {
        console.error(err2);
        return res.status(500).send('Error al eliminar agenda');
      }

      res.redirect('/agendas');
    });
  });
};
