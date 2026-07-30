document.addEventListener("DOMContentLoaded", () => {

    const calendarEl = document.getElementById("calendar");

    let fechaSeleccionada = null;

    let todosLosEventos = [];

    function normalizarTexto(texto = "") {
        return texto
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim();
    }

    if (!calendarEl) return;

    // 🔴 1. Leemos los parámetros de la URL aquí arriba una sola vez:
    const params = new URLSearchParams(window.location.search);
    const vistaParam = params.get("vista") || "dayGridMonth";

    const calendar = new FullCalendar.Calendar(calendarEl, {

        locale: "es",

        selectable: true,

        dateClick: function (info) {
            // Usamos un nombre distinto (urlParams) para evitar que choque con 'params'
            const urlParams = new URLSearchParams(window.location.search);
            urlParams.set("fecha", info.dateStr);
            urlParams.set("vista", "timeGridDay"); // 👈 Guardamos que queremos ver el día

            window.location.href = window.location.pathname + "?" + urlParams.toString();
        },



        initialView: vistaParam,

        allDayText: 'Hs',

        height: 700,

        slotMinTime: "08:00:00",
        slotMaxTime: "22:30:00",

        slotEventOverlap: false,

        headerToolbar: {
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay"
        },

        buttonText: {
            today: "Hoy",
            month: "Mes",
            week: "Semana",
            day: "Día"
        },

        navLinks: false,

        nowIndicator: true,

        editable: false,

        selectable: true,

        dayMaxEvents: true,



        dayCellClassNames: function (arg) {

            // Reutilizamos la constante 'params' ya declarada arriba
            const fechaFiltro = fechaSeleccionada || params.get("fecha");

            if (!fechaFiltro) return [];

            const fechaCelda = arg.date.toISOString().substring(0, 10);

            if (fechaCelda === fechaFiltro) {
                return ['dia-filtro-activo'];
            }

            return [];

        },

        dayHeaderClassNames: function (arg) {

            // Reutilizamos la constante 'params' ya declarada arriba
            const fechaFiltro = fechaSeleccionada || params.get("fecha");

            if (!fechaFiltro) return [];

            const fechaHeader = arg.date.toISOString().substring(0, 10);

            if (fechaHeader === fechaFiltro) {
                return ['header-dia-filtro'];
            }

            return [];

        },





        events: function (info, successCallback, failureCallback) {

            // Reutilizamos la constante 'params' ya declarada arriba
            const fecha =
                params.get("fecha") || "";

            const especialidad =
                params.get("especialidad") || "";


            console.log("======================");
            console.log("CALENDARIO MIS TURNOS");
            console.log("URL:", window.location.search);
            console.log("FECHA:", fecha);
            console.log("ESPECIALIDAD:", especialidad);
            console.log("======================");


            fetch(
                `/mis-turnos/eventos?start=${info.startStr}&end=${info.endStr}&especialidad=${especialidad}&fecha=${fecha}`
            )
                .then(response => response.json())
                .then(data => {

                    todosLosEventos = data;

                    const buscador = document.querySelector('input[name="q"]');


                    const texto =
                        normalizarTexto(
                            params.get("q") || buscador?.value || ""
                        );

                    if (!texto) {
                        successCallback(data);
                        return;
                    }

                    const filtrados = data.filter(evento => {

                        const contenido = normalizarTexto(
                            [
                                evento.title,
                                evento.extendedProps.profesional,
                                evento.extendedProps.especialidad,
                                evento.extendedProps.estado,
                                evento.extendedProps.sucursal
                            ].join(" ")
                        );

                        return contenido.includes(texto);

                    });

                    successCallback(filtrados);

                })
                .catch(error => {

                    console.error(error);
                    failureCallback(error);

                });

        },

        eventContent: function (arg) {

            const paciente =
                arg.event.title.split("\n")[1]
                    ?.replace("👤 ", "")
                || "";

            // 🎨 Mapeo de colores por estado
            const colores = {
                confirmado: '#198754', // Verde
                pendiente: '#ffc107',  // Amarillo
                reservado: '#0d6efd',  // Azul
                cancelado: '#dc3545',  // Rojo
                completado: '#6c757d', // Gris
                reprogramar: '#fd7e14' // Naranja
            };

            const estado = (arg.event.extendedProps.estado || '').toLowerCase();
            const color = colores[estado] || '#0d6efd';

            return {
                html: `
    <div class="fc-turno" style="--bg-estado: ${color};">

        <div class="fc-turno-hora">
            🕘 ${arg.event.extendedProps.hora}
        </div>

        <div class="fc-turno-paciente">
            👤 ${paciente}
        </div>

    </div>
`
            };

        },

        eventDidMount: function (info) {

            info.el.title =
                `Paciente: ${info.event.title}
                Profesional: ${info.event.extendedProps.profesional}
                Especialidad: ${info.event.extendedProps.especialidad}
                Sucursal: ${info.event.extendedProps.sucursal}
                Hora: ${info.event.extendedProps.hora}
                Estado: ${info.event.extendedProps.estado}`;

        },

        eventClick: function (info) {

            window.location.href = `/turnos/${info.event.id}`;

        }

    });
    calendar.render();

    // ================================
    // MARCAR FECHA DEL FILTRO
    // ================================

    // 🔴 2. Quitamos la redeclaración 'const params = ...' que rompía el JS
    const fechaFiltro = params.get("fecha");

    if (fechaFiltro) {

        fechaSeleccionada = fechaFiltro;

        calendar.gotoDate(fechaFiltro);

    }


    // =============================
    // SINCRONIZAR FILTRO DE FECHA
    // =============================

    const filtroFecha = document.querySelector('input[name="fecha"]');

    if (filtroFecha) {

        filtroFecha.addEventListener("change", () => {

            if (filtroFecha.value) {

                fechaSeleccionada = filtroFecha.value;

                calendar.gotoDate(fechaSeleccionada);

                calendar.render();

                calendar.refetchEvents();

            }

        });

    }


    const buscador = document.querySelector('input[name="q"]');

    if (buscador) {

        buscador.addEventListener("input", () => {

            const texto = normalizarTexto(buscador.value);

            calendar.removeAllEvents();

            const filtrados = !texto
                ? todosLosEventos
                : todosLosEventos.filter(evento => {

                    const contenido = normalizarTexto(
                        [
                            evento.title,
                            evento.extendedProps.profesional,
                            evento.extendedProps.especialidad,
                            evento.extendedProps.estado,
                            evento.extendedProps.sucursal
                        ].join(" ")
                    );

                    return contenido.includes(texto);

                });

            calendar.addEventSource(filtrados);

        });

    }

});