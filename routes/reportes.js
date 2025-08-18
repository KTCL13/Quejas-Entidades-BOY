const express = require('express');
const router = express.Router();

// GET /api/reportes
router.get('/', async (req, res) => {
  res.render('reportes',{ activePage: 'reportes' });
});

module.exports = router;

