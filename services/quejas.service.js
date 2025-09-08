const { Queja, Entidad } = require('../models');
const { setEntidadesCache } = require('../config/cache');

// Obtener quejas paginadas por entidad
exports.getQuejasPaginadasForEntity = async (entidadId, page = 1, limit = 10) => {
  try {
    const offset = (page - 1) * limit;

    const { rows: quejas, count } = await Queja.findAndCountAll({
      where: { id_entidad: entidadId },
      include: [{
        model: Entidad,
        attributes: ['nombre_entidad']
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
  const entidades = await Entidad.findAll({
    order: [['nombre_entidad', 'ASC']]
  });
  setEntidadesCache(entidades);
};

// Obtener todas las entidades
exports.getEntidades = async () => {
  try {
    const entidades = await Entidad.findAll({
      order: [['id_entidad', 'ASC']]
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
  const entidad = await Entidad.findByPk(id_entidad);
  if (!entidad) {
    throw new Error('La entidad especificada no existe');
  }

  // Insertar queja
  const nuevaQueja = await Queja.create({
    descripcion_queja: texto.trim(),
    id_entidad
  });

  return nuevaQueja;
};

// Reporte: número de quejas por entidad
exports.getReporteQuejasPorEntidad = async () => {
  try {
    const res = await Entidad.findAll({
      attributes: [
        'id_entidad',
        'nombre_entidad',
        [Queja.sequelize.fn('COUNT', Queja.sequelize.col('Quejas.id_queja')), 'total_quejas']
      ],
      include: [{
        model: Queja,
        attributes: []
      }],
      group: ['Entidad.id_entidad'],
      order: [[Queja.sequelize.literal('total_quejas'), 'DESC']]
    });
    return res;
  } catch (err) {
    console.error('Error generando reporte de quejas por entidad:', err);
    throw err;
  }
};




