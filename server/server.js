require('dotenv').config(); // Load environment variables
const cors = require('cors');

const express = require('express');
const bodyParser = require('body-parser');
const { triggerPriceUpdate } = require('./src/service/pusher');
const app = express();
const FRONTEND_URL = process.env.FRONTEND_URL ?? 'http://localhost:3000';

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);
app.use(bodyParser.json());

app.post('/api/price-update', (req, res) => {
  console.log('Received price update request:', req.body);
  const { channel, event, priceData } = req.body;

  triggerPriceUpdate(channel, event, priceData);

  res.status(200).send('Price update broadcasted');
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
