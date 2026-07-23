
const express = require('express');
const router = express.Router();
const db = require('../models/Db');
const Agenda = require('../models/Agenda');

// =====================
// CONTROLADORES
// =====================

const usuarioController = require('../controllers/usuarioController');
const agendaController = require('../controllers/agendaController');
const turnosController = require('../controllers/turnosController');
const profesionalController = require('../controllers/profesionalController');
const authController = require('../controllers/authController');
const pacienteController = require('../controllers/pacienteController');
const ausenciasController = require('../controllers/ausenciasController');
const {
  isAuthenticated,
  authorize
} = require('../middlewares/auth');

console.log("🔥 ROUTER AUSENCIAS CARGADO");
console.log("Agenda controller keys:", Object.keys(agendaController));
console.log("Turnos controller keys:", Object.keys(turnosController));

console.log("Agenda:", Object.keys(agendaController));
console.log("Turnos:", Object.keys(turnosController));
console.log("Profesional:", Object.keys(profesionalController));
console.log("Auth:", Object.keys(authController));
console.log("Paciente:", Object.keys(pacienteController));

router.get(
  '/profesionales/todos',
  turnosController.obtenerTodosProfesionales
);

// =====================
// HOME & LOGIN
// =====================

router.get('/', (req, res) => {
  console.log("SESSION USER:", req.session.user);

  if (!req.session.user) {
    return res.redirect('/login');
  }

  const sql = `
    SELECT 
      COUNT(*) AS totalReprogramaciones
    FROM turnos
    WHERE estado = 'reprogramar'
`;

  const sqlAusencias = `
    SELECT 
      COUNT(*) AS totalSolicitudesAusencias
    FROM solicitudes_ausencias
    WHERE estado = 'pendiente'
`;

  db.query(sql, (err, rows) => {

    if (err) {
      return res.render('index', {
        totalReprogramaciones: 0,
        path: req.path
      });
    }

    db.query(sqlAusencias, (err2, rows2) => {

      res.render('index', {

        totalReprogramaciones: rows[0].total,

        cantidadSolicitudesAusencias:
          rows2[0].totalSolicitudesAusencias,

        path: req.path,

        usuario: req.session.user

      });

    });

  });

});

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

router.get('/logout', authController.logout);


// =====================
// AGENDAS
// =====================


//====================================
//Middleware - Autorizaciones
//====================================
router.get('/agendas', isAuthenticated, authorize('admin', 'secretaria', 'medico'), agendaController.mostrarAgendas);

router.get('/agendas/nueva', isAuthenticated, authorize('admin', 'secretaria'), agendaController.formularioNuevaAgenda);

router.post('/agendas/nueva', isAuthenticated, authorize('admin', 'secretaria'), agendaController.crearAgendaBase);

router.get('/agendas/horarios/nuevo', isAuthenticated, authorize('admin', 'secretaria'), agendaController.formularioNuevoHorario);

router.post('/agendas/horarios', isAuthenticated, authorize('admin', 'secretaria'), agendaController.agregarHorario);



router.get('/agendas/:id/editar', isAuthenticated, authorize('admin', 'secretaria'), agendaController.formularioEditarAgenda);


router.get('/agendas/:id/copiar', isAuthenticated, authorize('admin', 'secretaria'), agendaController.formularioCopiarAgenda);


router.post('/agendas/:id/editar', isAuthenticated, authorize('admin', 'secretaria'), agendaController.editarAgenda);

