const express = require('express');
const router = express.Router();

const { getEntidadesCache } = require('../models/cache');
const { createQueja, getQuejasPaginadasForEntity, getReporteQuejasPorEntidad } = require('../services/quejas.service');

// GET /registrar → renderiza el formulario con entidades
router.get('/registrar', async (req, res) => {
  try {
    const entidades = getEntidadesCache() || [];
    console.log('Entidades en cache (registrar):', entidades);
    res.render('registrar', { entidades, activePage: 'registrar' });
  } catch (err) {
    res.render('registrar', { entidades: [], activePage: 'registrar' });
  }
});

// POST /api/quejas → crea una nueva queja
router.post('/', async (req, res) => {
  try {
    const { texto, id_entidad } = req.body;

    // Validaciones básicas
    if (!texto || texto.trim().length < 10 || texto.trim().length > 2000) {
      return res.status(400).json({ error: "La queja debe tener entre 10 y 2000 caracteres." });
    }
    if (!id_entidad || isNaN(id_entidad)) {
      return res.status(400).json({ error: "Debe seleccionar una entidad válida." });
    }

    const queja = await createQueja({ texto, id_entidad });
    res.status(201).json({ message: "Queja registrada", data: queja });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/quejas → lista paginada por entidad
router.get('/', async (req, res) => {
  try {
    const entidadId = req.query.entidadId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (!entidadId) {
      return res.status(400).json({ error: 'Debe seleccionar una entidad.' });
    }

    // 🔹 Verificar token reCAPTCHA
    const token = req.headers['x-recaptcha-token'];
    if (!token) {
      return res.status(400).json({ error: 'Token de reCAPTCHA faltante.' });
    }

    const verifyRes = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=6LeBKKkrAAAAAK-lSIe8Tbx1aBoGL1tAkb2KgxpP&response=${token}`,
      { method: 'POST' }
    );
    const verifyData = await verifyRes.json();

    console.log("data:", verifyData);

    if (!verifyData.success || verifyData.score < 0.5) {
      return res.status(403).json({ error: 'Fallo la verificación de reCAPTCHA.' });
    }

    // 🔹 Si pasó la validación, obtener datos
    const result = await getQuejasPaginadasForEntity(entidadId, page, limit);
    res.json(result);

  } catch (err) {
    console.error("Error en /api/quejas:", err);
    res.status(500).json({ error: err.message });
  }
});


// GET /api/quejas/quejas-por-entidad → lista paginada por entidad
router.get('/quejas-por-entidad', async (req, res) => {
  try {
    const rows = await getReporteQuejasPorEntidad();
    res.json(rows);
  } catch (err) {
    console.error('Error en /api/reportes/quejas-por-entidad:', err.message || err);
    res.status(500).json({ error: 'Error al generar el reporte', details: err.message });
  }
});



module.exports = router;