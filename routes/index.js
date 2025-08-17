var express = require('express')

var router = express.Router()

var getEntidadesCache = require('../models/cache').getEntidadesCache

router.get('/', async (req, res) => {
  // Obtiene las entidades del cache (o como corresponda)
  const entidades = getEntidadesCache() || []
  res.render('lista-quejas', {
    entidades,
    quejas: [],
    paginas: [],
    paginaActual: 1
  })
})



module.exports = router
