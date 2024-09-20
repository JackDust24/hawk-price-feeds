const { Kafka, Partitioners, logLevel } = require('kafkajs');
// const ip = require('ip');

const HOST = process.env.HOST_IP || 'localhost';

const kafkaClient = new Kafka({
  clientId: 'price-update-client',
  brokers: [`${HOST}:9092`],
  // logLevel: logLevel.ERROR,
});

const kafkaInit = async () => {
  const admin = kafkaClient.admin();
  await admin.connect();
  await admin.createTopics({
    topics: [{ topic: 'stock-prices', numPartitions: 2 }],
  });
  await admin.disconnect();
};

module.exports = { kafkaClient, kafkaInit };
