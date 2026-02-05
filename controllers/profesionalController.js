// controllers/profesionalesController.js
const Profesional = require('../models/Profesional');

// Mostrar todos los profesionales
exports.mostrarProfesional = (req, res) => {
  Profesional.obtenerTodos((err, profesionales) => {
    if (err) return res.status(500).send('Error al obtener los profesionales');
    res.render('listaProfesional', { profesionales });
  });
};

/// Mostrar formulario para crear un nuevo profesional
exports.formularioNuevoProfesional = (req, res) => {
  Profesional.obtenerEspecialidades((err, especialidades) => {
    if (err) return res.status(500).send('Error al obtener especialidades');
    res.render('nuevoProfesional', { especialidades });
  });
};

// Crear un nuevo profesional
const normalizarHora = (valor) => {
  return valor === 'no' ? null : valor;
};

exports.crearProfesional = (req, res) => {
  const {
    nombre_completo,
    matricula,
    hora_inicio_turno1,
    hora_fin_turno1,
    hora_inicio_turno2,
    hora_fin_turno2
  } = req.body;

  let { especialidades } = req.body;

  if (!Array.isArray(especialidades)) {
    especialidades = [especialidades];
  }

  // 🔴 NORMALIZACIÓN DE HORARIOS (ESTO ES LO NUEVO)
  const datosNormalizados = {
    nombre: nombre_completo,
    matricula,
    especialidades,
    hora_inicio_turno1: normalizarHora(hora_inicio_turno1),
    hora_fin_turno1: normalizarHora(hora_fin_turno1),
    hora_inicio_turno2: normalizarHora(hora_inicio_turno2),
    hora_fin_turno2: normalizarHora(hora_fin_turno2)
  };

  Profesional.crear(datosNormalizados, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error al crear profesional');
    }
    res.redirect('/profesionales');
  });
};



/// Mostrar formulario para editar un profesional existente
exports.formularioEditarProfesional = (req, res) => {
  const profesionalId = req.params.id;

  Profesional.obtenerPorId(profesionalId, (err, profesional) => {
    if (err) return res.status(500).send('Error al obtener el profesional');

    Profesional.obtenerEspecialidades((err, especialidades) => {
      if (err) return res.status(500).send('Error al obtener especialidades');

      // Obtener los horarios guardados para este profesional
      res.render('editarProfesional', {
        profesional,
        especialidades
      });
    });
  });
};

exports.editarProfesional = (req, res) => {
  const profesionalId = req.params.id;
  const {
    nombre_completo,
    matricula,
    hora_inicio_turno1,
    hora_fin_turno1,
    hora_inicio_turno2,
    hora_fin_turno2
  } = req.body;
  let { especialidades } = req.body;

  if (!Array.isArray(especialidades)) {
    especialidades = [especialidades];
  }

  // Actualizar datos del profesional, incluyendo horarios
  Profesional.editar(
    profesionalId,
    {
      nombre: nombre_completo,
      matricula,
      especialidades,
      hora_inicio_turno1: normalizarHora(hora_inicio_turno1),
      hora_fin_turno1: normalizarHora(hora_fin_turno1),
      hora_inicio_turno2: normalizarHora(hora_inicio_turno2),
      hora_fin_turno2: normalizarHora(hora_fin_turno2)
    },

    (err) => {
      if (err) return res.status(500).send('Error al editar el profesional');
      res.redirect('/profesionales');
    }
  );
};

exports.inactivarProfesional = (req, res) => {
  const profesionalId = req.params.id;
  Profesional.inactivar(profesionalId, (err) => {
    if (err) return res.status(500).send('Error al inactivar el profesional');
    res.redirect('/profesionales');
  });
};

exports.activarProfesional = (req, res) => {
  const profesionalId = req.params.id;
  Profesional.activar(profesionalId, (err) => {
    if (err) return res.status(500).send('Error al activar el profesional');
    res.redirect('/profesionales');
  });
};
