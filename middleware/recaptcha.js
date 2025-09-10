const fetch = require('node-fetch');


const verifyRecaptcha = async (req, res, next) => {

    if (process.env.NODE_ENV === 'test') {
        return next();
    }

    try {
        const token = req.headers['x-recaptcha-token'];
        if (!token) {
            return res.status(400).json({ error: 'Token de reCAPTCHA faltante.' });
        }

        const secretKey = process.env.RECAPTCHA_SECRET_KEY;
        if (!secretKey) {
            console.error('La clave secreta de reCAPTCHA no está configurada en las variables de entorno.');
            return res.status(500).json({ error: 'Error de configuración del servidor.' });
        }

        const response = await fetch(
            `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`,
            { method: 'POST' }
        );

        const data = await response.json();

        // Verificamos si la validación fue exitosa y si el score es aceptable
        if (data.success && data.score >= 0.5) {
            next(); // ¡Verificación exitosa! Continúa a la lógica de la ruta.
        } else {
            // La verificación falló
            return res.status(403).json({ error: 'Fallo la verificación de reCAPTCHA.', details: data['error-codes'] });
        }
    } catch (error) {
        console.error('Error en el middleware de reCAPTCHA:', error);
        return res.status(500).json({ error: 'Error interno al verificar reCAPTCHA.' });
    }
};

module.exports = {
    verifyRecaptcha
};