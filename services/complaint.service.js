const { complaints, Entity } = require('../models');
const { setCacheEntities } = require('../config/cache');

// Obtener quejas paginadas por entidad
exports.getPaginatedComplaintsForEntity = async (entityId, page = 1, limit = 10) => {
  try {
    const offset = (page - 1) * limit;

    const { rows: complaints, count } = await complaints.findAndCountAll({
      where: { Id_entity: entityId },
      include: [{
        model: Entity,
        attributes: ['name_entity']
      }],
      order: [['id_queja', 'ASC']],
      limit,
      offset
    });

    return {
      data: complaints,
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

// Cargar entities en caché
exports.loadEntities = async () => {
  const entity = await Entity.findAll({
    order: [['name_entity', 'ASC']]
  });
  setCacheEntities(entity);
};

// Obtener todas las entities
exports.getEntities = async () => {
  try {
    const entities = await Entity.findAll({
      order: [['Id_entity', 'ASC']]
    });
    return entities;
  } catch (error) {
    console.error(error);
    throw new Error('Error al obtener las entities');
  }
};

// Registrar una nueva queja
exports.createComplaint = async ({ texto, Id_entity }) => {
  if (!texto || texto.trim().length < 10 || texto.trim().length > 2000) {
    throw new Error('La queja debe tener entre 10 y 2000 caracteres');
  }

  // Validar si la entidad existe
  const entidad = await Entity.findByPk(Id_entity);
  if (!entidad) {
    throw new Error('La entidad especificada no existe');
  }

  // Insertar queja
  const nuevaQueja = await complaints.create({
    descripcion_queja: texto.trim(),
    Id_entity
  });

  return nuevaQueja;
};

// Reporte: número de quejas por entidad
exports.getComplaintsReportByEntity = async () => {
  try {
    const res = await Entity.findAll({
      attributes: [
        'Id_entity',
        'name_entity',
        [complaints.sequelize.fn('COUNT', complaints.sequelize.col('Quejas.id_queja')), 'total_quejas']
      ],
      include: [{
        model: complaints,
        attributes: []
      }],
      group: ['Entidad.Id_entity'],
      order: [[complaints.sequelize.literal('total_quejas'), 'DESC']]
    });
    return res;
  } catch (err) {
    console.error('Error generando reporte de quejas por entidad:', err);
    throw err;
  }
};




