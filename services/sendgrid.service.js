require('dotenv').config();
const sgMail = require('@sendgrid/mail');
const IMailService = require('../interfaces/IMailService'); // Ajusta la ruta a tu interfaz

/**
 * Implementación del servicio de correo utilizando la API de SendGrid.
 * Cumple con el contrato definido por IMailService.
 */
class SendGridService extends IMailService {
  constructor() {
    super();
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }

  /**
   * Envía un correo electrónico utilizando la API de SendGrid.
   * @override
   * @param {object} options - Las opciones del correo a enviar.
   * @param {string} options.to - Dirección del destinatario.
   * @param {string} options.from - Dirección del remitente (debe estar verificada en SendGrid).
   * @param {string} options.subject - Asunto del correo.
   * @param {string} [options.text] - Cuerpo del correo en texto plano.
   * @param {string} [options.html] - Cuerpo del correo en formato HTML.
   * @returns {Promise<any>} - Una promesa que se resuelve con la respuesta de la API de SendGrid.
   * @throws {Error} - Si falla el envío del correo.
   */
  async sendMail({ to, subject, text, html }) {
    const msg = {
      to,
      from: {
        name: 'Quejas Boyacá',
        email: process.env.EMAIL_FROM,
      },
      subject,
      text,
      html,
    };

    try {
      const response = await sgMail.send(msg);
      return response[0];
    } catch (error) {
      console.error(
        '❌ Error al enviar correo con la API de SendGrid:',
        error.message
      );
      if (error.response) {
        console.error(error.response.body);
      }
      throw new Error('Fallo en el envío del correo.');
    }
  }
}

module.exports = new SendGridService();