//=================
//DISPONIBILIDAD
//=================
router.get('/agendas/disponibilidad/:profesionalId/:especialidadId/:sucursalId', isAuthenticated, authorize('admin', 'secretaria', 'medico'), (req, res) => {

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

router.get('/agendas/:id', isAuthenticated, authorize('admin', 'secretaria', 'medico'), agendaController.detalleAgenda);


// =====================
// TURNOS
// =====================

console.log("confirmarTurno:", typeof turnosController.confirmarTurno);

router.get('/mis-turnos', isAuthenticated, authorize('medico'), turnosController.mostrarMisTurnos);

router.get('/turnos', isAuthenticated, authorize('admin', 'secretaria'), turnosController.mostrarTurnos);

router.get('/turnos/eventos', isAuthenticated, authorize('admin', 'secretaria'), turnosController.obtenerEventosTodos);


router.get('/mis-turnos/eventos', isAuthenticated, authorize('medico'), turnosController.obtenerEventosMisTurnos);

router.get('/turnos/nuevo', turnosController.mostrarFormularioNuevoTurno);

router.post('/turnos', turnosController.crearTurno);

router.get(

  '/turnos/sucursal/:profesionalId/:especialidadId',

  turnosController.obtenerSucursalAgenda

);
//==================================
//ruteo para reprogramacionTurnos
//================================

router.get('/turnos/reprogramaciones', turnosController.mostrarReprogramaciones);

router.get('/turnos/:id/editar', isAuthenticated, authorize('admin', 'secretaria'), turnosController.mostrarFormularioEditarTurno);

router.post('/turnos/:id/editar', isAuthenticated, authorize('admin', 'secretaria'), turnosController.editarTurno);

router.post('/turnos/:id/eliminar', turnosController.eliminarTurno);

router.get('/turnos/:id', turnosController.mostrarTurno);


//=====================
//AUSENCIAS
//=====================




router.get('/ausencias', isAuthenticated, authorize('admin', 'secretaria', 'medico'), ausenciasController.listarAusencias);

router.get(
  '/ausencias/solicitar',
  isAuthenticated,
  authorize('medico'),
  ausenciasController.mostrarFormularioSolicitud
);


router.post('/ausencias/solicitar', isAuthenticated, authorize('medico'), ausenciasController.crearSolicitudAusencia);

router.post('/ausencias/solicitud/:id/aprobar', isAuthenticated, authorize('admin','secretaria'), ausenciasController.aprobarSolicitud);


router.post('/ausencias/solicitud/:id/rechazar', isAuthenticated, authorize('admin','secretaria'), ausenciasController.rechazarSolicitud);





router.get('/ausencias/nueva', isAuthenticated, authorize('admin'), ausenciasController.mostrarFormulario);


router.post('/ausencias/nueva', isAuthenticated, authorize('admin'), ausenciasController.crearAusencia);

router.get('/confirmar-turno/:token', turnosController.confirmarTurno);

router.get('/ausencias/:id/editar', isAuthenticated, authorize('admin', 'secretaria'), ausenciasController.mostrarFormularioEditar);

router.post('/ausencias/:id/editar', isAuthenticated, authorize('admin', 'secretaria'), ausenciasController.editarAusencia);

router.get('/ausencias/agenda/:id', ausenciasController.obtenerAusenciasAgenda);





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

// profesionales por sucursal 
router.get(
  '/profesionales/sucursal/:sucursalId',
  profesionalController.obtenerPorSucursal
);

router.get(
  '/profesionales/copiar/:sucursalId/:especialidadId',
  profesionalController.obtenerParaCopiarAgenda
);


// =====================
// PROFESIONALES
// =====================

router.get('/profesionales', isAuthenticated, authorize('admin'), profesionalController.mostrarProfesional);

router.get('/profesionales/nuevo', profesionalController.formularioNuevoProfesional);

router.post('/profesionales/nuevo', profesionalController.crearProfesional);

router.get('/profesionales/:id/editar', profesionalController.formularioEditarProfesional);

router.post('/profesionales/:id/editar', profesionalController.editarProfesional);

router.post('/profesionales/:id/inactivar', profesionalController.inactivarProfesional);

router.post('/profesionales/:id/activar', profesionalController.activarProfesional);


router.get('/usuarios', isAuthenticated, authorize('admin'), usuarioController.listarUsuarios);

router.get('/usuarios/nuevo', isAuthenticated, authorize('admin'), usuarioController.formularioNuevoUsuario);

router.post('/usuarios/nuevo', isAuthenticated, authorize('admin'), usuarioController.crearUsuario);

// ====================
// EDITAR USUARIO
// ====================

router.get('/usuarios/:id/editar', isAuthenticated, authorize('admin'), usuarioController.formularioEditarUsuario);

router.post('/usuarios/:id/editar', isAuthenticated, authorize('admin'), usuarioController.editarUsuario);


// ====================
// CAMBIAR CONTRASEÑA
// ====================

router.get('/usuarios/:id/password', isAuthenticated, authorize('admin'), usuarioController.formularioPassword);

router.post('/usuarios/:id/password', isAuthenticated, authorize('admin'), usuarioController.guardarPassword);

// ====================
// RESETEAR CONTRASEÑA
// ====================

router.get('/usuarios/:id/reset-password', isAuthenticated, authorize('admin'), usuarioController.resetPassword);

router.get('/usuarios/:id/password-generada', isAuthenticated, authorize('admin'), usuarioController.mostrarPasswordGenerada);

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

