const commentRepository = require('../repositories/commentRepository');
const complaintRepository = require('../repositories/complaintRepository');

exports.getCommentsByComplaintId = async (complaintId) => {
  try {
    const complaint = await complaintRepository.getComplaintById(complaintId);
    if (!complaint) {
      throw new Error('La queja especificada no existe');
    }

    const comments = await commentRepository.findByComplaintId(complaintId);
    return comments;
  } catch (error) {
    console.error('Error en CommentService.getCommentsByComplaintId:', error);
    throw error;
  }
};

exports.createCommentByComplaintId = async (complaintId, message) => {
  try {
    if (!message || message.trim().length === 0) {
      throw new Error('El comentario no puede estar vacío');
    }

    const complaint = await complaintRepository.getComplaintById(complaintId);
    if (!complaint) {
      throw new Error('La queja especificada no existe');
    }

    const newComment = await commentRepository.create({
      complaint_id: complaintId,
      message: message.trim(),
    });

    return newComment;
  } catch (error) {
    console.error('Error en CommentService.createCommentByComplaintId:', error);
    throw new Error('Error al crear el comentario');
  }
};
