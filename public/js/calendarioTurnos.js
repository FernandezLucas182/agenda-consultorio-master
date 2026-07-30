document.addEventListener("DOMContentLoaded", () => {

    const calendarEl = document.getElementById("calendar");

    if (!calendarEl) return;


    const paramsURL = new URLSearchParams(window.location.search);

    let fechaSeleccionada = paramsURL.get("fecha") || "";


    const calendar = new FullCalendar.Calendar(calendarEl, {


        locale: "es",

        initialView: fechaSeleccionada
            ? "timeGridDay"
            : "dayGridMonth",

        initialDate:
            document.querySelector('input[name="fecha"]')?.value
            || new Date(),


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


        dateClick: function (info) {

            console.log("CLICK FECHA:", info.dateStr);

            const params =
                new URLSearchParams(window.location.search);

            const q =
                params.get("q") || "";


            window.location.href =
                `/turnos?fecha=${info.dateStr}&q=${encodeURIComponent(q)}`;

        },


        dayCellClassNames: function (arg) {

            if (!fechaSeleccionada) return [];

            const fechaCelda =
                arg.date.toISOString().substring(0, 10);


            if (fechaCelda === fechaSeleccionada) {

                return [
                    "dia-filtro-activo"
                ];

            }

            return [];

        },


        dayHeaderClassNames: function (arg) {

            if (!fechaSeleccionada) return [];


            const fechaHeader =
                arg.date.toISOString().substring(0, 10);


            if (fechaHeader === fechaSeleccionada) {

                return [
                    "header-dia-filtro"
                ];

            }

            return [];

        },


        events: function (info, successCallback, failureCallback) {


            const params =
                new URLSearchParams(window.location.search);


            const q =
                params.get("q") || "";


            const fecha =
                params.get("fecha") || "";


            console.log("======================");
            console.log("CALENDARIO REQUEST");
            console.log("START:", info.startStr);
            console.log("END:", info.endStr);
            console.log("q:", q);
            console.log("fecha:", fecha);
            console.log("======================");



            let url =
                `/turnos/eventos?q=${encodeURIComponent(q)}` +
                `&start=${info.startStr}` +
                `&end=${info.endStr}`;


            if (fecha) {

                url +=
                    `&fecha=${encodeURIComponent(fecha)}`;

            }



            fetch(url)

                .then(response => response.json())

                .then(data => {


                    console.log(
                        "EVENTOS RECIBIDOS:",
                        data.length
                    );


                    successCallback(data);


                })


                .catch(error => {

                    console.error(
                        "ERROR CALENDARIO:",
                        error
                    );

                    failureCallback(error);

                });


        },



        eventContent: function (arg) {

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
                        👤 ${arg.event.title.split("\n")[1]?.replace("👤 ", "") || ""}
                    </div>


                    <div class="fc-turno-profesional">
                        🩺 ${arg.event.extendedProps.profesional}
                    </div>

                </div>

                `

            };

        },



        eventDidMount: function (info) {


            info.el.title =

                `
Paciente: ${info.event.title}

Profesional:
${info.event.extendedProps.profesional}

Especialidad:
${info.event.extendedProps.especialidad}

Sucursal:
${info.event.extendedProps.sucursal}

Hora:
${info.event.extendedProps.hora}

Estado:
${info.event.extendedProps.estado}
            `;


        },



        eventClick: function (info) {


            console.log("CLICK EVENTO", info.event.id);


            if (
                info.event.extendedProps.estado === "reprogramar"
            ) {

                window.location.href =
                    "/turnos/reprogramaciones";


            } else {


                window.location.href =
                    `/turnos/${info.event.id}/editar`;

            }


        }


    });



    calendar.render();




    const filtroFecha =
        document.querySelector('input[name="fecha"]');



    if (filtroFecha) {


        filtroFecha.addEventListener(
            "change",
            () => {


                fechaSeleccionada =
                    filtroFecha.value;


                calendar.gotoDate(
                    fechaSeleccionada
                );


                calendar.refetchEvents();


            }
        );


    }


});