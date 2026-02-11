function generarTurnos(horaInicio, horaFin, duracion) {
  const turnos = [];

  let [h, m] = horaInicio.split(':').map(Number);
  let actual = h * 60 + m;

  const [hf, mf] = horaFin.split(':').map(Number);
  const fin = hf * 60 + mf;

  while (actual + duracion <= fin) {
    const horas = Math.floor(actual / 60).toString().padStart(2, '0');
    const minutos = (actual % 60).toString().padStart(2, '0');

    turnos.push(`${horas}:${minutos}`);
    actual += duracion;
  }

  return turnos;
}

module.exports = generarTurnos;
