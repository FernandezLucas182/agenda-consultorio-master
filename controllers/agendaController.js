const Agenda = require('../models/Agenda');
const Profesional = require('../models/Profesional');
const Especialidad = require('../models/Especialidad');
const db = require('../models/Db');


const normalizar = (txt) =>
  (txt || "")
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

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
  Profesional.obtenerTodos(null, (err, profesionales) => {
    if (err) profesionales = [];

    Especialidad.obtenerTodas((err2, especialidades) => {
      if (err2) especialidades = [];

      db.query('SELECT * FROM sucursales', (err3, sucursales) => {
        if (err3) sucursales = [];

        res.render('nuevaAgenda', {
          profesionales,
          especialidades,
          sucursales
        });
      });

    });
  });
};


// ==========================
// CREAR AGENDA + HORARIOS (AHORA LIMPIO)
// ==========================


exports.crearAgendaBase = (req, res) => {

  const { profesional_id, especialidad_id, duracion_turno, sucursal_id } = req.body;

  const horarios = req.body.horarios;

  if (!horarios || Object.keys(horarios).length === 0) {
    return res.status(400).send("Debe agregar al menos un bloque horario");
  }

  const listaHorarios = Object.values(horarios);

  const datos = {
    profesional_id,
    especialidad_id,
    duracion_turno,
    sucursal_id,
    horarios: listaHorarios
  };

  // 🔥 AQUÍ FALTABA LA LLAMADA AL MODELO
  Agenda.crearAgendaConHorarios(datos, (err, result) => {

    if (err) {

      // ⚠️ regla de negocio (CASO)
      if (err.type === 'BUSINESS_RULE') {
        req.flash('error', err.message);
        return res.redirect('/agendas/nueva');
      }

      console.error(err);
      console.log(err);
      req.flash('error', 'Error inesperado al crear la agenda');
      return res.redirect('/agendas/nueva');
    }

    req.flash('success', 'Agenda creada correctamente');
    return res.redirect(`/agendas?nueva=${result.insertId}`);
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
    req.flash('error', 'La hora de inicio debe ser menor que la hora de fin');
    return res.redirect(`/agendas/horarios/nuevo?agenda_id=${agenda_id}`);
  }

  Agenda.agregarHorario(
    { agenda_id, dia_semana, hora_inicio, hora_fin },
    (err) => {

      if (err) {
        if (err.message === 'Horario solapado') {
          req.flash('error', 'Horario superpuesto');
          return res.redirect(`/agendas/horarios/nuevo?agenda_id=${agenda_id}`);
        }

        console.error(err);
        req.flash('error', 'Error al agregar horario');
        return res.redirect('/agendas');
      }

      req.flash('success', 'Horario agregado correctamente');
      return res.redirect(`/agendas/horarios/nuevo?agenda_id=${agenda_id}`);
    }
  );
};


// ==========================
// MOSTRAR AGENDA COMPLETA
// ==========================
exports.mostrarAgendas = (req, res) => {

  const buscar = req.query.buscar || "";
  const q = normalizar(buscar);
  const meses = {
    enero: 0,
    febrero: 1,
    marzo: 2,
    abril: 3,
    mayo: 4,
    junio: 5,
    julio: 6,
    agosto: 7,
    septiembre: 8,
    octubre: 9,
    noviembre: 10,
    diciembre: 11
  };

  let filtroMes = null;

  for (const m in meses) {
    if (q.includes(m)) {
      filtroMes = meses[m];
    }
  }

  Agenda.obtenerAgendaCompleta(buscar, (err, agenda) => {

    if (err) {
      req.flash('error', 'Error en QUERY agenda');
      return res.redirect('/agendas');
    }

    // 🔥 AGRUPAR POR agenda_id
    const agrupadas = {};

    agenda.forEach(item => {
      if (!agrupadas[item.agenda_id]) {
        agrupadas[item.agenda_id] = {
          id: item.agenda_id,
          duracion_turno: item.duracion_turno,
          profesional: item.nombre + ' ' + item.apellido,
          filas: []
        };
      }

      agrupadas[item.agenda_id].filas.push(item);
    });

    // 🔥 CONVERTIR A ARRAY
    const agendas = Object.values(agrupadas);

    const nuevaAgendaId = parseInt(req.query.nueva);

    if (nuevaAgendaId) {

      agendas.sort((a, b) => {

        if (a.id === nuevaAgendaId) return -1;
        if (b.id === nuevaAgendaId) return 1;

        return 0;
      });
    }

    if (filtroMes !== null) {

      agendas.forEach(a => {
        a.filas = a.filas.filter(f => {

          const fecha = new Date(f.fecha_inicio || f.fecha || null);

          if (!fecha) return false;

          return fecha.getMonth() === filtroMes;
        });
      });

      // eliminar agendas vacías
      for (const id in agrupadas) {
        agrupadas[id].filas = agrupadas[id].filas.filter(Boolean);
      }
    }

    const ordenadores = {

      profesional: (a, b) =>
        a.profesional.localeCompare(b.profesional),

      especialidad: (a, b) =>
        a.filas[0].especialidad.localeCompare(b.filas[0].especialidad),

      sucursal: (a, b) =>
        (a.filas[0].sucursal || '').localeCompare(b.filas[0].sucursal || ''),

      id: (a, b) =>
        a.id - b.id
    };

    const ordenar = req.query.ordenar;

    if (ordenadores[ordenar]) {
      agendas.sort(ordenadores[ordenar]);
    }

    res.render('agendas', {
      agendas,
      nuevaAgendaId,

      path: req.path
    });
  });
};


// ==========================
// DETALLE AGENDA
// ==========================
exports.detalleAgenda = (req, res) => {

  const id = req.params.id;

  // 1️⃣ Traer datos base
  Agenda.obtenerAgendaBasePorId(id, (err, agenda) => {

    if (err || !agenda) {
      req.flash('error', 'Agenda no encontrada');
      res.redirect(`/agendas?nueva=${result.insertId}`);
    }

    // 2️⃣ Traer horarios
    Agenda.obtenerHorariosPorAgenda(id, (err, horarios) => {

      if (err) {
        req.flash('error', 'Error al cargar horarios');
        return res.redirect('/agendas');
      }

      res.render('detalleAgenda', {
        agenda,
        horarios
      });
    });

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

      console.log("Horarios disponibles:", horariosDisponibles);

      console.log("Agenda ID:", id);
      console.log("Horarios:", horarios);
      console.log("Agrupados:", agruparHorariosPorDia(horarios));

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
    req.flash('error', 'Duración inválida');
    return res.redirect(`/agendas/${id}/editar`);
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
        req.flash('error', 'Error al actualizar agenda');
        return res.redirect('/agendas');
      }

      Agenda.reemplazarHorarios(id, listaHorarios, (err) => {
        let errorEncontrado = false;
        if (err) {
          console.error(err);
          return renderEditarConError(
            req,
            res,
            id,
            err.message
          );
        }

        req.flash('success', 'Agenda actualizada correctamente');
        return res.redirect('/agendas');
      });
    }
  );
};

