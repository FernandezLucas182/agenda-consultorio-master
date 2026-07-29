function formatearFecha(fecha) {

  const f = new Date(fecha);

  const dia = String(f.getDate()).padStart(2, '0');
  const mes = String(f.getMonth() + 1).padStart(2, '0');
  const anio = f.getFullYear();

  return `${dia}/${mes}/${anio}`;
}



function formatearFechaLarga(fecha) {

  if (!fecha) return '';

  const f = new Date(fecha);

  if (isNaN(f)) return '';


  const dias = [
    'domingo',
    'lunes',
    'martes',
    'miércoles',
    'jueves',
    'viernes',
    'sábado'
  ];


  const meses = [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre'
  ];


  return `${dias[f.getDay()]} ${f.getDate()} de ${meses[f.getMonth()]}`;

}



module.exports = {
  formatearFecha,
  formatearFechaLarga
};