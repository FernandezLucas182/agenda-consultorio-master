const Turno = require('../models/Turno');
const Agenda = require('../models/Agenda');
const generarTurnos = require('../utils/generarTurnos');

// ==========================
// UTILIDAD FECHA
// ==========================

function formatearFecha(fecha) {
  return new Date(fecha).toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });
}

// ==========================
// TURNOS CRUD
// ==========================

exports.mostrarTurnos = (req, res) => {

  Turno.obtenerTodos((err, turnos) => {
    if (err) return res.status(500).send('Error al obtener turnos');

    turnos = turnos.map(t => ({
      ...t,
      fecha: formatearFecha(t.fecha)
    }));

    res.render('turnos', { turnos });
  });

};

exports.mostrarTurno = (req, res) => {

  Turno.obtenerPorId(req.params.id, (err, turno) => {

    if (err || !turno) {
      return res.status(404).send('No encontrado');
    }

    turno.fecha = formatearFecha(turno.fecha);

    res.render('turno', { turno });
  });

};

exports.mostrarFormularioNuevoTurno = (req, res) => {

  Turno.obtenerEspecialidades((e1, especialidades) => {

    Turno.obtenerPacientes((e2, pacientes) => {

      Turno.obtenerSucursales((e3, sucursales) => {

        if (e1 || e2 || e3) {
          return res.status(500).send('Error cargando formulario');
        }

        res.render('nuevoTurno', {
          especialidades: especialidades || [],
          pacientes: pacientes || [],
          sucursales: sucursales || [],
          profesionales: []
        });

      });

    });

  });

};

// ==========================
// CREAR TURNO
// ==========================

exports.crearTurno = (req, res) => {

  const {
    paciente_id,
    profesional_id,
    especialidad_id,
    sucursal_id,
    fecha,
    hora,
    tipo_turno
  } = req.body;

  if (tipo_turno === 'sobreturno') {

    Turno.contarSobreturnos(profesional_id, fecha, (err, cantidadActual) => {

      if (err) return res.status(500).send('Error validando sobreturnos');

      Turno.obtenerMaxSobreturnos(profesional_id, especialidad_id, (err2, max) => {

        if (err2) return res.status(500).send('Error consultando agenda');

        if (cantidadActual >= max) {
          return res.send('Límite de sobreturnos alcanzado');
        }

        insertar();

      });

    });

  } else {
    insertar();
  }

  function insertar() {

    Turno.crear({
      paciente_id,
      profesional_id,
      especialidad_id,
      sucursal_id,
      fecha,
      hora,
      tipo_turno
    }, () => {
      res.redirect('/turnos');
    });

  }

};

// ==========================
// HORARIOS DISPONIBLES
// ==========================

exports.obtenerHorariosDisponibles = (req, res) => {

  const { profesionalId, fecha } = req.params;

  const [y, m, d] = fecha.split('-');
  const fechaObj = new Date(y, m - 1, d);

  let diaJS = fechaObj.getDay();
  let diaBD = diaJS === 0 ? 7 : diaJS;

  Agenda.obtenerHorariosProfesional(profesionalId, diaBD, (err, bloques) => {

    if (err) {
      return res.status(500).json({ motivo: 'error_agenda' });
    }

    if (!bloques || !bloques.length) {
      return res.json({ motivo: 'sin_agenda' });
    }

    Turno.obtenerHorariosOcupados(profesionalId, fecha, (err2, ocupados) => {

      if (err2) {
        return res.status(500).json({ motivo: 'error_turnos' });
      }

      let posibles = [];

      bloques.forEach(b => {
        posibles.push(
          ...generarTurnos(
            b.hora_inicio,
            b.hora_fin,
            b.duracion_turno
          )
        );
      });

      const libres = posibles.filter(h => !ocupados.includes(h));

      res.json({
        libres,
        ocupados
      });

    });

  });

};

// ==========================
// CONFIRMAR TURNO
// ==========================

exports.confirmarTurno = (req, res) => {

  const token = req.params.token;

  Turno.buscarPorToken(token, (err, turno) => {

    if (err || !turno) {
      return res.send('Token inválido');
    }

    Turno.confirmar(turno.id, () => {
      res.send('Turno confirmado correctamente');
    });

  });

};

// ==========================
// EDITAR TURNO
// ==========================

exports.mostrarFormularioEditarTurno = (req, res) => {

  Turno.obtenerPorId(req.params.id, (err, turno) => {

    if (err || !turno) {
      return res.status(404).send('No encontrado');
    }

    Turno.obtenerPacientes((e1, pacientes) => {

      Turno.obtenerEspecialidades((e2, especialidades) => {

        Turno.obtenerSucursales((e3, sucursales) => {

          Turno.obtenerProfesionalesPorEspecialidad(
            turno.especialidad_id,
            (e4, profesionales) => {

              if (e1 || e2 || e3 || e4) {
                return res.status(500).send('Error cargando formulario');
              }

              res.render('editarTurno', {
                turno,
                pacientes: pacientes || [],
                especialidades: especialidades || [],
                profesionales: profesionales || [],
                sucursales: sucursales || []
              });

            }
          );

        });

      });

    });

  });

};

exports.editarTurno = (req, res) => {

  Turno.actualizar(req.params.id, req.body, () => {
    res.redirect('/turnos');
  });

};

exports.eliminarTurno = (req, res) => {

  Turno.eliminar(req.params.id, () => {
    res.redirect('/turnos');
  });

};

// ==========================
// AJAX
// ==========================

exports.obtenerEspecialidadesPorProfesional = (req, res) => {

  Turno.obtenerEspecialidadesPorProfesional(
    req.params.profesionalId,
    (err, rows) => {

      if (err) return res.status(500).json([]);

      res.json(rows || []);
    }
  );

};

exports.obtenerProfesionalesPorEspecialidad = (req, res) => {

  Turno.obtenerProfesionalesPorEspecialidad(
    req.params.especialidadId,
    (err, rows) => {

      if (err) return res.status(500).json([]);

      res.json(rows || []);
    }
  );

};