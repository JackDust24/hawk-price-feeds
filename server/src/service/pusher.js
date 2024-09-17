const Pusher = require('pusher');
require('dotenv').config(); // Load environment variables

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});

const triggerPriceUpdate = (symbol, event, price) => {
  let channel;

  if (symbol === 'AAPL') {
    channel = 'prices-channel-aapl';
  } else if (symbol === 'GOOGL') {
    channel = 'prices-channel-googl';
  }

  const priceData = {
    symbol,
    price,
    timestamp: new Date().toISOString(),
  };

  pusher
    .trigger(channel, event, priceData)
    .then(() => {
      console.log(`Price update triggered for channel ${channel}:`, priceData);
    })
    .catch((err) => {
      console.error('Error triggering Pusher event:', err);
    });
};

module.exports = {
  triggerPriceUpdate,
};
