const { body, validationResult } = require('express-validator');

// Middleware para validar los datos del nuevo turno
const validateTurno = [
  body('paciente_id').notEmpty().withMessage('El ID del paciente es obligatorio.'),
  body('profesional_id').notEmpty().withMessage('El ID del profesional es obligatorio.'),
  body('especialidad_id').notEmpty().withMessage('El ID de la especialidad es obligatorio.'),
  body('fecha')
    .notEmpty().withMessage('La fecha es obligatoria.')
    .isISO8601().toDate().withMessage('La fecha debe ser válida.'),
  body('hora')
    .notEmpty().withMessage('La hora es obligatoria.')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('La hora debe estar en formato HH:mm.'),
];

// Middleware para validar los datos del turno (edición)
const validateEditTurno = [
  body('estado')
    .notEmpty().withMessage('El estado es obligatorio.')
    .isIn(['Libre', 'Reservada', 'Confirmado', 'Cancelado', 'Ausente', 'Presente', 'En consulta', 'Atendido'])
    .withMessage('El estado debe ser uno de los siguientes: Libre, Reservada, Confirmado, Cancelado, Ausente, Presente, En consulta, Atendido.'),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  validateTurno,
  validateEditTurno,
  handleValidationErrors,
};
