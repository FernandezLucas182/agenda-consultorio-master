const express = require('express');
const router = express.Router();

// Controladores
const agendaController = require('../controllers/agendaController');
const turnosController = require('../controllers/turnosController');
const profesionalController = require('../controllers/profesionalController');
const authController = require('../controllers/authController');

// =====================
// Home & Login
// =====================

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

// =====================
// AGENDAS
// =====================

// Ver agenda completa
router.get('/agendas', agendaController.mostrarAgendas);

// Formulario nueva agenda (con profesionales + especialidades)
router.get('/agendas/nueva', agendaController.formularioNuevaAgenda);

// Crear agenda base
router.post('/agendas/nueva', agendaController.crearAgendaBase);

// Formulario agregar horario (con agendas reales)
router.get('/agendas/horarios/nuevo', agendaController.formularioNuevoHorario);

// Guardar horario
router.post('/agendas/horarios', agendaController.agregarHorario);

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

router.get(
  '/turnos/horarios-ocupados/:profesionalId/:fecha',
  turnosController.obtenerHorariosOcupados
);

router.get(
  '/profesionales/especialidad/:especialidadId',
  turnosController.obtenerProfesionalesPorEspecialidad
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

module.exports = router;
