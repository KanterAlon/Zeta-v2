const Redis = require('ioredis');
let redis;
let redisUrl = process.env.REDIS_URL || process.env.UPSTASH_REDIS_URL;

if (!redisUrl && process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  // Construir la URL rediss://default:<token>@<host> a partir de las variables REST
  const url = new URL(process.env.UPSTASH_REDIS_REST_URL.replace(/^https?:\/\//, 'rediss://'));
  url.username = 'default';
  url.password = process.env.UPSTASH_REST_TOKEN;
  redisUrl = url.toString();
}

if (redisUrl) {
  redis = new Redis(redisUrl);
  redis.on('connect', () => console.log('✅ Redis conectado'));
  redis.on('error', err => console.error('Redis connection error:', err.message));
} else {
  console.log('⚠️ REDIS_URL no configurado, cache deshabilitado');
}

module.exports = redis;
