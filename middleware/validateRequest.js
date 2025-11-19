const { validationResult } = require('express-validator');
const axios = require('axios');
const dotenv = require('dotenv');
const logger = require('../uttils/logger');
const authServiceUrl = process.env.AUTH_SERVICE_URL;

exports.validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn('Validación fallida en petición', {
      path: req.path,
      method: req.method,
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
    return res.status(400).json({
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  logger.debug(`Validación exitosa: ${req.method} ${req.path}`);
  next();
};

exports.validateLogin = async (req, res, next) => {
  try {
    const userEmail = req.headers['x-useremail'];

    logger.debug(`Validando sesión para: ${userEmail}`);

    const response = await axios.post(`${authServiceUrl}/session-status`, {
      email: userEmail,
    });

    const { sessionActive } = response.data;

    if (!sessionActive) {
      logger.warn(`Sesión inactiva para usuario: ${userEmail}`);
      return res.status(401).json({
        message: 'Usuario con sesion inactiva',
      });
    }
    logger.info(`Sesión válida para usuario: ${userEmail}`);
    next();
  } catch (error) {
    logger.error('Error al validar sesión', {
      error: error.message,
      userEmail: req.headers['x-useremail'],
    });
    res.status(500).json({
      success: false,
      message: 'Error al validar el estado de sesión.',
    });
  }
};
