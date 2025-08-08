// Este archivo exporta la aplicación Express para que Vercel pueda
// ejecutarla como función serverless.
// Requerimos la app desde el backend y la exportamos tal cual.

const app = require('../backend/app');

module.exports = app;
