const express = require('express');
const router = express.Router();
const {
  getCommentsByComplaintId,
  createCommentByComplaintId,
} = require('../services/comment.service');

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

router.post('/complaint/:id', async (req, res) => {
  const complaintId = req.params.id;
  const { message } = req.body;
  if (!isNaN(complaintId) && message) {
    const newComment = await createCommentByComplaintId(complaintId, message);
    res.status(201).json(newComment);
  } else {
    res.status(400).send('ID de queja inválido o contenido vacío');
  }
});

module.exports = router;
