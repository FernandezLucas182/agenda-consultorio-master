const Ausencia = require('../models/Ausencia');
const db = require('../models/Db');
const { formatearFecha, formatearFechaLarga } = require('../utils/fechas');
const { procesarAusencia } = require('../services/reprogramacionService');
const SolicitudAusencia = require('../models/SolicitudAusencia');

exports.mostrarFormulario = (req, res) => {

  db.query(
    `SELECT
      ag.id,
      CONCAT(p.nombre, ' ', p.apellido) AS nombre_completo
    FROM agendas ag
    JOIN profesionales p ON ag.profesional_id = p.id
    WHERE ag.activo = 1`,
    (err, profesionales) => {

      Ausencia.obtenerTodas('', req.session.user, (err2, ausencias) => {

        if (err2) {
          console.error("ERROR CARGANDO AUSENCIAS:", err2);
          return res.status(500).send("Error cargando ausencias");
        }

        res.render('nuevaAusencia', {
          agendas: profesionales || [],
          ausencias: ausencias || [],
          path: req.path,
          usuario: req.session.user
        });

      });

    }
  );
};

// ==========================
// FORMULARIO SOLICITAR AUSENCIA (MÉDICO)
// ==========================

exports.mostrarFormularioSolicitud = (req, res) => {

  const profesionalId = req.session.user.profesional_id;

  db.query(
    `
      SELECT
        ag.id,
        CONCAT(p.nombre, ' ', p.apellido) AS nombre_completo
      FROM agendas ag
      JOIN profesionales p
        ON ag.profesional_id = p.id
      WHERE ag.profesional_id = ?
        AND ag.activo = 1
    `,
    [profesionalId],
    (err, profesionales) => {

      if (err) {
        console.error(err);
        return res.status(500).send("Error cargando formulario");
      }

      res.render("solicitarAusencia", {
        agenda: profesionales[0],
        usuario: req.session.user,
        path: req.path
      });

    }
  );

};

exports.crearAusencia = (req, res) => {
  console.log("🔥 BODY AUSENCIA:", req.body);

  const { agenda_id, fecha_inicio, fecha_fin, motivo } = req.body;

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const inicio = new Date(fecha_inicio);
  inicio.setHours(0, 0, 0, 0);

  const fin = new Date(fecha_fin);
  fin.setHours(0, 0, 0, 0);

  if (inicio < hoy || fin < hoy) {
    return res.status(400).send("No se pueden registrar ausencias en fechas pasadas.");
  }

  if (fin < inicio) {
    return res.status(400).send("La fecha de fin no puede ser anterior a la fecha de inicio.");
  }

  Ausencia.crear(
    { agenda_id, fecha_inicio, fecha_fin, motivo },

    (err, result) => {

      if (err) {
        console.error("❌ ERROR MYSQL AUSENCIA:", err);
        return res.status(500).send(err.sqlMessage || err.message);
      }

      console.log("✅ AUSENCIA CREADA OK");

      procesarAusencia(agenda_id, fecha_inicio, fecha_fin);

      return res.redirect(`/ausencias?nuevo=${result.insertId}`);
    }
  );
};


// ==========================
// CREAR SOLICITUD DE AUSENCIA (MÉDICO)
// ==========================

exports.crearSolicitudAusencia = (req, res) => {

  console.log("🔥 BODY SOLICITUD AUSENCIA:", req.body);


  const {
    agenda_id,
    fecha_inicio,
    fecha_fin,
    motivo
  } = req.body;


  SolicitudAusencia.crear(
    {
      agenda_id,
      fecha_inicio,
      fecha_fin,
      motivo
    },

    (err) => {

      if (err) {
        console.error("❌ ERROR SOLICITUD:", err);
        return res.status(500).send(err.sqlMessage || err.message);
      }


      console.log("✅ SOLICITUD CREADA");


      res.redirect('/ausencias');
    }
  );

};


exports.listarAusencias = (req, res) => {

  const buscar = req.query.buscar || '';
  const fecha = req.query.fecha || '';

  const usuario = req.session.user;

  const nuevoId = req.query.nuevo;
  const editadoId = req.query.editado;

  Ausencia.obtenerConfirmadas(buscar, fecha, usuario, (err, ausencias) => {

    if (err) {
      console.error("ERROR EN AUSENCIAS:", err);
      return res.status(500).send("Error en ausencias");
    }


    // =====================================
    // SOLICITUDES PENDIENTES ADMIN
    // =====================================

    SolicitudAusencia.obtenerPendientes((err2, solicitudes) => {
      console.log("SOLICITUDES PENDIENTES:", solicitudes);
      solicitudes = (solicitudes || []).map(s => {

        return {
          ...s,

          fecha_inicio:
            formatearFechaLarga(s.fecha_inicio),

          fecha_fin:
            formatearFechaLarga(s.fecha_fin)

        };

      });


      if (err2) {

        console.error(
          "ERROR SOLICITUDES AUSENCIA:",
          err2
        );

        solicitudes = [];

      }



      ausencias = (ausencias || []).map(a => ({


        ...a,


        fecha_inicio: formatearFecha(a.fecha_inicio),

        fecha_fin: formatearFecha(a.fecha_fin),


        recienCreado:
          Number(a.id) === Number(nuevoId),


        recienEditado:
          Number(a.id) === Number(editadoId)


      }));



      console.log("ENVIANDO A PUG:", solicitudes);




      res.render('ausencias', {

        ausencias,

        solicitudes,


        buscar,

        path: req.path,

        fecha,

        usuario: req.session.user

      });



    });


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

        Ausencia.obtenerPorAgenda(ausencia.agenda_id, (err3, ausencias) => {

          const fechas = ausencias.map(a => new Date(a.fecha_inicio));

          const fechaBase = new Date(Math.min(...fechas));
          fechaBase.setHours(0, 0, 0, 0);


          ausencias = ausencias.map(a => {

            const inicio = new Date(a.fecha_inicio);
            const fin = new Date(a.fecha_fin);

            inicio.setHours(0, 0, 0, 0);
            fin.setHours(0, 0, 0, 0);

            const dias =
              Math.floor(
                (fin - inicio) / 86400000
              ) + 1;


            const offset =
              Math.floor(
                (inicio - fechaBase) / 86400000
              );


            return {

              ...a,

              dias,
              offset,

              inicioTexto: formatearFecha(a.fecha_inicio),
              finTexto: formatearFecha(a.fecha_fin)

            };

          });

          const hoy = new Date();
          hoy.setHours(0, 0, 0, 0);

          const fechaFinAusencia = new Date(ausencia.fecha_fin);
          fechaFinAusencia.setHours(0, 0, 0, 0);

          const esHistorica = fechaFinAusencia < hoy;


          res.render("editarAusencia", {

            ausencia,
            agendas,

            ausencias,

            fechaBase,

            esHistorica,

            path: req.path

          });

        });

      }
    );
  });
};


