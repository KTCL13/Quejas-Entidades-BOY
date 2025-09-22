const Comment = require('../models/Comment');

 
exports.getCommentsByComplaintId = async (complaintId) => {
  try {
    const comments = await Comment.find({ complaintId });
    return comments;
  } catch (error) {
    console.error('Error al obtener comentarios:', error);
    throw error;
  }
};


