const { getComplaintById } = require('../services/quejas.service');

exports.getComplaintByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const complaint = await getComplaintById(id);
    return res.status(200).json(complaint);
  } catch (error) {
    next(error);
  }
};
