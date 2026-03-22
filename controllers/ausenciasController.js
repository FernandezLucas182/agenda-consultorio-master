const Ausencia = require('../models/Ausencia');
const db = require('../models/Db');
const { formatearFecha } = require('../utils/fechas');
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

    if (err) {
      console.error("ERROR EN AUSENCIAS:", err);
      return res.status(500).send("Error en ausencias");
    }

    ausencias = (ausencias || []).map(a => ({
      ...a,
      fecha_inicio: formatearFecha(a.fecha_inicio),
      fecha_fin: formatearFecha(a.fecha_fin)
    }));

    res.render('ausencias', { ausencias });
  });

};

exports.mostrarFormularioEditar = (req, res) => {

  const id = req.params.id;

  Ausencia.obtenerPorId(id, (err, ausencia) => {
    if (err || !ausencia) {
      return res.status(404).send("Ausencia no encontrada");
    }

    // 🔥 FORMATEO CORRECTO PARA INPUT DATE
    const formatearFechaInput = (fecha) => {
      if (!fecha) return '';
      const f = new Date(fecha);
      return f.getFullYear() + '-' +
        String(f.getMonth() + 1).padStart(2, '0') + '-' +
        String(f.getDate()).padStart(2, '0');
    };

    ausencia.fecha_inicio = formatearFechaInput(ausencia.fecha_inicio);
    ausencia.fecha_fin = formatearFechaInput(ausencia.fecha_fin);

    db.query(
      `SELECT id, nombre_completo 
       FROM profesionales 
       WHERE estado = 'activo'`,
      (err2, profesionales) => {

        res.render('editarAusencia', {
          ausencia,
          profesionales: profesionales || []
        });
      }
    );
  });
};


exports.editarAusencia = (req, res) => {

  const id = req.params.id;
  const { profesional_id, fecha_inicio, fecha_fin, motivo } = req.body;

  Ausencia.actualizar(
    id,
    { profesional_id, fecha_inicio, fecha_fin, motivo },
    (err) => {

      if (err) return res.status(500).send("Error al actualizar ausencia");

      // 🔥 IMPORTANTE: volver a procesar reprogramación
      procesarAusencia(profesional_id, fecha_inicio, fecha_fin);

      res.redirect('/ausencias');
    }
  );
};