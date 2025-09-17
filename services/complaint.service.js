const { complaint, Entity } = require('../models');
const { setCacheEntities } = require('../config/cache');

// Obtener quejas paginadas por entity
exports.getPaginatedcomplaintForEntity = async (entityId, page = 1, limit = 10) => {
  try {
    const offset = (page - 1) * limit;

    const { rows: complaint, count } = await complaint.findAndCountAll({
      where: { Id_entity: entityId },
      include: [{
        model: Entity,
        attributes: ['nombre_entity']
      }],
      order: [['id_queja', 'ASC']],
      limit,
      offset
    });

    return {
      data: complaint,
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
    order: [['nombre_entity', 'ASC']]
  });
  setCacheEntities(entity);
};

// Obtener todas las entities
exports.getEntities = async () => {
  try {
    const entities = await Entity.findAll({
      order: [['id_entity', 'ASC']]
    });
    return entities;
  } catch (error) {
    console.error(error);
    throw new Error('Error al obtener las entities');
  }
};

// Registrar una nueva queja
exports.createComplaint = async ({ text, Id_entity }) => {
  if (!text || text.trim().length < 10 || text.trim().length > 2000) {
    throw new Error('La queja debe tener entre 10 y 2000 caracteres');
  }

  // Validar si la entity existe
  const entity = await Entity.findByPk(Id_entity);
  if (!entity) {
    throw new Error('La entity especificada no existe');
  }

  // Insertar queja
  const newComplaint = await complaint.create({
    descripcion_queja: text.trim(),
    Id_entity
  });

  return newComplaint;
};

// Reporte: número de quejas por entity
exports.getcomplaintReportByEntity = async () => {
  try {
    const res = await Entity.findAll({
      attributes: [
        'id_entidad',
        'nombre_entidad',
        [complaint.sequelize.fn('COUNT', complaint.sequelize.col('Quejas.id_queja')), 'total_quejas']
      ],
      include: [{
        model: complaint,
        attributes: []
      }],
      group: ['Entidad.id_entidad'],
      order: [[complaint.sequelize.literal('total_quejas'), 'DESC']]
    });
    return res;
  } catch (err) {
    console.error('Error generando reporte de quejas por entity:', err);
    throw err;
  }
};




