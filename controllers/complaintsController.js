const logger = require('../uttils/logger');
const {
  getComplaintById,
  createComplaint,
  getComplaintListByEntity,
  deleteComplaint,
  changeComplaintState,
} = require('../services/quejas.service');

const { emitComplaintStateChanged } = require('../kafka/Producer');

exports.getComplaintByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;
    logger.debug(`Obteniendo queja con ID: ${id}`);
    const complaint = await getComplaintById(id);
    logger.info(`Queja obtenida exitosamente: ${id}`);
    return res.status(200).json(complaint);
  } catch (error) {
    logger.error(`Error obteniendo queja ${req.params.id}`, {
      error: error.message,
    });
    next(error);
  }
};

exports.createComplaintController = async (req, res, next) => {
  try {
    const complaintData = req.body;
    logger.debug('Creando nueva queja', { entityId: complaintData.entityId });
    const newComplaint = await createComplaint(complaintData);
    logger.info(`Queja creada exitosamente con ID: ${newComplaint.id}`);
    return res.status(201).json(newComplaint);
  } catch (error) {
    logger.error('Error creando queja', {
      error: error.message,
      entityId: req.body?.entityId,
    });
    next(error);
  }
};

exports.getComplaintListController = async (req, res, next) => {
  try {
    const entityId = parseInt(req.query.entidadId, 10);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    logger.debug(
      `Obteniendo quejas - Entity: ${entityId}, Page: ${page}, Limit: ${limit}`
    );
    const complaints = await getComplaintListByEntity(entityId, page, limit);
    logger.info(
      `Listado de quejas obtenido - Total: ${complaints.total}, Entity: ${entityId}`
    );
    return res.status(200).json(complaints);
  } catch (error) {
    logger.error('Error obteniendo listado de quejas', {
      error: error.message,
      entityId: req.query.entidadId,
    });
    next(error);
  }
};

exports.deleteComplaintController = async (req, res, next) => {
  try {
    const complaintId = req.params.complaintId;
    logger.debug(`Eliminando queja con ID: ${complaintId}`);
    await deleteComplaint(complaintId);
    logger.info(`Queja eliminada exitosamente: ${complaintId}`);
    return res.status(200).json({ message: 'Queja eliminada correctamente.' });
  } catch (error) {
    logger.error(`Error eliminando queja ${req.params.complaintId}`, {
      error: error.message,
    });
    next(error);
  }
};

exports.changeComplaintStateController = async (req, res, next) => {
  try {
    const { newState } = req.body;
    const complaintId = req.params.complaintId;
    const complaint = await getComplaintById(complaintId);
    const changedBy = req.header('x-useremail');
    await changeComplaintState(complaintId, newState);
    emitComplaintStateChanged(
      complaint.id,
      complaint.description,
      complaint.Entity.name,
      complaint.state,
      newState,
      changedBy
    );
    logger.info(
      `Estado de queja actualizado: ${complaintId}, ${complaint.state} -> ${newState}`
    );
    return res.json({
      message: 'Estado de la queja actualizado correctamente.',
    });
  } catch (error) {
    logger.error(`Error cambiando estado de queja ${req.params.complaintId}`, {
      error: error.message,
      newState: req.body?.newState,
    });
    next(error);
  }
};
