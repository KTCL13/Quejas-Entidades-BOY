const express = require('express');
const router = express.Router();

const { getEntitiesCache } = require('../config/cache');
const {
  getComplaintReportByEntity,
  getComplaintStates,
} = require('../services/quejas.service');
const { param, body, header, query } = require('express-validator');
const {
  validateRequest,
  validateLogin,
} = require('../middleware/validateRequest');
const {
  getComplaintByIdController,
  createComplaintController,
  getComplaintListController,
  deleteComplaintController,
  changeComplaintStateController,
} = require('../controllers/complaintsController');

// GET /registrar → renderiza el formulario con entidades
router.get('/registrar', async (req, res) => {
  try {
    const entidades = getEntitiesCache() || [];
    res.render('registrar', { entidades, activePage: 'registrar' });
  } catch {
    res.render('registrar', { entidades: [], activePage: 'registrar' });
  }
});

// POST /api/complaints → crea una nueva queja
router.post(
  '/',
  body('description')
    .isLength({ min: 10, max: 2000 })
    .withMessage('La descripción debe tener entre 10 y 2000 caracteres'),
  body('entity_id').isInt().withMessage('Entity_id debe ser un entero'),
  validateRequest,
  createComplaintController
);

// GET /api/complaints → lista paginada por entidad
router.get(
  '/',
  query('entidadId').isInt().withMessage('entidadId debe ser un entero'),
  header('x-useremail').isEmail().withMessage('user email is required'),
  validateRequest,
  validateLogin,
  getComplaintListController
);

//DELETE/api/complaints/:id
router.delete(
  '/:complaintId',
  param('complaintId').isInt().withMessage('complaintID debe ser un entero'),
  header('x-useremail').isEmail().withMessage('user email is required'),
  validateRequest,
  validateLogin,
  deleteComplaintController
);

// PUT /api/complaints/cambiar-estado
router.put(
  '/change-state/:complaintId',
  param('complaintId').isInt().withMessage('complaintID debe ser un entero'),
  body('newState').notEmpty(),
  header('x-useremail').isEmail().withMessage('user email is required'),
  validateRequest,
  validateLogin,
  changeComplaintStateController
);

//GET /api/complaints/:id
router.get(
  '/:id',
  param('id').isNumeric().withMessage('ID de queja inválido'),
  validateRequest,
  getComplaintByIdController
);

// GET /api/complaints/states
router.get('/data/states', async (req, res) => {
  try {
    const states = await getComplaintStates();
    res.json(states);
  } catch (err) {
    console.error('Error en /api/complaints/states:', err.message || err);
    res.status(500).json({
      error: 'Error al obtener los estados de las quejas.',
      details: err.message,
    });
  }
});

module.exports = router;
