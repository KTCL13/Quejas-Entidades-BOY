const express = require('express');
const router = express.Router();
const { param, body } = require('express-validator');
const { validateRequest } = require('../middleware/validateRequest');
const {
  getCommentsByComplaintIdController,
  createCommentByComplaintIdController,
} = require('../controllers/commentsController');

//Get /api/complaint/:id
router.get(
  '/complaint/:id',
  param('id').isNumeric().withMessage('ID de queja inválido'),
  validateRequest,
  getCommentsByComplaintIdController
);

router.post(
  '/complaint/:id',
  param('id').isNumeric().withMessage('ID de queja inválido'),
  body('message').notEmpty().withMessage('El mensaje no puede estar vacío'),
  validateRequest,
  createCommentByComplaintIdController
);

module.exports = router;
