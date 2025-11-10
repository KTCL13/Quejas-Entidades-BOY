const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const router = express.Router();

const authServiceUrl = process.env.AUTH_SERVICE_URL;

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    await axios.post(`${authServiceUrl}/login`, {
      email,
      password,
    });
    res.render('saveEmail', { email });
  } catch (error) {
    let errorMessage = 'Error del servidor. Inténtalo de nuevo más tarde.';

    if (error.response?.status === 401) {
      errorMessage = 'La contraseña no es correcta';
    } else if (error.response?.status === 404) {
      errorMessage = 'Usuario no encontrado';
    }

    res.status(error.response?.status || 500).render('login', {
      error: errorMessage,
      email,
    });
  }
});

router.post('/logout', async (req, res) => {
  try {
    await axios.post(`${authServiceUrl}/logout`, {
      email: req.body.email,
    });
    res.status(200).json({ message: 'Logout exitoso' });
  } catch (error) {
    res.status(500).json({ message: 'Error al cerrar sesión' });
  }
});

module.exports = router;

router.post('/validate-session', async (req, res) => {
  const { email } = req.body;

  try {
    const response = await axios.post(`${authServiceUrl}/session-status`, {
      email,
    });

    const { sessionActive } = response.data;

    if (!sessionActive) {
      return res.status(401).json({
        message: 'Usuario con sesion inactiva',
      });
    }

    res.status(200).json({
      message: 'Sesion activa',
    });
  } catch (error) {
    console.error('Error al validar sesión:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error al validar el estado de sesión.',
    });
  }
});
