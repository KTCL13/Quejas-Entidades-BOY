const express = require('express');
const router = express.Router();
const nodemailer = require("nodemailer");
require("dotenv").config(); // <--- Importar dotenv

// Configuración del transporter con variables de entorno
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// GET /api/reports
router.get('/', async (req, res) => {
  res.render('reportes', { activePage: 'reportes', mensaje: null });
});

// GET /api/reports/ver
router.get('/ver', async (req, res) => {
  const clientIp = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_TO, // ahora configurable
    subject: "Notificación: Ver Reporte",
    text: `Se hizo clic en "Número de quejas por entidad" desde la IP: ${clientIp}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.render('reportes', { 
      activePage: 'reportes',
      mensaje: "Se envió el correo correctamente"
    });
  } catch (error) {
    console.error("Error al enviar correo:", error);
    res.render('reportes', { 
      activePage: 'reportes',
      mensaje: " Error al enviar correo"
    });
  }
});

module.exports = router;
