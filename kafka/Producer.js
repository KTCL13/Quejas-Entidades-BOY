const { kafkajs } = require('./config');
const EVENTS = require('../constants/events');
const logger = require('../uttils/logger');

const producer = kafkajs.producer();

const connectProducer = async () => await producer.connect();

const emitReportVisited = async (req) => {
  logger.info(`Emitiendo evento ReportVisited ${req.method} ${req.path}`);
  const eventData = {
    timestamp: new Date().toISOString(),
    ipAddress: req.ip,
    method: req.method,
    path: req.path,
  };

  await producer.send({
    topic: EVENTS.REPORT_VISITED,
    messages: [
      {
        value: JSON.stringify(eventData),
        timestamp: Date.now(),
      },
    ],
  });
  logger.info(
    `Evento emitido con exito ReportVisited ${req.method} ${req.path}`
  );
};

const emitComplaintStateChanged = async (
  complaintId,
  complaintDescription,
  entityName,
  previousState,
  newState,
  changedBy
) => {
  const eventData = {
    complaintId,
    complaintDescription,
    entityName,
    previousState,
    newState,
    changedBy,
    timestamp: new Date().toISOString(),
  };
  logger.info(
    'Emitiendo evento ComplaintStateChanged' + JSON.stringify(eventData)
  );

  await producer.send({
    topic: EVENTS.COMPLAINT_STATE_CHANGED,
    messages: [
      {
        key: complaintId,
        value: JSON.stringify(eventData),
        timestamp: Date.now(),
      },
    ],
  });

  logger.info('Evento ComplaintStateChanged emitido con éxito');
};

async function disconnectProducer() {
  await producer.disconnect();
}

module.exports = {
  connectProducer,
  emitReportVisited,
  emitComplaintStateChanged,
  disconnectProducer,
};
