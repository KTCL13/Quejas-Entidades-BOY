/**
 * Aplica paginación a una consulta de Sequelize.
 *
 * @param {object} params - Los parámetros para la paginación.
 * @param {object} params.model - El modelo de Sequelize sobre el que se va a consultar.
 * @param {number} params.page - El número de la página actual (ej: 1, 2, 3).
 * @param {number} params.pageSize - La cantidad de elementos por página.
 * @param {object} [params.options={}] - Opciones adicionales para la consulta de Sequelize (where, include, order, etc.).
 * @returns {Promise<object>} Un objeto con los datos paginados y la información de paginación.
 */
exports.paginate = async ({ model, page, pageSize, options = {} }) => {
  try {
    const currentPage = parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
    const limit = parseInt(pageSize, 10) > 0 ? parseInt(pageSize, 10) : 10;
    const offset = (currentPage - 1) * limit;

    const { count, rows } = await model.findAndCountAll({
      ...options,
      offset,
      limit,
    });

    const totalPages = Math.ceil(count / limit);

    return {
      data: rows,
      pagination: {
        totalItems: count,
        totalPages,
        currentPage,
        pageSize: limit,
      },
    };
  } catch (err) {
    console.error('Error en la función de paginación:', err);
    throw err;
  }
};
