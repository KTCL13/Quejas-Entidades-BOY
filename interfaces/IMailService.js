/**
 * @typedef {Object} MailOptions
 * @property {string} to - Dirección del destinatario.
 * @property {string} subject - Asunto del correo.
 * @property {string} [text] - Cuerpo del correo en texto plano.
 * @property {string} [html] - Cuerpo del correo en formato HTML.
 */

/**
 * Interfaz para un servicio de envío de correos electrónicos.
 * Define el contrato que cualquier proveedor de correo debe seguir.
 * @interface
 */
class IMailService {
  /**
   * Envía un correo electrónico.
   * @param {MailOptions} options - Las opciones del correo a enviar.
   * @returns {Promise<any>} - Una promesa que se resuelve con la información del envío.
   * @throws {Error} - Si la implementación no está completa o falla el envío.
   */
  async sendMail(options) {
    throw new Error('Método "sendMail" no implementado.');
  }
}

module.exports = IMailService;