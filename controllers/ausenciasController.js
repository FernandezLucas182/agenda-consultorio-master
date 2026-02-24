const Ausencia = require('../models/Ausencia');
const db = require('../models/Db');
const { procesarAusencia } = require('../services/reprogramacionService');

exports.mostrarFormulario = (req, res) => {
  db.query(
    `SELECT id, nombre_completo FROM profesionales WHERE estado = 'activo'`,
    (err, profesionales) => {
      res.render('nuevaAusencia', { profesionales: profesionales || [] });
    }
  );
};

exports.crearAusencia = (req, res) => {

  const { profesional_id, fecha_inicio, fecha_fin, motivo } = req.body;

  Ausencia.crear(
    { profesional_id, fecha_inicio, fecha_fin, motivo },
    (err) => {

      if (err) return res.status(500).send('Error al guardar ausencia');

      // 🔥 EJECUCIÓN AUTOMÁTICA
      procesarAusencia(profesional_id, fecha_inicio, fecha_fin);

      res.redirect('/ausencias');
    }
  );
};

exports.listarAusencias = (req, res) => {

  Ausencia.obtenerTodas((err, ausencias) => {
    res.render('ausencias', { ausencias: ausencias || [] });
  });

};