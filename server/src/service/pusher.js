const Pusher = require('pusher');
require('dotenv').config(); // Load environment variables

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});

const triggerPriceUpdate = (symbols, symbol, event, priceData) => {
  let channel = 'prices-channel';

  if (symbol === symbols.aSymbol) {
    channel = 'prices-channel-aSymbol';
  } else if (symbol === symbols.bSymbol) {
    channel = 'prices-channel-bSymbol';
  }

  const priceInfo = {
    priceData,
    timestamp: new Date().toISOString(),
  };

  pusher
    .trigger(channel, event, priceInfo)
    .then(() => {
      console.log(`Price update triggered for channel ${channel}:`);
    })
    .catch((err) => {
      console.error('Error triggering Pusher event:', err);
    });
};

module.exports = {
  triggerPriceUpdate,
};
