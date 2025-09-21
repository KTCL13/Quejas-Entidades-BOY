var express = require('express')

var router = express.Router()

var getEntidadesCache = require('../config/cache').getEntidadesCache

router.get('/', async (req, res) => {
  const entities = getEntidadesCache() || []
  res.render('lista-quejas', {
    entities,
    complaints: [],
    pages: [],
    currentPage: 1,
    activePage: 'lista'
  })
})



module.exports = router
