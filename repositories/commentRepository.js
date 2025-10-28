const { Comment } = require('../models');

const commentRepository = {
  async findByComplaintId(complaintId) {
    try {
      return await Comment.findAll({
        where: { complaint_id: complaintId },
      });
    } catch (error) {
      console.error('Error al obtener comentarios por ID de queja:', error);
      throw new Error('Error al obtener comentarios por ID de queja');
    }
  },

  async create(commentData) {
    try {
      return await Comment.create(commentData);
    } catch (error) {
      console.error('Error al crear comentario:', error);
      throw new Error('Error al crear comentario');
    }
  },
};

module.exports = commentRepository;
