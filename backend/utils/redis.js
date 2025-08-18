const Redis = require('ioredis');

let redis;
if (process.env.REDIS_URL) {
  redis = new Redis(process.env.REDIS_URL);
  redis.on('error', err => {
    console.error('Redis connection error:', err.message);
  });
}

module.exports = redis;
