const {
  getCommentsByComplaintId,
  createCommentByComplaintId,
} = require('../services/comment.service');

export const getCommentsByComplaintIdController = async (req, res, next) => {
  try {
    const complaintId = req.params.id;
    const comments = await getCommentsByComplaintId(complaintId);
    return res.json(comments);
  } catch (error) {
    next(error);
  }
};

export const createCommentByComplaintIdController = async (req, res, next) => {
  try {
    const complaintId = req.params.id;
    const { message } = req.body;
    const newComment = await createCommentByComplaintId(complaintId, message);
    return res.status(201).json(newComment);
  } catch (error) {
    next(error);
  }
};
