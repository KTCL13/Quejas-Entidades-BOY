const express = require('express');
const router = express.Router();
const { getCommentsByComplaintId } = require('../services/comment.service');

//Get /api/complaint/:id
router.get('/complaint/:id', async (req, res) => {
  const complaintId = req.params.id;
  if (!isNaN(complaintId)) {
    var comments = await getCommentsByComplaintId(complaintId);
    res.json(comments);
  } else {
    res.status(400).send('ID de queja inválido');
  }
});



module.exports = router;