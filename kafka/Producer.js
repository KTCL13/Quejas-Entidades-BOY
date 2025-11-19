const { kafkajs } = require('./config');
const EVENTS = require('../constants/events');
const e = require('express');

const producer = kafkajs.producer();

const connectProducer = async () => await producer.connect();

const emitReportVisited = async (req) => {
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