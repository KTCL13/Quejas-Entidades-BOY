var express = require('express')
var {getQuejasPaginadas , getEntidades, getQuejasPaginadasForEntity, loadEntidades} = require('../services/quejas.service')


const router = express.Router()

router.get('/', async (req, res) => {

})

module.exports = router
