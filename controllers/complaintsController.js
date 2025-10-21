const {
  getComplaintById,
  createComplaint,
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
