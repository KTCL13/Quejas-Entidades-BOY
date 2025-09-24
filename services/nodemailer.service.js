const nodemailer = require('nodemailer');
require('dotenv').config();
const IMailService = require('../interfaces/IMailService');

class NodemailerService extends IMailService {
  #transporter; // Propiedad privada

  constructor() {
    super();

    this.#transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true para 465, false para otros puertos como 587
      auth: {
        user: process.env.EMAIL_USER, // Tu dirección de correo de Gmail
        pass: process.env.EMAIL_PASS  // Tu Contraseña de Aplicación de 16 dígitos
      }
    });
    console.log('✅ Servicio de correo con Nodemailer inicializado.');
  }

  /**
   * Envía un correo usando Nodemailer, cumpliendo con la interfaz IMailService.
   * @override
   * @param {import('../interfaces/IMailService').MailOptions} options
   * @returns {Promise<any>}
   */
  async sendMail({ to, subject, text, html }) {
    try {
      const info = await this.#transporter.sendMail({
        from: `"Quejas Boyacá" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
        html
      });
      console.log('Correo enviado con Nodemailer:', info.messageId);
      return info;
    } catch (error) {
      console.error('Error al enviar correo con Nodemailer:', error.message);
      throw new Error('Fallo en el envío del correo.');
    }
  }
}

module.exports = new NodemailerService();