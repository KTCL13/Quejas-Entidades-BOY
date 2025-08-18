const express = require('express');
const router = express.Router();
const quejasService = require('../services/quejas.service');

// GET /api/reportes/quejas-por-entidad
router.get('/quejas-por-entidad', async (req, res) => {
  try {
    const rows = await quejasService.getReporteQuejasPorEntidad();
    res.json(rows);
  } catch (err) {
    console.error('Error en /api/reportes/quejas-por-entidad:', err.message || err);
    res.status(500).json({ error: 'Error al generar el reporte', details: err.message });
  }
});

// ruta raíz opcional
router.get('/', (req, res) => {
  res.json({ message: 'Endpoint de reportes activo' });
});

module.exports = router;
module.exports = router;
module.exports = router;
