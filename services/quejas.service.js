const { Complaint, Entity } = require('../models');
const { setEntidadesCache } = require('../config/cache');

// Obtener quejas paginadas por entidad
exports.getQuejasPaginadasForEntity = async (entidadId, page = 1, limit = 10) => {
  try {
    const offset = (page - 1) * limit;

    const { rows: quejas, count } = await Complaint.findAndCountAll({
      where: { id_entidad: entidadId },
      include: [{
        model: Entity,
        attributes: ['name']
      }],
      order: [['id_queja', 'ASC']],
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
  setEntidadesCache(entidades);
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
exports.createQueja = async ({ texto, id_entidad }) => {
  if (!texto || texto.trim().length < 10 || texto.trim().length > 2000) {
    throw new Error('La queja debe tener entre 10 y 2000 caracteres');
  }

  // Validar si la entidad existe
  const entidad = await Entity.findByPk(id_entidad);

  if (!entidad) {
    throw new Error('La entidad especificada no existe');
  }


  const nuevaQueja = await Complaint.create({
    descripcion_queja: texto.trim(),
    id_entidad
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
        [Complaint.sequelize.fn('COUNT', Complaint.sequelize.col('Complaints.id_queja')), 'total_quejas']
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




