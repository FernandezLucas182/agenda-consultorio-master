const Ausencia = require('../models/Ausencia');
const db = require('../models/Db');
const { formatearFecha } = require('../utils/fechas');
const { procesarAusencia } = require('../services/reprogramacionService');

exports.mostrarFormulario = (req, res) => {
  db.query(
    `SELECT 
      ag.id,
      CONCAT(p.nombre, ' ', p.apellido) AS nombre_completo
    FROM agendas ag
    JOIN profesionales p ON ag.profesional_id = p.id
    WHERE ag.activo = 1`,
    (err, profesionales) => {
      res.render('nuevaAusencia', { agendas: profesionales || [] });
    }
  );
};

exports.crearAusencia = (req, res) => {

  const { agenda_id, fecha_inicio, fecha_fin, motivo } = req.body;

  Ausencia.crear(
    { agenda_id, fecha_inicio, fecha_fin, motivo },
    (err) => {

      if (err) return res.status(500).send('Error al guardar ausencia');

      // 🔥 IMPORTANTE: ahora pasás agenda_id
      procesarAusencia(agenda_id, fecha_inicio, fecha_fin);

      res.redirect('/ausencias');
    }
  );
};

exports.listarAusencias = (req, res) => {

  const buscar = req.query.buscar || '';

  Ausencia.obtenerTodas(buscar, (err, ausencias) => {

    if (err) {
      console.error("ERROR EN AUSENCIAS:", err);
      return res.status(500).send("Error en ausencias");
    }

    ausencias = (ausencias || []).map(a => ({
      ...a,
      fecha_inicio: formatearFecha(a.fecha_inicio),
      fecha_fin: formatearFecha(a.fecha_fin)
    }));

    res.render('ausencias', { ausencias, buscar });
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
      `SELECT 
    ag.id,
    CONCAT(p.nombre, ' ', p.apellido) AS nombre
   FROM agendas ag
   JOIN profesionales p ON ag.profesional_id = p.id
   WHERE ag.activo = 1`,
      (err2, agendas) => {

        res.render('editarAusencia', {
          ausencia,
          agendas: agendas || []   // 🔥 CAMBIO CLAVE
        });
      }
    );
  });
};


exports.editarAusencia = (req, res) => {

  const id = req.params.id;
  const { agenda_id, fecha_inicio, fecha_fin, motivo } = req.body;

  Ausencia.actualizar(
    id,
    { agenda_id, fecha_inicio, fecha_fin, motivo },
    (err) => {

      if (err) return res.status(500).send("Error al actualizar ausencia");

      // 🔥 IMPORTANTE: volver a procesar reprogramación
      procesarAusencia(agenda_id, fecha_inicio, fecha_fin);

      res.redirect('/ausencias');
    }
  );
};