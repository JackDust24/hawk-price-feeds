const axios = require('axios');

//TODO: Set up different ranges from the frontend
const fetchCryptoPrice = async (symbol) => {
  try {
    const response = await axios.get(
      `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/2/hour/2024-04-09/2024-04-10?adjusted=true&sort=asc&apiKey=peyli5lwqrtJKLB1FECwNFqfMZVsK_DN`
    );
    if (response.data?.results?.length === 0) {
      console.error('Nothing returned', err);
      return null;
    }
    return response.data.results[0].c;
  } catch (err) {
    console.error('Error fetching crypto price:', err);
    return null;
  }
};

module.exports = fetchCryptoPrice;
