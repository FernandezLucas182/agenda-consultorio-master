const express = require('express');
const router = express.Router();

// Importar controladores
const agendaController = require('../controllers/agendaController');
const turnosController = require('../controllers/turnosController');
const profesionalController = require('../controllers/profesionalController');
const authController = require('../controllers/authController');

router.get('/login', (req, res) => {
    res.render('login'); // Renderizar la vista de login
});

// Ruta principal (homepage)
router.get('/', (req, res) => {
    res.render('index'); // Renderizar la vista de inicio
});

// Rutas para las agendas
// =====================
// Rutas de Agenda (nuevo modelo)
// =====================

// Mostrar agenda completa
router.get('/agendas', agendaController.mostrarAgendas);

// Formulario nueva agenda base
router.get('/agendas/nueva', (req, res) => {
    res.render('nuevaAgenda');
});

// Crear agenda base
router.post('/agendas/nueva', agendaController.crearAgendaBase);

// Formulario agregar horario
router.get('/agendas/horarios/nuevo', (req, res) => {
    res.render('nuevoHorario');
});

// Guardar horario
router.post('/agendas/horarios', agendaController.agregarHorario);


// Rutas para los turnos
router.get('/turnos', turnosController.mostrarTurnos); // Mostrar todos los turnos
router.get('/turnos/nuevo', turnosController.mostrarFormularioNuevoTurno);
router.post('/turnos', turnosController.crearTurno);
router.get('/profesionales/especialidad/:especialidadId', turnosController.obtenerProfesionalesPorEspecialidad);
router.post('/turnos', turnosController.crearTurno); // Crear un nuevo turno
router.get('/turnos/:id', turnosController.mostrarTurno); // Ver el detalle del turno
router.get('/turnos/:id/editar', turnosController.mostrarFormularioEditarTurno); // Mostrar el formulario de edición
router.post('/turnos/:id/editar', turnosController.editarTurno); // Procesar la edición
router.post('/turnos/:id/eliminar', turnosController.eliminarTurno); // Eliminar el turno
router.get('/turnos/horarios-ocupados/:profesionalId/:fecha', turnosController.obtenerHorariosOcupados);
// Ruta para mostrar la lista de profesionales
router.get('/profesionales', profesionalController.mostrarProfesional);
router.get('/profesionales/nuevo', profesionalController.formularioNuevoProfesional);
router.post('/profesionales/nuevo', profesionalController.crearProfesional);
router.get('/profesionales/:id/editar', profesionalController.formularioEditarProfesional);
router.post('/profesionales/:id/editar', profesionalController.editarProfesional);
router.post('/profesionales/:id/inactivar', profesionalController.inactivarProfesional);
router.post('/profesionales/:id/activar', profesionalController.activarProfesional);

router.get('/login', authController.getLogin);

// Ruta para manejar el envío del formulario de login
router.post('/login', authController.postLogin);
module.exports = router;
