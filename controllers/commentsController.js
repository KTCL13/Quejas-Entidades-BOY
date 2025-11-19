const logger = require('../uttils/logger');
const {
  getCommentsByComplaintId,
  createCommentByComplaintId,
} = require('../services/comment.service');

exports.getCommentsByComplaintIdController = async (req, res, next) => {
  try {
    const complaintId = req.params.id;
    logger.debug(`Obteniendo comentarios para queja: ${complaintId}`);
    const comments = await getCommentsByComplaintId(complaintId);
    logger.info(`Comentarios obtenidos exitosamente - Queja: ${complaintId}, Total: ${comments.length}`);
    return res.json(comments);
  } catch (error) {
    logger.error(`Error obteniendo comentarios de queja ${req.params.id}`, {
      error: error.message,
    });
    next(error);
  }
};

exports.createCommentByComplaintIdController = async (req, res, next) => {
  try {
    const complaintId = req.params.id;
    const { message } = req.body;
    logger.debug(`Creando comentario en queja: ${complaintId}`);
    const newComment = await createCommentByComplaintId(complaintId, message);
    logger.info(`Comentario creado exitosamente - Queja: ${complaintId}, Comentario ID: ${newComment.id}`);
    return res.status(201).json(newComment);
  } catch (error) {
    logger.error(`Error creando comentario en queja ${req.params.id}`, {
      error: error.message,
    });
    next(error);
  }
};
