const express = require('express');
const router = express.Router();
const { createQueja } = require('../services/quejas.service');

// POST /api/quejas
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

module.exports = router;
