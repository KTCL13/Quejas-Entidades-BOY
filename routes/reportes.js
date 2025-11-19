const express = require('express');
const router = express.Router();
const { getComplaintReportByEntity } = require('../services/quejas.service');
const { emitReportVisited } = require('../kafka/Producer');
const axios = require('axios');
require('dotenv').config();

// GET /api/reports
router.get('/', async (req, res) => {
  try {
    const report = await getComplaintReportByEntity();
    res.render('reportes', {
      activePage: 'reportes',
      message: null,
      report,
    });
    emitReportVisited(req);
  } catch (error) {
    console.error('Error al cargar reporte de quejas:', error);
    res.render('reportes', {
      activePage: 'reportes',
      message: 'Error al cargar el reporte',
      report: [],
    });
  }
});

router.get('/complaint-state-history', async (req, res) => {
  try {
    const response = await axios.get(
      `${process.env.COMPLAINTREPORT_SERVICE_URL}/reports?page=${req.query.page}&pageSize=${req.query.pageSize}`
    );
    const report = response.data;

    try {
      logger.info('Visita a reportes (historial) - emitiendo evento', {
        ip: req.ip,
        method: req.method,
        path: req.path,
        query: req.query,
      });
      await emitReportVisited(req);
      logger.info('Evento report-visited emitido correctamente (historial)', {
        ip: req.ip,
        path: req.path,
      });
    } catch (err) {
      logger.error('Error emitiendo evento report-visited (historial)', {
        error: err.message,
        stack: err.stack,
      });
    }
    return res.status(200).json(report);
  } catch (error) {
    logger.error(
      'Error al obtener el reporte de historial de estados de quejas:',
      { error: error.message, stack: error.stack }
    );
    return res.status(500).json({
      error: 'Error al obtener el reporte de historial de estados de quejas',
    });
  }
});

module.exports = router;
