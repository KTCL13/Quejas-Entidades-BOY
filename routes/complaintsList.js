var express = require('express');
var router = express.Router();

var { getEntitiesCache } = require('../config/cache');
var { getComplaintById } = require('../services/quejas.service');

// Listado de quejas

router.get('/', async (req, res) => {
  res.render('welcomePage', {});
});

router.get('/complaints/', async (req, res) => {
  const entities = getEntitiesCache() || [];
  res.render('lista-quejas', {
    entities,
    complaints: [],
    pages: [],
    currentPage: 1,
    activePage: 'lista',
  });
});

router.get('/complaint/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const complaint = await getComplaintById(id);

    res.render('comment', {
      complaint,
      activePage: 'detalle',
    });
  } catch (error) {
    console.error('Error al obtener los datos de la queja:', error);
    res.status(500).send('Error interno del servidor');
  }
});

module.exports = router;
