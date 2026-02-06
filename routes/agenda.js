const express = require('express');
const router = express.Router();
const agendaController = require('../controllers/agendaController');

// 👉 formulario con datos reales
router.get('/agendas/nueva', agendaController.formularioNuevaAgenda);

// 👉 mostrar agendas
router.get('/agendas', agendaController.mostrarAgendas);

// 👉 formulario nuevo horario
router.get('/agendas/horarios/nuevo', agendaController.formularioNuevoHorario);

// 👉 crear agenda base
router.post('/agendas/nueva', agendaController.crearAgendaBase);

// 👉 agregar horarios
router.post('/agendas/horarios', agendaController.agregarHorario);

module.exports = router;
