const express = require('express');
const router = express.Router();

const { getEntidadesCache } = require('../models/cache');
const { createQueja, getQuejasPaginadasForEntity } = require('../services/quejas.service');

// GET /registrar → renderiza el formulario con entidades
router.get('/registrar', async (req, res) => {
  try {
    const entidades = getEntidadesCache() || [];
    console.log('Entidades en cache (registrar):', entidades);
    res.render('registrar', { entidades });
  } catch (err) {
    res.render('registrar', { entidades: [] });
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

    const result = await getQuejasPaginadasForEntity(entidadId, page, limit);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;