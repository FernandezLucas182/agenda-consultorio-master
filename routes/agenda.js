const express = require('express');
const router = express.Router();
const agendaController = require('../controllers/agendaController');

// 📌 Mostrar agenda completa
router.get('/agendas', agendaController.mostrarAgendas);

// 📌 Mostrar formulario para crear nueva agenda (dinámico)
router.get('/agendas/nueva', agendaController.formularioNuevaAgenda);

// 📌 Crear agenda base
router.post('/agendas/nueva', agendaController.crearAgendaBase);

// 📌 Mostrar formulario para agregar nuevo horario (dinámico)
router.get('/agendas/horarios/nuevo', agendaController.formularioNuevoHorario);

// 📌 Agregar horarios a agenda
router.post('/agendas/horarios', agendaController.agregarHorario);

module.exports = router;