// ==========================
// FUNCIÓN AUXILIAR
// ==========================
function renderEditarConError(req, res, id, mensaje) {
  req.flash('error', mensaje);
  return res.redirect(`/agendas/${id}/editar`);
}



//=================
//Copias de agendas
//=================

exports.formularioCopiarAgenda = (req, res) => {

  const agendaId = req.params.id;

  const sqlAgenda = `
        SELECT *
        FROM agendas
        WHERE id = ?
    `;

  db.query(sqlAgenda, [agendaId], (err, agendaRows) => {

    if (err || agendaRows.length === 0) {
      console.error(err);
      return res.redirect('/agendas');
    }

    const agenda = agendaRows[0];

    const sqlHorarios = `
            SELECT *
            FROM agenda_horarios
            WHERE agenda_id = ?
            ORDER BY dia_semana, hora_inicio
        `;

    db.query(sqlHorarios, [agendaId], (err, horarios) => {

      if (err) {
        console.error(err);
        return res.redirect('/agendas');
      }

      // 🔥 FILTRO REAL: eliminar horarios inválidos o incompletos
      const horariosValidos = horarios.filter(h =>
        h.dia_semana &&
        h.hora_inicio &&
        h.hora_fin
      );

      Profesional.obtenerParaCopiarAgenda(agenda.sucursal_id, agenda.especialidad_id, (err, profesionales) => {
        if (err) return res.redirect('/agendas');

        Especialidad.obtenerTodas((err, especialidades) => {
          if (err) return res.redirect('/agendas');

          db.query("SELECT * FROM sucursales ORDER BY nombre", (err, sucursales) => {
            if (err) return res.redirect('/agendas');

            res.render('copiarAgenda', {
              agenda,
              horarios: horariosValidos,
              profesionales,
              especialidades,
              sucursales
            });

          });
        });
      });

    });

  });

};