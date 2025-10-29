const { Complaint, Entity } = require('../models');
const { paginate } = require('../interfaces/IPagination');

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
    if (!complaint) return null;

    complaint.state = newState;
    await complaint.save();

    return complaint;
  } catch (error) {
    console.error('Error al actualizar el estado de la queja:', error);
    throw new Error('Error al actualizar el estado de la queja');
  }
}

async function createComplaint({ description, entity_id }) {
  try {
    const nuevaQueja = await Complaint.create({ description, entity_id });
    return nuevaQueja;
  } catch (error) {
    console.error('Error en createComplaint (repository):', error);
    throw error;
  }
}

async function getPaginatedComplaintsForEntity(entidadId, page, limit) {
  try {
    const queryOptions = {
      where: {
        entity_id: entidadId,
        is_deleted: false,
      },
      include: [
        {
          model: Entity,
          attributes: ['name'],
        },
      ],
      order: [['id', 'DESC']],
    };

    const paginatedResult = await paginate({
      model: Complaint,
      page,
      pageSize: limit,
      options: queryOptions,
    });

    return paginatedResult;
  } catch (error) {
    console.error('Error al obtener quejas paginadas por entidad:', error);
    throw new Error('Error al obtener quejas paginadas por entidad');
  }
}

async function deleteComplaint(complaintId) {
  try {
    const complaint = await Complaint.findByPk(complaintId);
    if (!complaint) return null;

    complaint.is_deleted = true;
    await complaint.save();

    return true;
  } catch (error) {
    console.error('Error al eliminar la queja:', error);
    throw new Error('Error al eliminar la queja');
  }
}

module.exports = {
  getComplaintById,
  updateComplaintState,
  createComplaint,
  getPaginatedComplaintsForEntity,
  deleteComplaint,
};
