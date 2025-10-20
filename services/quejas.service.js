const { Complaint, Entity } = require('../models');
const { setEntitiesCache } = require('../config/cache');
const COMPLAINT_STATES = require('../config/constants');
const { paginate } = require('../interfaces/IPagination');
const complaintRepository = require('../repositories/complaintRepository');

exports.getQuejasPaginadasForEntity = async (entidadId, page, limit) => {
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
    console.error(error);
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

exports.createQueja = async ({ texto, entity_id }) => {
  if (!texto || texto.trim().length < 10 || texto.trim().length > 2000) {
    throw new Error('La queja debe tener entre 10 y 2000 caracteres');
  }
  const entidad = await Entity.findByPk(entity_id);
  if (!entidad) {
    throw new Error('La entidad especificada no existe');
  }

  try {
    const nuevaQueja = await complaintRepository.createComplaint({
      description: texto.trim(),
      entity_id,
    });
    return nuevaQueja;
  } catch (error) {
    console.error('Error al crear la queja:', error);
    throw new Error('Error al crear la queja');
  }
};

exports.getReporteQuejasPorEntidad = async () => {
  try {
    const res = await Entity.findAll({
      attributes: [
        'id',
        'name',
        [
          Complaint.sequelize.fn(
            'COUNT',
            Complaint.sequelize.col('Complaints.id')
          ),
          'total_quejas',
        ],
      ],
      include: [
        {
          model: Complaint,
          attributes: [],
        },
      ],
      group: ['Entity.id'],
      order: [[Complaint.sequelize.literal('total_quejas'), 'DESC']],
    });
    return res;
  } catch (err) {
    console.error('Error generando reporte de quejas por entidad:', err);
    throw err;
  }
};

exports.deleteComplaint = async (complaintId) => {
  try {
    const complaint = await Complaint.findByPk(complaintId);
    if (complaint) {
      await complaint.update({ is_deleted: true });
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
