const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // podés cambiarlo luego
  auth: {
    user: 'TU_EMAIL@gmail.com',
    pass: 'TU_PASSWORD_DE_APP'
  }
});

function enviarMailConfirmacion(destinatario, enlace) {

  const mailOptions = {
    from: 'TU_EMAIL@gmail.com',
    to: destinatario,
    subject: 'Confirmación de turno',
    html: `
      <h2>Su turno fue reprogramado</h2>
      <p>Por favor confirme el turno haciendo clic en el siguiente enlace:</p>
      <a href="${enlace}">Confirmar Turno</a>
    `
  };

  return transporter.sendMail(mailOptions);
}

module.exports = { enviarMailConfirmacion };