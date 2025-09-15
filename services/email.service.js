const nodemailer = require('nodemailer');
require('dotenv').config();


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/**
 * Envía un correo electrónico con las opciones proporcionadas
 * @param {Object} opciones - { from, to, subject, text, html }
 * @returns {Object|null} - Información del envío o null si falla
 */
async function enviarCorreo(opciones) {
  try {
    const info = await transporter.sendMail(opciones);
    console.log('Correo enviado con exito:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error al enviar correo:', error.message);
    return null;
  }
}

module.exports = { enviarCorreo };
