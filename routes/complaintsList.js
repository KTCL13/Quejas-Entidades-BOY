var express = require('express')

var router = express.Router()

var { getEntitiesCache } = require('../config/cache')

router.get('/', async (req, res) => {
  const entities = getEntitiesCache() || []
  res.render('lista-quejas', {
    entities,
    complaints: [],
    pages: [],
    currentPage: 1,
    activePage: 'lista'
  })
})

module.exports = router
