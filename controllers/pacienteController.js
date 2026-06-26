const Paciente = require('../models/Paciente');

// Mostrar todos los pacientes //Busqueda por dni
exports.mostrarPacientes = (req, res) => {

  const dni = req.query.dni || '';

  const nuevoId = req.query.nuevo;
  const editadoId = req.query.editado;


  const procesar = pacientes => {

    pacientes = pacientes.map(p => ({

      ...p,

      recienCreado:
        Number(p.id) === Number(nuevoId),

      recienEditado:
        Number(p.id) === Number(editadoId)

    }));


    pacientes.sort((a, b) => {

      if (a.recienCreado !== b.recienCreado)
        return a.recienCreado ? -1 : 1;

      if (a.recienEditado !== b.recienEditado)
        return a.recienEditado ? -1 : 1;

      return 0;

    });


    res.render('pacientes', {

      pacientes,
      dni,

      path: req.path

    });

  };


  if (dni) {

    Paciente.buscarPorDni(dni, (err, pacientes) => {

      if (err)
        return res.status(500).send('Error');

      procesar(pacientes);

    });

  }
  else {

    Paciente.obtenerTodos((err, pacientes) => {

      if (err)
        return res.status(500).send('Error');

      procesar(pacientes);

    });

  }

};

// Crear un nuevo paciente
exports.crearPaciente = (req, res) => {
  const pacienteData = req.body;

  Paciente.crear(pacienteData, (err, result) => {

    if (err)
      return res.status(500).send('Error');

    const pacienteId = result.insertId;

    res.redirect(`/pacientes?nuevo=${pacienteId}`);

  });
};

// Mostrar un paciente específico
exports.mostrarPaciente = (req, res) => {
  const pacienteId = req.params.id;
  Paciente.obtenerPorId(pacienteId, (err, paciente) => {
    if (err || !paciente) {
      return res.status(404).send('Paciente no encontrado.');
    }
    res.render('detallePaciente', { paciente });
  });
};

// 🔹 MOSTRAR FORMULARIO EDITAR
exports.mostrarEditarPaciente = (req, res) => {
  const pacienteId = req.params.id;

  Paciente.obtenerPorId(pacienteId, (err, paciente) => {
    if (err || !paciente) {
      return res.status(404).send('Paciente no encontrado.');
    }
    res.render('editarPaciente', { paciente });
  });
};

// 🔹 GUARDAR CAMBIOS
exports.editarPaciente = (req, res) => {
  const pacienteId = req.params.id;
  const pacienteData = req.body;

  Paciente.editar(pacienteId, pacienteData, (err) => {
    if (err) {
      return res.status(500).send('Error al editar paciente.');
    }
    res.redirect(`/pacientes?editado=${pacienteId}`);
  });
};
