function generarTurnos(horaInicio, horaFin, duracion) {
  const turnos = [];

  const toMin = (hora) => {
    const [h, m, s] = hora.split(':').map(Number);
    return h * 60 + m + (s ? s / 60 : 0);
  };

  let actual = toMin(horaInicio);
  const fin = toMin(horaFin);

  while (actual + duracion <= fin) {

    // ❌ BLOQUEAR 13:00 → 16:00
    if (actual >= 780 && actual < 960) {
      actual += duracion;
      continue;
    }

    console.log("MINUTOS INICIO:", actual);
    console.log("MINUTOS FIN:", fin);
    console.log("DURACION:", duracion);
    const horas = Math.floor(actual / 60).toString().padStart(2, '0');
    const minutos = Math.floor(actual % 60).toString().padStart(2, '0');

    turnos.push(`${horas}:${minutos}`);
    actual += duracion;
  }

  return turnos;
}

module.exports = generarTurnos;