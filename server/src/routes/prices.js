const express = require('express');
const router = express.Router();
const { triggerPriceUpdate } = require('../service/pusher');
const fetchCryptoPrice = require('../controllers/priceController');
const { sendToKafka } = require('../service/kafka');

router.post('/price-update', async (req, res) => {
  const { event, priceData } = req.body;

  let latestPrices = [];

  try {
    if (!priceData || !event || !priceData.symbols) {
      throw new Error('Invalid request body');
    }
    latestPrices = await Promise.all(
      priceData.symbols.map(async (symbol) => {
        return { symbol: symbol, price: await fetchCryptoPrice(symbol) };
      })
    );
  } catch (error) {
    console.error('Error validating request body:', error);
    res.status(400).send('Invalid request body');
    return;
  }

  const filteredPrices = latestPrices.filter((stock) => Boolean(stock.price));

  filteredPrices.forEach((updatedPriceData, index) => {
    sendToKafka(updatedPriceData.symbol, updatedPriceData);
    triggerPriceUpdate(updatedPriceData.symbol, event, updatedPriceData.price);
  });

  res.status(200).send('Price update broadcasted');
});

module.exports = router;
