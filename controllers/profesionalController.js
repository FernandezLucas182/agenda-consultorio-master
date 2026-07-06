// controllers/profesionalesController.js
const Profesional = require('../models/Profesional');

// Mostrar todos los profesionales
exports.mostrarProfesional = (req, res) => {

  const filtro = req.query.buscar || '';

  const nuevoId = req.query.nuevo;
  const editadoId = req.query.editado;

  Profesional.obtenerTodos(filtro, (err, profesionales) => {

    if (err)
      return res.status(500).send('Error al obtener los profesionales');


    profesionales = profesionales.map(p => ({

      ...p,

      recienCreado:
        Number(p.id) === Number(nuevoId),

      recienEditado:
        Number(p.id) === Number(editadoId)

    }));


    profesionales.sort((a, b) => {

      if (a.recienCreado !== b.recienCreado)
        return a.recienCreado ? -1 : 1;

      if (a.recienEditado !== b.recienEditado)
        return a.recienEditado ? -1 : 1;

      return 0;

    });


    res.render('listaProfesional', {

      profesionales,
      filtro,

      path: req.path

    });

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
    nombre,
    apellido,
    dni,
    telefono,
    email,
    matricula,
    nueva_especialidad
  } = req.body;

  // 🔴 VALIDACIÓN ACÁ
  if (!nombre || !apellido) {
    return res.status(400).send('Nombre y apellido son obligatorios');
  }

  let { especialidades } = req.body;

  if (!especialidades) {
    especialidades = [];
  } else if (!Array.isArray(especialidades)) {
    especialidades = [especialidades];
  }

  const continuarCreacion = (especialidadesFinales) => {

    const datosNormalizados = {
      nombre,
      apellido,
      dni,
      telefono,
      email,
      matricula,
      especialidades: especialidadesFinales,
    };

    Profesional.crear(datosNormalizados, (err, profesionalId) => {

      if (err) {
        console.error(err);
        return res.status(500).send('Error al crear profesional');
      }

      res.redirect(`/profesionales?nuevo=${profesionalId}`);

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
    if (err) return res.status(500).send('Error al obtener el profesional');
    if (!profesional) return res.status(404).send('Profesional no encontrado');

    Profesional.obtenerEspecialidades((err2, especialidades) => {
      if (err2) return res.status(500).send('Error al obtener especialidades');

      Profesional.obtenerEspecialidadesPorProfesional(profesionalId, (err3, especialidadesAsignadas) => {
        if (err3) return res.status(500).send('Error al obtener especialidades del profesional');

        // 🔥 ACÁ SÍ existe profesional
        res.render('editarProfesional', {
          profesional,
          especialidades,
          especialidadesAsignadas
        });

      });

    });

  });
};

exports.editarProfesional = (req, res) => {
  const profesionalId = req.params.id;

  const {
    nombre,
    apellido,
    dni,
    telefono,
    email,
    matricula
  } = req.body;

  // 🔴 VALIDACIÓN
  if (!nombre || !apellido) {
    return res.status(400).send('Nombre y apellido son obligatorios');
  }
  let { especialidades } = req.body;

  if (!especialidades) {
    especialidades = [];
  } else if (!Array.isArray(especialidades)) {
    especialidades = [especialidades];
  }

  Profesional.editar(
    profesionalId,
    {
      nombre,
      apellido,
      dni,
      telefono,
      email,
      matricula,
      especialidades
    },
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error al editar el profesional');
      }

      res.redirect(`/profesionales?editado=${profesionalId}`);
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



exports.obtenerPorSucursal = (req, res) => {

  const sucursalId = req.params.sucursalId;

  console.log("Sucursal recibida:", sucursalId);

  Profesional.obtenerPorSucursal(sucursalId, (err, data) => {

    console.log("Profesionales encontrados:", data);

    if (err) return res.status(500).json([]);

    res.json(data);

  });

};

exports.obtenerParaCopiarAgenda = (req, res) => {

  const { sucursalId, especialidadId } = req.params;

  console.log("Sucursal:", sucursalId);
  console.log("Especialidad:", especialidadId);

  Profesional.obtenerParaCopiarAgenda(
    sucursalId,
    especialidadId,
    (err, data) => {

      if (err) {
        console.error(err);
        return res.status(500).json([]);
      }
      console.log("Profesionales encontrados:", data);

      res.json(data);

    }
  );

};

// ==========================
// DEVOLVER SUCURSALES POR PROFESIONAL (API) 🔥
// ==========================
/*exports.obtenerSucursalesPorProfesional = (req, res) => {
  const profesionalId = req.params.id;

  Profesional.obtenerSucursalesPorProfesional(profesionalId, (err, sucursales) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al obtener sucursales' });
    }

    res.json(sucursales);
  });
};*/