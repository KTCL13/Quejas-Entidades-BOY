const {
  getComplaintById,
  createComplaint,
  getComplaintListByEntity,
  deleteComplaint,
  changeComplaintState,
} = require('../services/quejas.service');

const { emitComplaintStateChanged } = require('../kafka/Producer');

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

exports.deleteComplaintController = async (req, res, next) => {
  try {
    const complaintId = req.params.complaintId;
    await deleteComplaint(complaintId);
    return res.status(200).json({ message: 'Queja eliminada correctamente.' });
  } catch (error) {
    next(error);
  }
};

exports.changeComplaintStateController = async (req, res, next) => {
  try {
    const { newState } = req.body;
    const complaintId = req.params.complaintId;
    const complaint = await getComplaintById(complaintId);
    const changedBy = req.header('x-useremail');
    await changeComplaintState(complaintId, newState);
    emitComplaintStateChanged(
      complaint.id,
      complaint.description,
      complaint.Entity.name,
      complaint.state,
      newState,
      changedBy
    );
    return res.json({
      message: 'Estado de la queja actualizado correctamente.',
    });
  } catch (error) {
    next(error);
  }
};
