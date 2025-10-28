const { Comment } = require('../models');

const commentRepository = {
  async findByComplaintId(complaintId) {
    try {
      return await Comment.findAll({
        where: { complaint_id: complaintId },
      });
    } catch (error) {
      console.error('Error en commentRepository.findByComplaintId:', error);
      throw error;
    }
  },

  async create(commentData) {
    try {
      return await Comment.create(commentData);
    } catch (error) {
      console.error('Error en commentRepository.create:', error);
      throw error;
    }
  },
};

module.exports = commentRepository;
