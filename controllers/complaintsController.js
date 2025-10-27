const {
  getComplaintById,
  createComplaint,
  getComplaintListByEntity,
} = require('../services/quejas.service');

exports.getComplaintByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const complaint = await getComplaintById(id);
    return res.status(200).json(complaint);
  } catch (error) {
    next(error);
  }
};

exports.createComplaintController = async (req, res, next) => {
  try {
    const complaintData = req.body;
    const newComplaint = await createComplaint(complaintData);
    return res.status(201).json(newComplaint);
  } catch (error) {
    next(error);
  }
};

exports.getComplaintListController = async (req, res, next) => {
  try {
    const entityId = parseInt(req.query.entidadId, 10);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const complaints = await getComplaintListByEntity(entityId, page, limit);
    return res.status(200).json(complaints);
  } catch (error) {
    next(error);
  }
};
