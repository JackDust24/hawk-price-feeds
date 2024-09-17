require('dotenv').config(); // Load environment variables
const cors = require('cors');

const express = require('express');
const bodyParser = require('body-parser');
const prices = require('./src/routes/prices');
const app = express();
const { startConsumer } = require('./src/service/kafka');
const { kafkaInit } = require('./src/service/kafkaClient');

const FRONTEND_URL = process.env.FRONTEND_URL ?? 'http://localhost:3000';

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);
app.use(bodyParser.json());

app.use('/api', prices);

const init = async () => {
  await kafkaInit();
  await startConsumer('prices-consumer', 'stock-prices');
};

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  init();
});
