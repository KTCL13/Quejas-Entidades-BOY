const getComplaintById = require('../services/complaint.service');

exports.getComplaintByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const complaint = await getComplaintById(id);
    if (!complaint) {
      return res.status(404).json({ message: 'Queja no encontrada' });
    }
    return res.json(complaint);
  } catch (error) {
    next(error);
  }
};
