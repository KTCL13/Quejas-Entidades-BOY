const commentRepository = require('../repositories/commentRepository');
const { Complaint } = require('../models');

exports.getCommentsByComplaintId = async (complaintId) => {
  try {
    const complaint = await Complaint.findByPk(complaintId);
    if (!complaint) {
      throw new Error('La queja especificada no existe');
    }

    const comments = await complaint.getComments(); // Usa la relación definida en el modelo
    return comments;
  } catch (error) {
    console.error('Error al obtener comentarios:', error);
    throw new Error('Error al obtener los comentarios');
  }
};

exports.createCommentByComplaintId = async (complaintId, content) => {
  try {
    if (!content || content.trim().length === 0) {
      throw new Error('El comentario no puede estar vacío');
    }

    const complaint = await Complaint.findByPk(complaintId);
    if (!complaint) {
      throw new Error('La queja especificada no existe');
    }

    const newComment = await commentRepository.createCommentByComplaintId(
      complaintId,
      content.trim()
    );

    return newComment;
  } catch (error) {
    console.error('Error al crear comentario:', error);
    throw new Error('Error al crear el comentario');
  }
};
