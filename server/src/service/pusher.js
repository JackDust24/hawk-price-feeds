const Pusher = require('pusher');
require('dotenv').config(); // Load environment variables

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});

const triggerPriceUpdate = (channel, event, data) => {
  pusher
    .trigger(channel, event, data)
    .then(() => {
      console.log(`Price update triggered for channel ${channel}:`, data);
    })
    .catch((err) => {
      console.error('Error triggering Pusher event:', err);
    });
};

module.exports = {
  triggerPriceUpdate,
};
