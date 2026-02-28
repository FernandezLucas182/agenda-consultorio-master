const express = require('express');
const router = express.Router();

// =====================
// CONTROLADORES
// =====================

const agendaController = require('../controllers/agendaController');
const turnosController = require('../controllers/turnosController');
const profesionalController = require('../controllers/profesionalController');
const authController = require('../controllers/authController');
const pacienteController = require('../controllers/pacienteController');
const ausenciasController = require('../controllers/ausenciasController');

console.log("Agenda:", Object.keys(agendaController));
console.log("Turnos:", Object.keys(turnosController));
console.log("Profesional:", Object.keys(profesionalController));
console.log("Auth:", Object.keys(authController));
console.log("Paciente:", Object.keys(pacienteController));
// =====================
// HOME & LOGIN
// =====================

router.get('/', (req, res) => {
  res.render('index');
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



// =====================
// TURNOS
// =====================

router.get('/turnos', turnosController.mostrarTurnos);

router.get('/turnos/nuevo', turnosController.mostrarFormularioNuevoTurno);
router.post('/turnos', turnosController.crearTurno);

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
