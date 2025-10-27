const express = require('express');
const axios = require('axios');

const router = express.Router();
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    await axios.post('http://localhost:4000/api/auth/login', {
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
    await axios.post('http://localhost:4000/api/auth/logout', {
      email: req.body.email,
    });
    res.status(200).json({ message: 'Logout exitoso' });
  } catch (error) {
    res.status(500).json({ message: 'Error al cerrar sesión' });
  }
});

module.exports = router;
