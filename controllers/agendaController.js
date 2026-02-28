const Agenda = require('../models/Agenda');
const Profesional = require('../models/Profesional');
const Especialidad = require('../models/Especialidad');
const db = require('../models/Db');

const dias = [
  { id: 1, nombre: "Lunes" },
  { id: 2, nombre: "Martes" },
  { id: 3, nombre: "Miércoles" },
  { id: 4, nombre: "Jueves" },
  { id: 5, nombre: "Viernes" },
  { id: 6, nombre: "Sábado" },
  { id: 7, nombre: "Domingo" }
];

// ==========================
// Agrupar horarios por dia
// ==========================
function agruparHorariosPorDia(horarios) {

  const agrupados = {
    1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: []
  };

  horarios.forEach(h => {
    agrupados[h.dia_semana].push(h);
  });

  return agrupados;
}


// ==========================
// GENERADOR HORARIOS CONSULTORIO
// ==========================
const generarHorarios = () => {

  const horarios = [];

  const agregarRango = (inicio, fin) => {

    let [h, m] = inicio.split(':').map(Number);
    const [hFin, mFin] = fin.split(':').map(Number);

    while (h < hFin || (h === hFin && m < mFin)) {

      const hora =
        `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;

      horarios.push(hora);

      m += 30; // ← intervalo 30 minutos

      if (m >= 60) {
        m = 0;
        h++;
      }
    }
  };

  agregarRango('09:00', '13:00');
  agregarRango('16:00', '21:30');

  return horarios;
};


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

  // 🔥 AQUÍ FALTABA LA LLAMADA AL MODELO
  Agenda.crearAgendaConHorarios(datos, (err) => {

    if (err) {
      return res.status(500).send("Error al crear la agenda: " + err.message);
    }

    return res.redirect("/agendas");
  });
};


// ==========================
// FORM AGREGAR HORARIO (SE MANTIENE)
// ==========================
exports.formularioNuevoHorario = (req, res) => {

  const agendaId = req.query.agenda_id;

  // 🔹 Generamos horarios válidos
  const horariosDisponibles = generarHorarios();

  if (agendaId) {

    Agenda.obtenerAgendaBasePorId(agendaId, (err, agenda) => {

      if (err || !agenda)
        return res.render('nuevoHorario', { 
          agendas: [],
          horariosDisponibles
        });

      res.render('nuevoHorario', { 
        agendas: [agenda],
        horariosDisponibles
      });

    });

  } else {

    Agenda.obtenerAgendasBase(null, (err, agendas) => {

      if (err)
        return res.render('nuevoHorario', { 
          agendas: [],
          horariosDisponibles
        });

      res.render('nuevoHorario', { 
        agendas,
        horariosDisponibles
      });

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

      const horariosDisponibles = generarHorarios();
      console.log(generarHorarios());

      res.render('editarAgenda', {
        agenda,
        horarios: agruparHorariosPorDia(horarios),
        dias,
        horariosDisponibles
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

  // 🔥 VALIDACIÓN PRIMERO
  for (const h of listaHorarios) {

    if (!h.desde || !h.hasta) {
      return renderEditarConError(
        req,
        res,
        id,
        "Debe completar todos los horarios"
      );
    }

    if (h.desde >= h.hasta) {
      return renderEditarConError(
        req,
        res,
        id,
        "Elija un rango de horario válido"
      );
    }
  }

  // 🔥 SI TODO ES VÁLIDO → ACTUALIZAR
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
          return renderEditarConError(
            req,
            res,
            id,
            err.message
          );
        }

        res.redirect('/agendas');
      });
    }
  );
};

// ==========================
// FUNCIÓN AUXILIAR
// ==========================
function renderEditarConError(req, res, id, mensaje) {
  Agenda.obtenerAgendaBasePorId(id, (err, agenda) => {
    if (err || !agenda) return res.status(404).send('Agenda no encontrada');

    Agenda.obtenerHorariosPorAgenda(id, (err2, horarios) => {
      if (err2) horarios = [];

      res.render("editarAgenda", {
        agenda,
        horarios: agruparHorariosPorDia(horarios),
        dias,
        horariosDisponibles: generarHorarios(),
        error: mensaje
      });
    });
  });
}
