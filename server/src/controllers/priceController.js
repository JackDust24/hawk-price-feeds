const axios = require('axios');

//TODO: Set up different ranges from the frontend
const fetchCryptoPrice = async (symbol, priceData) => {
  const { multiplier, timespan, from, to } = priceData;
  console.log('*** fetchCryptoPrice', symbol, multiplier, timespan, from, to);
  const stringMultiplieer = multiplier.toString();
  try {
    const response = await axios.get(
      `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/${stringMultiplieer}/${timespan}/${from}/${to}?adjusted=true&sort=asc&apiKey=peyli5lwqrtJKLB1FECwNFqfMZVsK_DN`
    );
    if (response.data?.results?.length === 0) {
      console.error('Nothing returned', err);
      return null;
    }
    return response.data;
  } catch (err) {
    console.error('Error fetching price:', err);
    return err;
  }
};

module.exports = fetchCryptoPrice;
