const { Kafka, Partitioners, logLevel } = require('kafkajs');
const { kafkaClient } = require('./kafkaClient');

const producer = kafkaClient.producer({
  createPartitioner: Partitioners.LegacyPartitioner,
});

//TODO: Redo this as no longer specific symbols
const sendToKafka = async (symbols, symbol, price) => {
  let partition = 0;

  if (symbol === symbols.aSymbol) {
    partition = 0;
  } else if (symbol === symbols.bSymbol) {
    partition = 1;
  }

  console.log('*** sendToKafka', symbols, symbol, price, partition);

  try {
    await producer.connect();
    await producer.send({
      topic: 'stock-prices',
      messages: [
        {
          key: JSON.stringify(symbol),
          value: JSON.stringify(price),
          partition: parseInt(partition),
        },
      ],
    });
    console.log(
      `KAFKA: Sent ${symbol} price update to partition ${partition} `
    );
  } catch (err) {
    console.error('Error sending message to Kafka:', err);
  } finally {
    await producer.disconnect();
    console.log('Kafka producer disconnected');
  }
};

async function startConsumer(groupId, topics) {
  try {
    const consumer = kafkaClient.consumer({
      groupId: groupId,
      autoOffsetReset: 'earliest',
    });

    await consumer.connect();

    await consumer.subscribe({ topic: topics, fromBeginning: true });

    // Start consuming messages
    consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          console.log(
            `topic: ${topic}, Partition: ${partition}, Offset: ${message.offset}`
          );

          //TODO: We will use Kaflka to log this into a database or something
          const priceData = JSON.parse(message.value);
          if (partition === 0) {
            console.log('Received price update:', priceData);
          } else if (partition === 1) {
            console.log('Received price update:', priceData);
          }
        } catch (err) {
          console.error('Error processing Kafka message:', err);
        }
      },
    });

    console.log('Kafka consumer started and subscribed to topic');
  } catch (error) {
    console.error('Error starting Kafka consumer:', error);
  }
}

process.on('SIGINT', async () => {
  console.log('Gracefully shutting down...');
  await consumer.disconnect();
  console.log('Kafka consumer disconnected');
  process.exit(0);
});

module.exports = { sendToKafka, startConsumer };
