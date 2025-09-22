const { Complaint, Entity } = require('../models');
const { setEntitiesCache } = require('../config/cache');

// Obtener quejas paginadas por entidad
exports.getQuejasPaginadasForEntity = async (entidadId, page = 1, limit = 10) => {
  try {
    const offset = (page - 1) * limit;

    const { rows: quejas, count } = await Complaint.findAndCountAll({

      where: {
        entity_id: entidadId,
        is_deleted: false
      },

      include: [{
        model: Entity,
        attributes: ['name']
      }],
      order: [['id', 'ASC']],
      limit,
      offset
    });

    return {
      data: quejas,
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit)
    };
  } catch (error) {
    console.error(error);
    throw new Error('Error al obtener las quejas');
  }
};

// Cargar entidades en caché
exports.loadEntidades = async () => {
  const entidades = await Entity.findAll({
    order: [['name', 'ASC']]
  });
  setEntitiesCache(entidades);
};

// Obtener todas las entidades
exports.getEntidades = async () => {
  try {
    const entidades = await Entity.findAll({
      order: [['id', 'ASC']]
    });
    return entidades;
  } catch (error) {
    console.error(error);
    throw new Error('Error al obtener las entidades');
  }
};

// Registrar una nueva queja
exports.createQueja = async ({ texto, entity_id }) => {

  if (!texto || texto.trim().length < 10 || texto.trim().length > 2000) {
    throw new Error('La queja debe tener entre 10 y 2000 caracteres');
  }

  // Validar si la entidad existe
  const entidad = await Entity.findByPk(entity_id);

  if (!entidad) {
    throw new Error('La entidad especificada no existe');
  }

  const nuevaQueja = await Complaint.create({
    description: texto.trim(),
    entity_id
  });

  return nuevaQueja;
};

// Reporte: número de quejas por entidad
exports.getReporteQuejasPorEntidad = async () => {
  try {
    const res = await Entity.findAll({
      attributes: [
        'id',
        'name',

        [Complaint.sequelize.fn('COUNT', Complaint.sequelize.col('Complaints.id')), 'total_quejas']

      ],
      include: [{
        model: Complaint,
        attributes: []
      }],
      group: ['Entity.id'],
      order: [[Complaint.sequelize.literal('total_quejas'), 'DESC']]
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
    const complaint = await Complaint.findByPk(complaintId);
    if (complaint) {
      complaint.state = newState;
      await complaint.save();
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error al cambiar el estado de la queja:', error);
    throw new Error('Error al cambiar el estado de la queja');
  }
};
