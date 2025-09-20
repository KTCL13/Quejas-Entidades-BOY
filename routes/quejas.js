const express = require('express');
const router = express.Router();

const { getEntidadesCache } = require('../config/cache');
const { createQueja, getQuejasPaginadasForEntity, getReporteQuejasPorEntidad,deleteQueja } = require('../services/quejas.service');
const { enviarCorreo } = require('../services/email.service');
const { verifyRecaptcha } = require('../middleware/recaptcha');

// GET /registrar → renderiza el formulario con entidades
router.get('/registrar', async (req, res) => {
  try {
    const entidades = getEntidadesCache() || [];
    res.render('registrar', { entidades, activePage: 'registrar' });
  } catch {
    res.render('registrar', { entidades: [], activePage: 'registrar' });
  }
});

// POST /api/quejas → crea una nueva queja
router.post('/', async (req, res) => {
  try {
    const { texto, id_entidad } = req.body;

    if (!texto || texto.trim().length < 10 || texto.trim().length > 2000) {
      return res.status(400).json({ error: "La queja debe tener entre 10 y 2000 caracteres." });
    }
    if (!id_entidad || isNaN(id_entidad)) {
      return res.status(400).json({ error: "Debe seleccionar una entidad válida." });
    }

    const queja = await createQueja({ texto, id_entidad });
    res.status(201).json({ message: "Queja registrada", data: queja });
  } catch {
    res.status(500).json({ error: 'Error al registrar la queja.' });
  }
});

// GET /api/quejas → lista paginada por entidad
async function obtenerQuejas(req, res) {
  try {
    const entidadId = parseInt(req.query.entidadId, 10);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (!entidadId || isNaN(entidadId)) {
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

    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    await enviarCorreo({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO,
      subject: "Consulta de lista de quejas",
      text: `Un usuario consultó la lista de quejas (entidadId=${entidadId}) desde la IP: ${clientIp}`
    });

    const result = await getQuejasPaginadasForEntity(entidadId, page, limit);
    res.json(result);
  } catch {
    res.status(500).json({ error: 'Error al obtener las quejas.' });
  }
}
router.get('/', obtenerQuejas);

// GET /api/quejas/quejas-por-entidad → reporte
router.get('/quejas-por-entidad', async (req, res) => {
  try {
    const rows = await getReporteQuejasPorEntidad();
    res.json(rows);
  } catch (err) {
    console.error('Error en /api/reportes/quejas-por-entidad:', err.message || err);
    res.status(500).json({ error: 'Error al generar el reporte', details: err.message });
  }
});

// DELETE /api/quejas/:id → eliminar una queja
router.delete('/:id', async (req, res) => {
  try {
    const { password } = req.body;
    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    const id = parseInt(req.params.id, 10);
    const result = await deleteQueja(id);

    if (result) {
      res.status(200).json({ message: 'Queja eliminada con éxito' });
    } else {
      res.status(404).json({ error: 'Queja no encontrada' });
    }
  } catch (err) {
    console.error('Error en DELETE /api/quejas/:id:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
