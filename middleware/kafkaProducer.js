const { Kafka, Partitioners } = require('kafkajs');
const EVENTS = require('../constants/events');

const kafka = new Kafka({
  clientId: 'complaint-service',
  brokers: [process.env.KAFKA_BROKER],
});

const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner,
});

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

module.exports = { connectProducer, emitReportVisited };
