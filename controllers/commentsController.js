const { getCommentsByComplaintId } = require('../services/comment.service');

export const getCommentsByComplaintIdController = async (req, res, next) => {
  try {
    const complaintId = req.params.id;
    const comments = await getCommentsByComplaintId(complaintId);
    return res.json(comments);
  } catch (error) {
    next(error);
  }
};
