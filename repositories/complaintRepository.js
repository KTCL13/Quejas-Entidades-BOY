const { Complaint } = require('../models/Complaint');
const { Entity } = require('../models/Entity');

async function getComplaintById(complaintId) {
  try {
    const complaint = await Complaint.findOne({
      where: { id: complaintId, is_deleted: false },
      include: [
        {
          model: Entity,
          attributes: ['id', 'name'],
        },
      ],
    });
    return complaint;
  } catch (error) {
    console.error('Error al obtener la queja por ID:', error);
    throw new Error('Error al obtener la queja por ID');
  }
}

async function updateComplaintState(complaintId, newState) {
  try {
    const complaint = await Complaint.findByPk(complaintId);
    if (!complaint) {
      return null;
    }

    complaint.state = newState;
    await complaint.save();

    return complaint;
  } catch (error) {
    console.error('Error al actualizar el estado de la queja:', error);
    throw new Error('Error al actualizar el estado de la queja');
  }
}

async function deleteComplaint(complaintId) {
  try {
    const complaint = await Complaint.findByPk(complaintId);
    if (!complaint) {
      return null;
    }

    complaint.is_deleted = true;
    await complaint.save();

    return complaint;
  } catch (error) {
    console.error('Error al eliminar la queja:', error);
    throw new Error('Error al eliminar la queja');
  }
}

module.exports = {
  getComplaintById,
  updateComplaintState,
  deleteComplaint
}
