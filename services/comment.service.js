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
    console.error('Error al obtener comentarios:', error);
    throw new Error('Error al obtener los comentarios');
  }
};

exports.createCommentByComplaintId = async (complaintId, content) => {
  try {
    if (!content || content.trim().length === 0) {
      throw new Error('El comentario no puede estar vacío');
    }


    const complaint = await complaintRepository.getComplaintById(complaintId);
    if (!complaint) {
      throw new Error('La queja especificada no existe');
    }

    const newComment = await commentRepository.create({
      complaint_id: complaintId,
      content: content.trim(),
    });

    return newComment;
  } catch (error) {
    console.error('Error al crear comentario:', error);
    throw new Error('Error al crear el comentario');
  }
};
