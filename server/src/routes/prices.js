const express = require('express');
const router = express.Router();
const { triggerPriceUpdate } = require('../service/pusher');
const fetchCryptoPrice = require('../controllers/priceController');
const { sendToKafka } = require('../service/kafka');

router.post('/price-update', async (req, res) => {
  const { event, priceData } = req.body;
  console.log('*** request >', event, priceData);

  let latestPrices = [];
  let symbols = {};

  try {
    if (!priceData || !event || !priceData.symbols) {
      throw new Error('Invalid request body');
    }
    symbols = {
      aSymbol: priceData.symbols[0],
      bSymbol: priceData.symbols[1],
    };

    const response = (latestPrices = await Promise.all(
      priceData.symbols.map(async (symbol) => {
        try {
          const data = await fetchCryptoPrice(symbol, priceData);
          console.log('*** data', data);
          return {
            symbol: symbol,
            data: data,
          };
        } catch (error) {
          console.error('**** Error fetching price:', error);
          res.status(429).send('Invalid request');
          return;
        }
      })
    ));
    console.log('**** response from call', response);
  } catch (error) {
    console.error('Error validating request body:', error);
    res.status(400).send('Invalid request body');
    return;
  }

  const filteredPrices = latestPrices.filter((stock) => Boolean(stock.data));
  if (filteredPrices.length === 0) {
    res.status(500).send('Error fetching prices');
    return;
  }
  console.log('*** filteredPrices', symbols, filteredPrices);

  filteredPrices.forEach((updatedPriceData, index) => {
    sendToKafka(symbols, updatedPriceData.symbol[index], updatedPriceData);
    triggerPriceUpdate(
      symbols,
      updatedPriceData.symbol,
      event,
      updatedPriceData.data
    );
  });

  console.log('filteredPrices', filteredPrices);

  res.status(200).send({
    message: 'Price update broadcasted',
    status: 'success',
  });
});

module.exports = router;
