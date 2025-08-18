const express = require('express');
const router = express.Router();
const quejasService = require('../services/quejas.service');

// GET /
router.get('/', async (req, res, next) => {
  try {
    // Si prefieres renderizar una vista PUG, crea src/views/lista-quejas.pug
    // Por ahora devolvemos JSON simple para evitar 500 por vista faltante
    res.json({
      message: 'Aplicación de Quejas - servidor OK',
      endpoints: {
        reportes: '/api/reportes/quejas-por-entidad',
        entidades: '/api/entidades'
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
