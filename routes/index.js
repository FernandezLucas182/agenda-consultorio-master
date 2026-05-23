
const express = require('express');
const router = express.Router();
const db = require('../models/Db');
const Agenda = require('../models/Agenda');

// =====================
// CONTROLADORES
// =====================

const agendaController = require('../controllers/agendaController');
const turnosController = require('../controllers/turnosController');
const profesionalController = require('../controllers/profesionalController');
const authController = require('../controllers/authController');
const pacienteController = require('../controllers/pacienteController');
const ausenciasController = require('../controllers/ausenciasController');



console.log("Agenda controller keys:", Object.keys(agendaController));
console.log("Turnos controller keys:", Object.keys(turnosController));

console.log("Agenda:", Object.keys(agendaController));
console.log("Turnos:", Object.keys(turnosController));
console.log("Profesional:", Object.keys(profesionalController));
console.log("Auth:", Object.keys(authController));
console.log("Paciente:", Object.keys(pacienteController));
// =====================
// HOME & LOGIN
// =====================

router.get('/', (req, res) => {

  const sql = `
    SELECT COUNT(*) AS total
    FROM turnos
    WHERE estado = 'reprogramar'
  `;

  db.query(sql, (err, rows) => {

    if (err) {
      return res.render('index', {
        totalReprogramaciones: 0
      });
    }

    res.render('index', {
      totalReprogramaciones: rows[0].total
    });

  });

});

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);


// =====================
// AGENDAS
// =====================

router.get('/agendas', agendaController.mostrarAgendas);

router.get('/agendas/nueva', agendaController.formularioNuevaAgenda);
router.post('/agendas/nueva', agendaController.crearAgendaBase);

router.get('/agendas/horarios/nuevo', agendaController.formularioNuevoHorario);
router.post('/agendas/horarios', agendaController.agregarHorario);

router.get('/agendas/:id', agendaController.detalleAgenda);
router.get('/agendas/:id/editar', agendaController.formularioEditarAgenda);
router.post('/agendas/:id/editar', agendaController.editarAgenda);

//=================
//DISPONIBILIDAD
//=================
router.get('/agendas/disponibilidad/:profesionalId/:especialidadId/:sucursalId', (req, res) => {

  Agenda.verificarDisponibilidad(
    req.params.profesionalId,
    req.params.especialidadId,
    req.params.sucursalId,
    (err, disponible) => {

      if (err) return res.status(500).json({ disponible: false });

      res.json({ disponible });
    }
  );
});


// =====================
// TURNOS
// =====================

console.log("confirmarTurno:", typeof turnosController.confirmarTurno);

router.get('/turnos', turnosController.mostrarTurnos);

router.get('/turnos/nuevo', turnosController.mostrarFormularioNuevoTurno);
router.post('/turnos', turnosController.crearTurno);


//==================================
//ruteo para reprogramacionTurnos
//================================

router.get(
  '/turnos/reprogramaciones',
  turnosController.mostrarReprogramaciones
);



router.get('/turnos/:id', turnosController.mostrarTurno);

router.get('/turnos/:id/editar', turnosController.mostrarFormularioEditarTurno);
router.post('/turnos/:id/editar', turnosController.editarTurno);
router.post('/turnos/:id/eliminar', turnosController.eliminarTurno);



//=====================
//AUSENCIAS
//=====================




router.get('/ausencias', ausenciasController.listarAusencias);
router.get('/ausencias/nueva', ausenciasController.mostrarFormulario);
router.post('/ausencias/nueva', ausenciasController.crearAusencia);
router.get('/confirmar-turno/:token', turnosController.confirmarTurno);
router.get('/ausencias/:id/editar', ausenciasController.mostrarFormularioEditar);
router.post('/ausencias/:id/editar', ausenciasController.editarAusencia);


// =====================
// HORARIOS AUTOMÁTICOS
// =====================

router.get(
  '/turnos/horarios-disponibles/:profesionalId/:fecha',
  turnosController.obtenerHorariosDisponibles
);
router.get(
  '/turnos/disponibilidad-calendario/:profesionalId',
  turnosController.obtenerDisponibilidadCalendario
);
router.get(
  '/turnos/ocupacion-mensual/:profesionalId',
  turnosController.obtenerOcupacionMensual
);




// =====================
// AJAX DINÁMICO (RELACIONES)
// =====================

// profesionales por especialidad
router.get(
  '/profesionales/especialidad/:especialidadId',
  turnosController.obtenerProfesionalesPorEspecialidad
);

// especialidades por profesional  ✅ ESTA ES LA CLAVE
router.get(
  '/profesionales/:profesionalId/especialidades',
  turnosController.obtenerEspecialidadesPorProfesional
);


// =====================
// PROFESIONALES
// =====================

router.get('/profesionales', profesionalController.mostrarProfesional);

router.get('/profesionales/nuevo', profesionalController.formularioNuevoProfesional);
router.post('/profesionales/nuevo', profesionalController.crearProfesional);

router.get('/profesionales/:id/editar', profesionalController.formularioEditarProfesional);
router.post('/profesionales/:id/editar', profesionalController.editarProfesional);

router.post('/profesionales/:id/inactivar', profesionalController.inactivarProfesional);
router.post('/profesionales/:id/activar', profesionalController.activarProfesional);


//==========================
//SUCURSALES-PROFESIONAL
//==========================

//router.get('/profesionales/:id/sucursales', profesionalController.obtenerSucursalesPorProfesional);



router.get('/sucursales', (req, res) => {
  db.query('SELECT * FROM sucursales', (err, rows) => {
    if (err) return res.status(500).json([]);
    res.json(rows);
  });
});


//=======================
//PACIENTES
//=======================

// LISTAR
router.get('/pacientes', pacienteController.mostrarPacientes);

// FORM CREAR
router.get('/pacientes/nuevo', (req, res) => {
  res.render('nuevoPaciente');
});

// CREAR
router.post('/pacientes', pacienteController.crearPaciente);

// VER DETALLE
router.get('/pacientes/:id', pacienteController.mostrarPaciente);

// FORM EDITAR
router.get('/pacientes/:id/editar', pacienteController.mostrarEditarPaciente);

// GUARDAR EDICION
router.post('/pacientes/:id/editar', pacienteController.editarPaciente);


module.exports = router;
