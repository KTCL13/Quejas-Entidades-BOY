const { validationResult } = require('express-validator');
const axios = require('axios');
const dotenv = require('dotenv');
const authServiceUrl = process.env.AUTH_SERVICE_URL;

exports.validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

exports.validateLogin = async (req, res, next) => {
  try {
    const userEmail = req.headers['x-useremail'];

    const response = await axios.post(`${authServiceUrl}/session-status`, {
      email: userEmail,
    });

    const { sessionActive } = response.data;

    if (!sessionActive) {
      return res.status(401).json({
        message: 'Usuario con sesion inactiva',
      });
    }
    next();
  } catch (error) {
    console.error('Error al validar sesión:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error al validar el estado de sesión.',
    });
  }
};
