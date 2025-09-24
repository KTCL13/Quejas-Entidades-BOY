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

  try {

    const apiResponse = await fetch(`http://localhost:3000/api/complaints/${id}`);


    if (!apiResponse.ok) {
      return res.status(apiResponse.status).send('Queja no encontrada');
    }

    const data = await apiResponse.json();

    const complaint = {
      id: data.id,
      entities: data.Entity.name,
      state: data.state,
      description: data.description,
    };

    res.render('comment', {
      complaint,
      activePage: 'detalle'
    });

  } catch (error) {
    console.error('Error al obtener los datos de la queja:', error);
    res.status(500).send('Error interno del servidor');
  }
});

module.exports = router;
