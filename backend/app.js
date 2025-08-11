const express = require('express');
const cors = require('cors');
const session = require('express-session');
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const homeRoutes = require('./routes/home.routes');
const cameraRoutes = require('./routes/camera.routes');

// Cargar variables de entorno
dotenvExpand.expand(dotenv.config({ path: '.env.secrets' }));
dotenvExpand.expand(dotenv.config({ path: '.env', override: true }));

// Lista de orígenes permitidos para solicitudes CORS.  
// Incluye dominios de desarrollo y los dominios de producción actuales
// que utilizan la marca «Nut». De este modo, el backend aceptará peticiones
// del frontend tanto en localhost como en Vercel.
const allowedOrigins = [
  'http://localhost:5174', // puerto alternativo para desarrollo
  'http://localhost:5173', // desarrollo local
  'https://nut-frontend.vercel.app', // dominio de staging/preview
  'https://nutweb.vercel.app', // dominio principal de producción
  'https://zeta-v2-frontend.vercel.app', // dominio de staging/preview
  'https://zeta-v2.vercel.app', // dominio principal de producción
  'https://nut-backend.vercel.app'
];

const app = express();
const PORT = process.env.PORT || 3000;

// 🌐 CORS con cookies
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// 🔐 JSON y Sesión
app.use(express.json());

app.use(session({
  secret: 'zeta_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  }
}));

// 📦 Rutas
app.use('/api', homeRoutes);
app.use('/api/camera', cameraRoutes);

// 🏠 Ruta base
app.get('/', (req, res) => {
  res.send('API activa');
});

// 🛡️ Iniciar servidor cuando no se esté ejecutando en un entorno serverless.
// En Vercel exportamos la app sin escuchar el puerto, ya que Vercel gestiona
// la función como un handler. En desarrollo (`npm run dev`), arrancamos
// explícitamente el servidor.
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
  });
}

// Exportamos la app para los runtimes serverless
module.exports = app;
