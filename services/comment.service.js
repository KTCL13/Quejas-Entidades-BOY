const Comment = require('../models/Comment');
const commentRepository = require('../repositories/commentRepository');

exports.getCommentsByComplaintId = async (complaintId) => {
  try {
    // Aquí puedes aplicar reglas de negocio (si las hubiera)
    const comments = await commentRepository.findByComplaintId(complaintId);
    return comments;
  } catch (error) {
    console.error('Error en CommentService.getCommentsByComplaintId:', error);
    throw error;
  }
};

exports.createCommentByComplaintId = async (complaintId, message) => {
  try {
    const newComment = await Comment.create({
      complaint_id: complaintId,
      message,
    });
    return newComment;
  } catch (error) {
    console.error('Error al crear comentario:', error);
    throw error;
  }
};
