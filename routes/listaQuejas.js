var express = require('express')

var router = express.Router()

var getEntidadesCache = require('../config/cache').getEntidadesCache

router.get('/', async (req, res) => {
  const entidades = getEntidadesCache() || []
  res.render('lista-quejas', {
    entidades,
    quejas: [],
    paginas: [],
    paginaActual: 1,
    activePage: 'lista'
  })
})



module.exports = routerssx
