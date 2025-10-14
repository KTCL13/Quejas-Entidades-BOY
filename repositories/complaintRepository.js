const { Complaint } = require('../models/Complaint');
const { Entity } = require('../models/Entity');

async function getComplaintById(complaintId) {
  try {
    const complaint = await Complaint.findOne({
      where: { id: complaintId, is_deleted: false },
      include: [{
        model: Entity,
        attributes: ['id', 'name']
      }],
    });
    return complaint;
  } catch (error) {
    console.error('Error al obtener la queja por ID:', error);
    throw new Error('Error al obtener la queja por ID');
  }
}

module.exports = { getComplaintById };
