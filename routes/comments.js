const express = require('express');
const router = express.Router();
const { createCommentByComplaintId } = require('../services/comment.service');
const { param } = require('express-validator');
const { validateRequest } = require('../middleware/validateRequest');
const {
  getCommentsByComplaintIdController,
} = require('../controllers/commentsController');

//Get /api/complaint/:id
router.get(
  '/complaint/:id',
  param('id').isNumeric().withMessage('ID de queja inválido'),
  validateRequest,
  getCommentsByComplaintIdController
);

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
