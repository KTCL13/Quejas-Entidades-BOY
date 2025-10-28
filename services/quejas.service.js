const { Complaint, Entity } = require('../models');
const { setEntitiesCache } = require('../config/cache');
const COMPLAINT_STATES = require('../config/constants');
const complaintRepository = require('../repositories/complaintRepository');

exports.getComplaintListByEntity = async (entidadId, page, limit) => {
  try {
    const paginatedResult =
      await complaintRepository.getPaginatedComplaintsForEntity(
        entidadId,
        page,
        limit
      );
    return paginatedResult;
  } catch (error) {
    console.error('Error en getQuejasPaginadasForEntity:', error);
    throw new Error('Error al obtener las quejas');
  }
};

exports.loadEntidades = async () => {
  const entidades = await Entity.findAll({
    order: [['name', 'ASC']],
  });
  setEntitiesCache(entidades);
};

exports.getEntidades = async () => {
  try {
    const entidades = await Entity.findAll({
      order: [['id', 'ASC']],
    });
    return entidades;
  } catch (error) {
    console.error(error);
    throw new Error('Error al obtener las entidades');
  }
};

exports.createComplaint = async ({ description, entity_id }) => {
  if (
    !description ||
    description.trim().length < 10 ||
    description.trim().length > 2000
  ) {
    throw new Error('La queja debe tener entre 10 y 2000 caracteres');
  }
  const entidad = await Entity.findByPk(entity_id);
  if (!entidad) {
    throw new Error('La entidad especificada no existe');
  }

  try {
    const newComplaint = await complaintRepository.createComplaint({
      description: description.trim(),
      entity_id,
    });
    return newComplaint;
  } catch (error) {
    console.error('Error al crear la queja:', error);
    throw new Error('Error al crear la queja');
  }
};

exports.getComplaintReportByEntity = async () => {
  try {
    const result = await Entity.findAll({
      attributes: [
        'id',
        'name',
        [
          Complaint.sequelize.fn(
            'COUNT',
            Complaint.sequelize.col('Complaints.id')
          ),
          'total_complaints',
        ],
      ],
      include: [
        {
          model: Complaint,
          attributes: [],
          where: { is_deleted: false },
          required: false,
        },
      ],
      group: ['Entity.id'],
      order: [[Complaint.sequelize.literal('total_complaints'), 'DESC']],
    });

    return result;
  } catch (error) {
    console.error('Error generando reporte de quejas por entidad:', error);
    throw error;
  }
};

exports.deleteComplaint = async (complaintId) => {
  try {
    const deleted = await complaintRepository.deleteComplaint(complaintId);
    if (deleted) {
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error al eliminar la queja:', error);
    throw new Error('Error al eliminar la queja');
  }
};

exports.changeComplaintState = async (complaintId, newState) => {
  try {
    const updatedComplaint = await complaintRepository.updateComplaintState(
      complaintId,
      newState
    );

    if (updatedComplaint) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error al cambiar el estado de la queja:', error);
    throw new Error('Error al cambiar el estado de la queja');
  }
};

exports.getComplaintById = async (complaintId) => {
  try {
    const complaint = await complaintRepository.getComplaintById(complaintId);
    if (!complaint) {
      throw new Error('Queja no encontrada o eliminada');
    }
    return complaint;
  } catch (error) {
    console.error('Error en getComplaintById:', error);
    throw new Error('Error al obtener la queja por ID');
  }
};

exports.getComplaintStates = async () => {
  try {
    return Object.values(COMPLAINT_STATES);
  } catch (error) {
    console.error('Error al obtener los estados de las quejas:', error);
    throw new Error('Error al obtener los estados de las quejas');
  }
};
