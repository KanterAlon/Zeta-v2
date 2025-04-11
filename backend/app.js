const express = require('express');
const cors = require('cors');
const session = require('express-session');
const dotenv = require('dotenv');
const homeRoutes = require('./routes/home.routes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 🌐 CORS con cookies
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// 🔐 JSON y Sesión
app.use(express.json());

app.use(session({
  secret: 'zeta_secret', // Cambialo en producción
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // true si usás HTTPS
    httpOnly: true,
    sameSite: 'lax'
  }
}));

// 📦 Rutas
app.use('/api', homeRoutes);

// 🏠 Ruta base
app.get('/', (req, res) => {
  res.send('API activa');
});

// 🚀 Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
