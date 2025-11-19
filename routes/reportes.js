const express = require('express');
const router = express.Router();
const { getComplaintReportByEntity } = require('../services/quejas.service');
const { emitReportVisited } = require('../kafka/Producer');
const axios = require('axios');
require('dotenv').config();

router.get('/complaint-state-history', async (req, res) => {
  try {
    const response = await axios.get(
      `${process.env.COMPLAINTREPORT_SERVICE_URL}/reports?page=${req.query.page}&pageSize=${req.query.pageSize}`
    );
    const report = response.data;

    emitReportVisited(req);

    return res.status(200).json(report);
  } catch (error) {
    console.error(
      'Error al obtener el reporte de historial de estados de quejas:',
      error
    );
    return res.status(500).json({
      error: 'Error al obtener el reporte de historial de estados de quejas',
    });
  }
});

module.exports = router;
