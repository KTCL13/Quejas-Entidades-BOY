var express = require('express');
var router = express.Router();

var { getEntitiesCache } = require('../config/cache');

// Listado de quejas
router.get('/', async (req, res) => {
  const entities = getEntitiesCache() || [];
  res.render('lista-quejas', {
    entities,
    complaints: [],
    pages: [],
    currentPage: 1,
    activePage: 'lista'
  });
});

router.get('/complaint/:id', async (req, res) => {
  const { id } = req.params;

  const complaint = {
    id,
    entities: "Entidad X",
    estate: "Pendiente",
    description: "Texto de la queja...",
    comments: [
    ]
  };

  res.render('comment', {
    complaint,
    activePage: 'detalle'
  });
});

module.exports = router;
