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

const allowedOrigins = [
  'http://localhost:5174',   
  'http://localhost:5173',             // Para desarrollo local
  'https://zeta-v2-1.onrender.com'       // Tu frontend en producción
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

// 🚀 Iniciar servidor
app.listen(PORT);


