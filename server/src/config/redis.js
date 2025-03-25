const IORedis = require('ioredis');
const { REDIS_URL } = require('./env');

let connection = null;

const getRedisConnection = () => {
  if (!connection) {
    connection = new IORedis(REDIS_URL, {
      maxRetriesPerRequest: null,
    });

    connection.on('connect', () => {
      console.log('✅ Redis Connected');
    });

    connection.on('error', (err) => {
      console.error(`❌ Redis Error: ${err.message}`);
    });
  }
  return connection;
};

module.exports = { getRedisConnection };
