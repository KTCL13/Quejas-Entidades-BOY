const express = require('express');
const router = express.Router();
const { getComplaintReportByEntity } = require('../services/quejas.service');
require('dotenv').config(); // <--- Importar dotenv

// GET /api/reports
router.get('/', async (req, res) => {
  try {
    const report = await getComplaintReportByEntity();
    res.render('reportes', {
      activePage: 'reportes',
      message: null,
      report,
    });
  } catch (error) {
    console.error('Error al cargar reporte de quejas:', error);
    res.render('reportes', {
      activePage: 'reportes',
      message: 'Error al cargar el reporte',
      report: [],
    });
  }
});

module.exports = router;
