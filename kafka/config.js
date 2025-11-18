// kafka/config.js
const { Kafka, logLevel } = require('kafkajs');
const EVENTS = require('..//constants/events');

const kafkajs = new Kafka({
  clientId: 'complaint-service',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
  logLevel: logLevel.INFO,
});

const admin = kafkajs.admin();

const TOPIC_CONFIGS = {
  [EVENTS.REPORT_VISITED]: {
    configEntries: [
      { name: 'retention.ms', value: '3600000' }, // 1 hora
      { name: 'cleanup.policy', value: 'delete' },
      { name: 'segment.ms', value: '60000' }, // 1 minuto
      { name: 'delete.retention.ms', value: '60000' },
    ],
  },
  [EVENTS.COMPLAINT_STATE_CHANGED]: {
    configEntries: [
      { name: 'retention.ms', value: '-1' }, // Infinito
      { name: 'cleanup.policy', value: 'compact' },
      { name: 'segment.ms', value: '604800000' }, // 7 días
      { name: 'min.compaction.lag.ms', value: '0' },
      { name: 'delete.retention.ms', value: '86400000' }, // 1 día
    ],
  },
};

async function createTopics() {
  await admin.connect();

  try {
    const topics = Object.entries(TOPIC_CONFIGS).map(([topic, config]) => ({
      topic,
      ...config,
    }));

    await admin.createTopics({
      topics,
      waitForLeaders: true,
    });

    console.log('Tópicos creados exitosamente');
  } catch (error) {
    if (error.type === 'TOPIC_ALREADY_EXISTS') {
      console.log('Los tópicos ya existen');
    } else {
      console.error('Error creando tópicos:', error);
      throw error;
    }
  } finally {
    await admin.disconnect();
  }
}

module.exports = { kafkajs, createTopics };
