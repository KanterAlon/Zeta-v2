const redis = require('./redis');

const CACHE_THRESHOLD = parseInt(process.env.CACHE_THRESHOLD || '3', 10);
const CACHE_TTL = 15778800; // 24 hours

async function readCache(key) {
  if (!redis) {
    return { data: null, source: 'openfoodfacts', freq: 0 };
  }
  const freqKey = `freq:${key}`;
  try {
    const freq = await redis.incr(freqKey);
    if (freq === 1) await redis.expire(freqKey, CACHE_TTL);
    console.log('📦 Revisando cache para', key);
    const cached = await redis.get(key);
    if (cached) {
      console.log('✅ Cache hit para', key);
      return { data: JSON.parse(cached), source: 'cache', freq };
    }
    console.log('❌ Cache miss para', key);
    return { data: null, source: 'openfoodfacts', freq };
  } catch (err) {
    console.error('Redis read error:', err.message);
    return { data: null, source: 'openfoodfacts', freq: 0 };
  }
}

async function writeCache(key, value, freq) {
  if (!redis || freq < CACHE_THRESHOLD) return;
  try {
    console.log('💾 Guardando en cache para', key);
    await redis.setex(key, CACHE_TTL, JSON.stringify(value));
  } catch (err) {
    console.error('Redis write error:', err.message);
  }
}

module.exports = { readCache, writeCache };
