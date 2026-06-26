const Turno = require('../models/Turno');
const Agenda = require('../models/Agenda');
const generarTurnos = require('../utils/generarTurnos');
const Ausencia = require('../models/Ausencia');

// ==========================
// UTILIDADES
// ==========================

function sumarSegundos(hora, segundos) {
  const [h, m, s] = hora.split(':').map(Number);
  const date = new Date();
  date.setHours(h, m, s || 0);
  date.setSeconds(date.getSeconds() + segundos);
  return date.toTimeString().slice(0, 8);
}

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

  const q = req.query.q?.toLowerCase() || "";
  const nuevoId = req.query.nuevo;
  const editadoId = req.query.editado;

  Turno.obtenerTodos((err, turnos) => {
    if (err) {
      console.error("ERROR REAL:", err);
      return res.status(500).send(err.message);
    }

    if (q) {
      turnos = turnos.filter(t => {
        return (
          (t.paciente_nombre || "").toLowerCase().includes(q) ||
          (t.profesional_nombre || "").toLowerCase().includes(q) ||
          (t.especialidad_nombre || "").toLowerCase().includes(q) ||
          (t.fecha || "").toString().toLowerCase().includes(q) ||
          (t.hora || "").toString().toLowerCase().includes(q)
        );
      });
    }

    turnos = turnos.map(t => ({

      ...t,

      fecha: formatearFecha(t.fecha),
      recienCreado:
        Number(t.id) === Number(nuevoId),

      recienEditado:
        Number(t.id) === Number(editadoId)
    }));

    turnos.sort((a, b) => {

      if (a.recienCreado !== b.recienCreado)
        return a.recienCreado ? -1 : 1;

      if (a.recienEditado !== b.recienEditado)
        return a.recienEditado ? -1 : 1;

      return 0;

    });

    res.render('turnos', {
      turnos,
      q,
      nuevoTurnoId: req.query.nuevo,
      turnoEditadoId: req.query.editado,
      path: req.path
    });
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

  const pacienteId = req.query.paciente_id;

  Turno.obtenerEspecialidades((e1, especialidades) => {

    Turno.obtenerPacientes((e2, pacientes) => {

      Turno.obtenerTodosProfesionales((e3, profesionales) => {

        if (e1 || e2 || e3) {
          return res.status(500).send('Error cargando formulario');
        }

        let pacienteSeleccionado = null;

        if (pacienteId) {
          pacienteSeleccionado =
            pacientes.find(p => p.id == pacienteId);
        }

        res.render('nuevoTurno', {
          especialidades,
          pacientes,
          profesionales,
          pacienteSeleccionado
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
    fecha,
    hora,
    tipo_turno
  } = req.body;

  if (!paciente_id ||
    !especialidad_id ||
    !profesional_id ||
    !fecha ||
    !hora) {

    req.flash('error', 'Debe completar todos los campos');
    return res.redirect('/turnos/nuevo');
  }

  Ausencia.existeAusenciaEnFecha(profesional_id, fecha, (err, hayAusencia) => {

    if (err) return res.status(500).send("Error validando ausencia");

    if (hayAusencia) {
      return res.status(400).send("El profesional no atiende en esa fecha.");
    }

    const esNormal = tipo_turno === "normal";

    const validarYCrear = (horaFinal) => {

      Turno.obtenerAgendaPorProfesionalYEspecialidad(profesional_id, especialidad_id, (errAgenda, agenda) => {

        if (errAgenda) return res.status(500).send("Error obteniendo agenda");
        if (!agenda) return res.status(400).send("Sin agenda");

        console.log("VALIDANDO EN AGENDA:", {
          profesional_id,
          fecha,
          horaFinal
        });

        Turno.validarHoraEnAgenda(
          profesional_id,
          fecha,
          horaFinal,
          (errHora, valida) => {

            if (errHora) return res.status(500).send("Error horario");

            if (!valida) {
              console.log("❌ FUERA DE AGENDA:", {
                profesional_id,
                fecha,
                horaFinal
              });
              return res.status(400).send("Horario fuera de agenda");
            }

            const agenda_id = agenda.id;

            Turno.obtenerSucursalPorAgenda(agenda_id, (errSuc, sucursal_id) => {

              if (errSuc) return res.status(500).send("Error sucursal");

              console.log("✅ CREANDO TURNO:", {
                profesional_id,
                fecha,
                horaFinal
              });

              const data = {
                paciente_id,
                especialidad_id,
                profesional_id,
                sucursal_id,
                fecha,
                hora: horaFinal,
                tipo_turno,
                agenda_id
              };

              console.log("DATA CREAR TURNO:", data);

              Turno.crear(data, (err, result) => {

                if (err) {
                  if (err.code === 'ER_DUP_ENTRY') {
                    req.flash('error', 'Horario ocupado');
                    return res.status(400).redirect('/turnos');
                  }

                  req.flash('error', 'Error creando turno');
                  return res.status(500).redirect('/turnos');
                }

                req.flash('success', 'Turno creado exitosamente');

                res.redirect(`/turnos?nuevo=${result.insertId}`);
                console.log("NUEVO ID:", result.insertId);


              });

            });

          }
        );

      });

    };


    const horaNormalizada = hora?.length === 5 ? hora : (hora ? hora.slice(0, 5) : null);


    if (esNormal) {

      console.log("CHECK TURNO EXISTENTE:", {
        profesional_id,
        fecha,
        horaNormalizada
      });
      Turno.existeTurnoEnHorario(profesional_id, fecha, horaNormalizada, (err2, existe) => {

        if (err2) {
          return res.status(500).send("Error validando");
        }

        if (existe) {
          return res.status(400).send("Horario ocupado");
        }

        validarYCrear(horaNormalizada);

      });

    } else {

      Turno.contarSobreturnosEnHora(profesional_id, fecha, horaNormalizada, (err3, cantidad) => {

        if (err3) return res.status(500).send("Error sobreturnos");

        if (cantidad >= 2) {
          return res.status(400).send("Máximo sobreturnos");
        }

        const nuevaHora = sumarSegundos(horaNormalizada, cantidad + 1);

        console.log("HORA NORMALIZADA:", horaNormalizada);
        console.log("HORA RECIBIDA:", hora);
        console.log("FECHA RECIBIDA:", fecha);
        console.log("PROFESIONAL:", profesional_id);

        validarYCrear(nuevaHora);

      });

    }

  });

};

// ==========================
// HORARIOS DISPONIBLES
// ==========================

exports.obtenerHorariosDisponibles = (req, res) => {

  const { profesionalId, fecha } = req.params;
  const tipo = req.query.tipo;

  const turnoIdExcluir = req.query.turnoId || 0;
  Ausencia.existeAusenciaEnFecha(profesionalId, fecha, (err, hayAusencia) => {

    if (err) return res.status(500).json({ motivo: 'error_ausencia' });

    if (hayAusencia) {
      return res.json({ motivo: 'ausente' });
    }

    let fechaObj;

    if (fecha.includes('-')) {
      const [y, m, d] = fecha.split('-');
      fechaObj = new Date(y, m - 1, d);
    } else {
      return res.status(400).json({ motivo: 'fecha_invalida' });
    }

    const diaBD = fechaObj.getDay() === 0 ? 7 : fechaObj.getDay();

    Turno.obtenerAgendaPorProfesionalYEspecialidad(
      profesionalId,
      req.query.especialidadId,
      (errAgenda, agenda) => {

        if (errAgenda) {
          return res.json({ motivo: 'sin_agenda' });
        }

        if (!agenda) {
          return res.json({ motivo: 'sin_agenda' });
        }

        const agenda_id = agenda.id;

        Agenda.obtenerHorariosProfesional(
          agenda_id,
          diaBD,
          (err, bloques) => {

            if (err)
              return res.status(500).json({ motivo: 'error_agenda' });

            if (!bloques.length) {
              return res.json({ motivo: 'no_trabaja' });
            }

            // el resto queda igual

            Turno.obtenerHorariosOcupados(profesionalId, fecha, turnoIdExcluir, (err2, ocupados) => {

              if (err2) return res.status(500).json({ motivo: 'error_turnos' });

              let posibles = [];
              console.log("BLOQUES AGENDA:", bloques);
              bloques.forEach(b => {
                posibles.push(...generarTurnos(
                  b.hora_inicio,
                  b.hora_fin,
                  b.duracion_turno
                ));
              });

              const horarios = posibles.map(hora => {

                const estaOcupado = ocupados.includes(hora);

                // 🔵 Si eligió sobreturno
                if (tipo === 'sobreturno' && estaOcupado) {

                  return {
                    hora,
                    estado: 'sobreturno',
                    usados: 1,
                    max: 2
                  };
                }

                // 🔴 Normal ocupado
                if (estaOcupado) {

                  return {
                    hora,
                    estado: 'ocupado'
                  };
                }

                // 🟢 Libre
                return {
                  hora,
                  estado: 'libre'
                };

              });

              res.json({ horarios });



            });

          });

      });

  });

};


//============================
// OCUPACION MENSUAL
//============================
exports.obtenerOcupacionMensual = (req, res) => {

  const profesionalId = req.params.profesionalId;

  const { desde, hasta } = req.query;

  Turno.obtenerOcupacionMensual(
    profesionalId,
    desde,
    hasta,
    (err, rows) => {

      if (err) {
        console.error(err);

        return res.status(500).json({
          error: 'Error ocupacion'
        });
      }

      res.json(rows);

    }
  );

};

// ==========================
// OTROS
// ==========================

exports.confirmarTurno = (req, res) => {

  const token = req.params.token;

  Turno.buscarPorToken(token, (err, turno) => {

    if (err || !turno) return res.send('Token inválido');

    Turno.confirmar(turno.id, (err) => {
      if (err) return res.status(500).send('Error');
      res.send('Turno confirmado');
    });

  });

};

exports.editarTurno = (req, res) => {


  const turnoId = req.params.id;


  const profesional_id = req.body.profesional_id;
  const especialidad_id = req.body.especialidad_id;



  Turno.obtenerAgendaPorProfesionalYEspecialidad(

    profesional_id,

    especialidad_id,

    (err, agenda) => {


      if (err || !agenda) {
        console.log("AGENDA ENCONTRADA:");
        console.log(agenda);

        req.flash("error", "No existe agenda");

        return res.redirect("/turnos");

      }


      console.log("AGENDA ENCONTRADA:");
      console.log(agenda);

      req.body.agenda_id = agenda.id;
      req.body.sucursal_id = agenda.sucursal_id;


      console.log("BODY FINAL:");
      console.log(req.body);
      Turno.actualizar(

        turnoId,

        req.body,

        (err) => {


          if (err) {

            console.log(err);

            req.flash("error", "Error");

            return res.redirect("/turnos");

          }


          res.redirect(`/turnos?editado=${turnoId}`);


        }

      );


    }

  );


}

exports.eliminarTurno = (req, res) => {

  Turno.eliminar(req.params.id, (err) => {

    if (err) {
      req.flash('error', 'Error al eliminar el turno');
      return res.redirect('/turnos');
    }

    req.flash('success', 'Turno eliminado correctamente');
    res.redirect('/turnos');

  });

};



//==================================
//mostrarReprogramaciones
//==================================
exports.mostrarReprogramaciones = (req, res) => {

  Turno.obtenerTurnosParaReprogramar((err, turnos) => {

    if (err) {
      console.error(err);
      return res.sendStatus(500);
    }

    res.render('reprogramacionTurno', {
      turnos: turnos || [],
      path: req.path
    });

  });

};



// ==========================
// AJAX
// ==========================

exports.obtenerEspecialidadesPorProfesional = (req, res) => {

  console.log(
    "PROFESIONAL RECIBIDO:",
    req.params.profesionalId
  );


  Turno.obtenerEspecialidadesPorProfesional(
    req.params.profesionalId,
    (err, rows) => {

      console.log(
        "ESPECIALIDADES ENCONTRADAS:",
        rows
      );


      if (err) return res.status(500).json([]);
      res.json(rows || []);

    }
  );

};

exports.obtenerProfesionalesPorEspecialidad = (req, res) => {

  console.log(
    "ESPECIALIDAD RECIBIDA:",
    req.params.especialidadId
  );


  Turno.obtenerProfesionalesPorEspecialidad(
    req.params.especialidadId,
    (err, rows) => {

      console.log(
        "PROFESIONALES ENCONTRADOS:",
        rows
      );

      if (err) return res.status(500).json([]);
      res.json(rows || []);

    }
  );

};


exports.obtenerTodosProfesionales = (req, res) => {

  console.log("ENTRE A /profesionales/todos");

  Turno.obtenerTodosProfesionales((err, rows) => {

    if (err) {
      console.error(err);
      return res.status(500).json([]);
    }
    console.log("ROWS:", rows);
    res.json(rows || []);

  });

};

exports.obtenerSucursalAgenda = (req, res) => {

  const { profesionalId, especialidadId } = req.params;

  Turno.obtenerSucursalAgenda(

    profesionalId,
    especialidadId,

    (err, agenda) => {

      if (err) {
        console.log("ERROR:", err);
        return res.status(500).json({});
      }

      console.log("AGENDA DEVUELTA:");
      console.log(agenda);

      res.json(agenda || {});

    }

  );

};

exports.mostrarFormularioEditarTurno = (req, res) => {

  Turno.obtenerPorId(req.params.id, (err, turno) => {

    if (err || !turno) {
      return res.status(404).send('No encontrado');
    }

    Turno.obtenerPacientes((e1, pacientes) => {

      Turno.obtenerEspecialidades((e2, especialidades) => {

        Turno.obtenerProfesionalesPorEspecialidad(
          turno.especialidad_id,
          (e3, profesionales) => {

            if (e1 || e2 || e3) {
              return res.status(500).send('Error cargando formulario');
            }

            turno.fecha_formateada =
              new Date(turno.fecha).toISOString().split('T')[0];

            turno.hora = turno.hora
              ? turno.hora.slice(0, 5)
              : '';

            res.render('editarTurno', {
              turno,
              pacientes,
              especialidades,
              profesionales
            });

          }
        );

      });

    });

  });

};

//============================
// DISPONIBILIDAD CALENDARIO
//============================
exports.obtenerDisponibilidadCalendario = (req, res) => {

  const profesionalId = req.params.profesionalId;

  Turno.obtenerDisponibilidadCalendario(
    profesionalId,
    (err, data) => {

      if (err) {
        console.error(err);
        return res.status(500).json({
          error: 'Error obteniendo disponibilidad'
        });
      }

      res.json(data);

    }
  );

};