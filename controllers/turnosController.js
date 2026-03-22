const Turno = require('../models/Turno');
const Agenda = require('../models/Agenda');
const generarTurnos = require('../utils/generarTurnos');
const Ausencia = require('../models/Ausencia');

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
    if (err) {
  console.error("ERROR REAL:", err);
  return res.status(500).send(err.message);
}

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
    especialidad_id,
    profesional_id,
    sucursal_id,
    fecha,
    hora,
    tipo_turno
  } = req.body;

  // 1️⃣ Validar ausencia primero
  Ausencia.existeAusenciaEnFecha(profesional_id, fecha, (err, hayAusencia) => {

    if (err) {
      return res.status(500).send("Error validando ausencia");
    }

    if (hayAusencia) {
      return recargarFormularioConError(res, "El profesional no atiende en esa fecha (ausencia registrada).");
    }

    // 2️⃣ Si es turno normal, validar que no esté ocupado
    if (tipo_turno === "normal") {

      Turno.existeTurnoEnHorario(profesional_id, fecha, hora, (err2, existe) => {

        if (err2) return res.status(500).send("Error validando turno");

        if (existe) {
          return recargarFormularioConError(res, "Ese horario ya está ocupado.");
        }

        Turno.obtenerAgendaId(profesional_id, (errAgenda, agenda_id) => {

          if (errAgenda) {
            return res.status(500).send("Error obteniendo agenda");
          }

          if (!agenda_id) {
            return res.status(400).send("El profesional no tiene agenda activa");
          }

          console.log("AGENDA ID:", agenda_id);

          insertarTurno(agenda_id);

        });

      });

    }

    // 3️⃣ Si es sobreturno, validar límite (máx 2 por día)
    else {

      Turno.contarSobreturnos(profesional_id, fecha, (err3, cantidad) => {

        if (err3) return res.status(500).send("Error validando sobreturnos");

        if (cantidad >= 2) {
          return recargarFormularioConError(res, "Solo se permiten 2 sobreturnos por día.");
        }

        Turno.obtenerAgendaId(profesional_id, (errAgenda, agenda_id) => {

          if (errAgenda) {
            return res.status(500).send("Error obteniendo agenda");
          }

          if (!agenda_id) {
            return res.status(400).send("El profesional no tiene agenda activa");
          }

          console.log("AGENDA ID:", agenda_id);

          insertarTurno(agenda_id);

        });

      });

    }

  });

  


  // Función interna para insertar
  function insertarTurno(agenda_id) {

    Turno.crear(
      {
        paciente_id,
        especialidad_id,
        profesional_id,
        sucursal_id,
        fecha,
        hora,
        tipo_turno,
        agenda_id
      },
      (err) => {

        if (err) {
  console.error("ERROR AL CREAR TURNO:", err);

  // 🔴 ERROR DE DUPLICADO (MySQL)
  if (err.code === 'ER_DUP_ENTRY') {
            return recargarFormularioConError(
              res,
              "Ese horario ya fue tomado por otro turno."
            );
          }

          return res.status(500).send("Error creando turno");
        }
        return res.redirect('/turnos');
      }
    );

  }

};

// ==========================
// HORARIOS DISPONIBLES
// ==========================

exports.obtenerHorariosDisponibles = (req, res) => {

  const { profesionalId, fecha } = req.params;

  console.log("PARAMS:", profesionalId, fecha);

  // 🔥 PRIMERA VALIDACIÓN: AUSENCIA
  Ausencia.existeAusenciaEnFecha(profesionalId, fecha, (err, hayAusencia) => {

    if (err) {
      console.error("ERROR EN AUSENCIA:", err);
      return res.status(500).json({ motivo: 'error_ausencia' });
    }

    if (hayAusencia) {
      return res.json({ motivo: 'ausente' });
    }

    // ================================
    // SI NO HAY AUSENCIA → sigue flujo normal
    // ================================

    let fechaObj;

    if (fecha.includes('-')) {
      const [y, m, d] = fecha.split('-');
      fechaObj = new Date(y, m - 1, d);
    } else if (fecha.includes('/')) {
      const [d, m, y] = fecha.split('/');
      fechaObj = new Date(y, m - 1, d);
    } else {
      return res.status(400).json({ motivo: 'formato_fecha_invalido' });
    }

    let diaJS = fechaObj.getDay();
    let diaBD = diaJS === 0 ? 7 : diaJS;

    Agenda.obtenerHorariosProfesional(profesionalId, diaBD, (err, bloques) => {

      if (err) {
        console.error("ERROR EN AGENDA:", err);
        return res.status(500).json({ motivo: 'error_agenda' });
      }

      if (!bloques || !bloques.length) {
        return res.json({ motivo: 'sin_agenda' });
      }

      const fechaSQL = fecha.split('T')[0];

      Turno.obtenerHorariosOcupados(profesionalId, fechaSQL, (err2, ocupados) => {

        if (err2) {
          console.error("ERROR EN TURNOS:", err2);
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
    Turno.confirmar(turno.id, (err) => {
      if (err) return res.status(500).send('Error confirmando turno');
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

  Turno.actualizar(req.params.id, req.body, (err) => {
    if (err) return res.status(500).send('Error actualizando turno');
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