const Redis = require('ioredis');

let redis;
if (process.env.REDIS_URL) {
  redis = new Redis(process.env.REDIS_URL);
  redis.on('connect', () => {
    console.log('✅ Redis conectado');
  });
  redis.on('error', err => {
    console.error('Redis connection error:', err.message);
  });
} else {
  console.log('⚠️ REDIS_URL no configurado, cache deshabilitado');
}

module.exports = redis;
