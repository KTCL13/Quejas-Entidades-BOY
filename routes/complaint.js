const express = require('express');
const router = express.Router();

const { getEntitysCache } = require('../config/cache');
const { createComplaint, getQuejasPaginadasForEntity, getReportComplaintForEntity } = require('../services/complaint.service');
const { sendMail } = require('../services/email.service'); //importamos el servicio de correo email.srviece.js
const { verifyRecaptcha } = require('../middleware/recaptcha');

// GET /registrar → renderiza el formulario con entidades
router.get('/register', async (req, res) => {
  try {
    const entitys = getEntitysCache() || [];
    res.render('register', { entitys, activePage: 'registrar' });
  } catch {
    res.render('register', { entitys: [], activePage: 'registrar' });
  }
});

// POST /api/quejas → crea una nueva queja
router.post('/', async (req, res) => {
  try {
    const { text, id_entity } = req.body;

    if (!text || text.trim().length < 10 || text.trim().length > 2000) {
      return res.status(400).json({ error: "La queja debe tener entre 10 y 2000 caracteres." });
    }
    if (!id_entity || isNaN(id_entity)) {
      return res.status(400).json({ error: "Debe seleccionar una entidad válida." });
    }

    const complaint= await createComplaint({ text, id_entity });
    res.status(201).json({ message: "Queja registrada", data: complaint });
  } catch {
    res.status(500).json({ error: 'Error al registrar la queja.' });
  }
});



// Controlador para obtener quejas paginadas
async function getComplaint(req, res) {
  try {
    const entityId = parseInt(req.query.entityId, 10);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (!entityId || isNaN(entityId)) {
      return res.status(400).json({ error: 'Debe seleccionar una entidad válida.' });
    }

    if (process.env.NODE_ENV !== 'test') {
      const token = req.headers['x-recaptcha-token'];
      if (!token) {
        return res.status(400).json({ error: 'Token de reCAPTCHA faltante.' });
      }
      const recaptchaOk = await verifyRecaptcha(token);
      if (!recaptchaOk) {
        return res.status(403).json({ error: 'Fallo la verificación de reCAPTCHA.' });
      }
    }
    // 🔹 Metadatos para el correo
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // Enviar correo de notificación
    await sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO,
      subject: "Consulta de lista de quejas",
      text: `Un usuario consultó la lista de quejas (entidadId=${entityId}) desde la IP: ${clientIp}`
    });

    // 🔹 Obtener datos de quejas

    const result = await getQuejasPaginadasForEntity(entityId, page, limit);
    res.json(result);
  } catch {
    res.status(500).json({ error: 'Error al obtener las quejas.' });
  }
}

// GET /api/quejas → lista paginada por entidad
router.get('/', getComplaint);

// GET /api/quejas/quejas-por-entidad → reporte
router.get('/complaintForEntity', async (req, res) => {
  try {
    const rows = await getReportComplaintForEntity();
    res.json(rows);
  } catch (err) {
    console.error('Error en /api/reportes/quejas-por-entidad:', err.message || err);
    res.status(500).json({ error: 'Error al generar el reporte', details: err.message });
  }
});

module.exports = router;
