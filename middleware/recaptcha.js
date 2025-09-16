
const verifyRecaptcha = async (token) => {

    if (process.env.NODE_ENV === 'development ') {
        return true;
    }

    try {
        const secretKey = process.env.RECAPTCHA_SECRET_KEY;
        if (!secretKey) {
            console.error('La clave secreta de reCAPTCHA no está configurada en las variables de entorno.');
            return false;
        }

        const response = await fetch(
            `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`,
            { method: 'POST' }
        );

        const data = await response.json();

        // Verificamos si la validación fue exitosa y si el score es aceptable
        if (data.success && data.score >= 0.5) {
            return true;
        } else {
            // La verificación falló
            return false;
        }
    } catch (error) {
        console.error('Error en el middleware de reCAPTCHA:', error);
        return false;
    }
};

module.exports = {
    verifyRecaptcha
};