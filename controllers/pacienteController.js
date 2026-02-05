const Paciente = require('../models/Paciente');

// Mostrar todos los pacientes
exports.mostrarPacientes = (req, res) => {
  Paciente.obtenerTodos((err, pacientes) => {
    if (err) {
      return res.status(500).send('Error al obtener pacientes.');
    }
    res.render('pacientes', { pacientes });
  });
};

// Crear un nuevo paciente
exports.crearPaciente = (req, res) => {
  const pacienteData = req.body;
  Paciente.crear(pacienteData, (err) => {
    if (err) {
      return res.status(500).send('Error al crear paciente.');
    }
    res.redirect('/pacientes'); // Redirige a la lista de pacientes
  });
};

// Mostrar un paciente específico
exports.mostrarPaciente = (req, res) => {
  const pacienteId = req.params.id;
  Paciente.obtenerPorId(pacienteId, (err, paciente) => {
    if (err || !paciente) {
      return res.status(404).send('Paciente no encontrado.');
    }
    res.render('paciente', { paciente });
  });
};

// Editar un paciente
exports.editarPaciente = (req, res) => {
  const pacienteId = req.params.id;
  const pacienteData = req.body;
  Paciente.editar(pacienteId, pacienteData, (err) => {
    if (err) {
      return res.status(500).send('Error al editar paciente.');
    }
    res.redirect('/pacientes');
  });
};
