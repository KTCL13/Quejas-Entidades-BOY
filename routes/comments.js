const express = require('express');
const router = express.Router();


//Get /api/comments-complaint-id/:id
router.get('/:id', async (req, res) => {
  const complaintId = req.params.id;
  if (!isNaN(complaintId)) {
    
    res.send(`Comentarios para la queja con ID: ${complaintId}`);
  } else {
    res.status(400).send('ID de queja inválido');
  }
});

module.exports = router;