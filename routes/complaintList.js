var express = require('express')

var router = express.Router()

var getEntidadesCache = require('../config/cache').getEntidadesCache

router.get('/', async (req, res) => {
  const entitys = getEntidadesCache() || []
  res.render('complaintList.view', {
    entitys,
    complaint: [],
    pages: [],
    currentPage: 1,
    activePage: 'lista'
  })
})



module.exports = router
