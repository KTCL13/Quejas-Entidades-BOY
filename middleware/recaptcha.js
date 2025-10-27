const { token } = require('morgan');

const verifyRecaptcha = async (token) => {
  if (process.env.NODE_ENV === 'development') {
    return true;
  }

  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    if (!secretKey) {
      console.error(
        'La clave secreta de reCAPTCHA no está configurada en las variables de entorno.'
      );
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

const verifyRecaptchaV3 = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV !== 'production') {
      return next();
    }

    const token = req.headers['x-recaptcha-token'];
    if (!token) {
      return res.status(400).json({ message: 'Falta el token de reCAPTCHA' });
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    if (!secretKey) {
      return res.status(500).json({
        message: 'Falta la clave secreta de reCAPTCHA en el servidor',
      });
    }

    const response = await fetch(
      'https://www.google.com/recaptcha/api/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          secret: secretKey,
          response: token,
        }),
      }
    );

    const data = await response.json();

    if (data.success && data.score >= 0.5) {
      return next();
    }

    return res.status(403).json({
      message: 'Verificación de reCAPTCHA fallida',
      score: data.score || null,
    });
  } catch (error) {
    console.error('Error en verificación reCAPTCHA:', error);
    return res.status(500).json({ message: 'Error al verificar reCAPTCHA' });
  }
};

module.exports = {
  verifyRecaptcha,
  verifyRecaptchaV3,
};
