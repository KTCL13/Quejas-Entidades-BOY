const Comment = require('../models/Comment');
 
exports.getCommentsByComplaintId = async (complaintId) => {
  try {
    const comments = await Comment.findAll({ where: { complaint_id: complaintId } });
    return comments;
  } catch (error) {
    console.error('Error al obtener comentarios:', error);
    throw error;
  }
};

exports.createCommentByComplaintId = async (complaintId, message) => {
  try {
    const newComment = await Comment.create({ complaint_id: complaintId, message });
    return newComment;
  } catch (error) {
    console.error('Error al crear comentario:', error);
    throw error;
  }
};
