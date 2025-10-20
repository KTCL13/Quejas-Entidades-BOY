const { Comment } = require('../models');
const { Complaint } = require('../models');

async function createCommentByComplaintId(complaintId, content) {
  try {
    const complaint = await Complaint.findByPk(complaintId);

    if (!complaint) {
      throw new Error('La queja especificada no existe');
    }

    const newComment = await Comment.create({
      complaint_id: complaintId,
      content,
    });

    return newComment;
  } catch (error) {
    console.error('Error en createCommentByComplaintId (repository):', error);
    throw error;
  }
}

module.exports = {
  createCommentByComplaintId,
};
