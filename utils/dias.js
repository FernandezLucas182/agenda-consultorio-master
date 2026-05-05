
function convertirDiaSemana(fecha) {
  const diaJS = new Date(fecha).getDay();
  return diaJS === 0 ? 7 : diaJS;
}

module.exports = { convertirDiaSemana };