exports.editarAusencia = (req, res) => {

  const id = req.params.id;

  const {
    agenda_id,
    fecha_inicio,
    fecha_fin,
    motivo
  } = req.body;

  Ausencia.obtenerPorId(id, (err, ausenciaActual) => {

    if (err || !ausenciaActual) {
      return res.status(404).send("Ausencia no encontrada");
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const inicioAnterior = new Date(ausenciaActual.fecha_inicio);
    inicioAnterior.setHours(0, 0, 0, 0);

    const finAnterior = new Date(ausenciaActual.fecha_fin);
    finAnterior.setHours(0, 0, 0, 0);

    const inicioNuevo = new Date(fecha_inicio);
    inicioNuevo.setHours(0, 0, 0, 0);

    const finNuevo = new Date(fecha_fin);
    finNuevo.setHours(0, 0, 0, 0);

    // Siempre validar rango
    if (finNuevo < inicioNuevo) {
      return res.status(400).send(
        "La fecha de fin no puede ser anterior a la fecha de inicio."
      );
    }

    // ¿La ausencia original ya terminó?
    const ausenciaHistorica = finAnterior < hoy;

    // Si NO era histórica, no permitir moverla al pasado
    if (!ausenciaHistorica) {

      if (inicioNuevo < hoy || finNuevo < hoy) {
        return res.status(400).send(
          "No se puede modificar una ausencia vigente o futura para que quede en el pasado."
        );
      }

    }

    Ausencia.actualizar(
      id,
      {
        agenda_id,
        fecha_inicio,
        fecha_fin,
        motivo
      },
      (err) => {

        if (err) {
          return res.status(500).send("Error al actualizar ausencia");
        }

        procesarAusencia(
          agenda_id,
          fecha_inicio,
          fecha_fin
        );

        res.redirect(`/ausencias?editado=${id}`);
      }
    );

  });

};

exports.obtenerAusenciasAgenda = (req, res) => {

  const agenda_id = req.params.id;

  Ausencia.obtenerPorAgenda(agenda_id, (err, ausencias) => {

    if (err)
      return res.status(500).json([]);

    const fechas = (ausencias || []).map(a => new Date(a.fecha_inicio));

    if (fechas.length === 0) {
      return res.json([]);
    }

    const fechaBase = new Date(Math.min(...fechas));
    fechaBase.setHours(0, 0, 0, 0);

    const resultado = (ausencias || []).map(a => {

      const inicio = new Date(a.fecha_inicio);
      const fin = new Date(a.fecha_fin);

      inicio.setHours(0, 0, 0, 0);
      fin.setHours(0, 0, 0, 0);

      const dias = Math.floor((fin - inicio) / 86400000) + 1;

      const offset = Math.floor((inicio - fechaBase) / 86400000);

      return {
        ...a,
        dias,
        offset,
        inicioTexto: formatearFecha(a.fecha_inicio),
        finTexto: formatearFecha(a.fecha_fin)
      };
    });

    res.json(resultado);

  });

};


exports.aprobarSolicitud = (req, res) => {


  const id = req.params.id;


  db.query(
    `
    SELECT *
    FROM solicitudes_ausencias
    WHERE id=?
    `,
    [id],
    (err, solicitud) => {


      if (err || !solicitud[0]) {
        return res.redirect('/ausencias');
      }


      const s = solicitud[0];


      Ausencia.crear(
        {
          agenda_id: s.agenda_id,
          fecha_inicio: s.fecha_inicio,
          fecha_fin: s.fecha_fin,
          motivo: s.motivo
        },

        () => {


          SolicitudAusencia.aprobar(
            id,
            () => {

              procesarAusencia(
                s.agenda_id,
                s.fecha_inicio,
                s.fecha_fin
              );


              res.redirect('/ausencias');

            }
          );

        }
      );


    }
  );


};


exports.rechazarSolicitud = (req, res) => {


  SolicitudAusencia.rechazar(
    req.params.id,
    () => {
      res.redirect('/ausencias');
    }
  );


};
