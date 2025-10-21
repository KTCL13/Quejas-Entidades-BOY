const Comment = require('../models/Comment');

exports.findByComplaintId = async (complaintId) => {
  try {
    return await Comment.findAll({
      where: { complaint_id: complaintId },
    });
  } catch (error) {
    console.error('Error en CommentRepository.findByComplaintId:', error);
    throw error;
  }
};
