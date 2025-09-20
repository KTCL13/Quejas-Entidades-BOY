var express = require('express')

var router = express.Router()

var { getEntitiesCache } = require('../config/cache')

router.get('/', async (req, res) => {
  const entidades = getEntitiesCache() || []
  res.render('lista-quejas', {
    entidades,
    quejas: [],
    paginas: [],
    paginaActual: 1,
    activePage: 'lista'
  })
})



module.exports = router
