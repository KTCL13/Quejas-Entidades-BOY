const express = require('express');
const router = express.Router();
const mailService = require('../services/sendgrid.service');
require("dotenv").config(); // <--- Importar dotenv


// GET /api/reports
router.get('/', async (req, res) => {
  res.render('reportes', { activePage: 'reportes', mensaje: null });

});


// GET /api/reports/ver
router.get('/ver', async (req, res) => {
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  try {
    await mailService.sendMail({
      to: process.env.EMAIL_TO,
      subject: 'Reporte de problema en el sistema de quejas',
      text: `Se ha recibido un reporte de problema desde la IP: ${clientIp}. Por favor, revisar el sistema para más detalles.`,
    });
  } catch (error) {
    console.error('Error al enviar el correo:', error);
  }
});

module.exports = router;
