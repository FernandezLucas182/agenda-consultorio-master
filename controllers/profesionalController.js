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
    nueva_especialidad
  } = req.body;

  let { especialidades } = req.body;

  if (!especialidades) {
    especialidades = [];
  } else if (!Array.isArray(especialidades)) {
    especialidades = [especialidades];
  }

  const continuarCreacion = (especialidadesFinales) => {

    const datosNormalizados = {
      nombre: nombre_completo,
      matricula,
      especialidades: especialidadesFinales,
      
    };

    Profesional.crear(datosNormalizados, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error al crear profesional');
      }
      res.redirect('/profesionales');
    });
  };

  // 🔴 Si escribió nueva especialidad
  if (nueva_especialidad && nueva_especialidad.trim() !== '') {

    const nombreLimpio = nueva_especialidad.trim();

    const db = require('../models/Db');

    db.query(
      'INSERT INTO especialidades (nombre) VALUES (?)',
      [nombreLimpio],
      (err, result) => {

        if (err) {
          // Si es duplicado, buscarla en vez de fallar
          if (err.code === 'ER_DUP_ENTRY') {

            db.query(
              'SELECT id FROM especialidades WHERE nombre = ?',
              [nombreLimpio],
              (err2, rows) => {
                if (err2 || !rows.length)
                  return res.status(500).send('Error especialidad');

                especialidades.push(rows[0].id);
                continuarCreacion(especialidades);
              }
            );

          } else {
            return res.status(500).send('Error al crear especialidad');
          }
        } else {
          especialidades.push(result.insertId);
          continuarCreacion(especialidades);
        }
      }
    );

  } else {
    continuarCreacion(especialidades);
  }
};



/// Mostrar formulario para editar un profesional existente
exports.formularioEditarProfesional = (req, res) => {
  const profesionalId = req.params.id;

  Profesional.obtenerPorId(profesionalId, (err, profesional) => {
    console.error("ERROR OBTENER PROFESIONAL:", err);
    console.log("PROFESIONAL:", profesional);
    if (err) return res.status(500).send('Error al obtener el profesional');

    if (!profesional)
      return res.status(404).send('Profesional no encontrado');

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
    
  } = req.body;
  let { especialidades } = req.body;

  if (!especialidades) {
  especialidades = [];
} else if (!Array.isArray(especialidades)) {
  especialidades = [especialidades];
}

  // Actualizar datos del profesional, incluyendo horarios
  Profesional.editar(
    profesionalId,
    {
      nombre: nombre_completo,
    matricula,
    especialidades
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
