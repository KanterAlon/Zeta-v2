const express = require('express');
const session = require('express-session');
const cors = require('cors');
const homeRoutes = require('./src/routes/home.routes');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

app.use(session({
  secret: 'zeta_secret_key',
  resave: false,
  saveUninitialized: true
}));

// ✅ Agregá esto para simular sesión
app.use((req, res, next) => {
  req.session.Usuario = 'test@email.com';
  next();
});

// Tus rutas
app.use('/api', homeRoutes);

app.listen(3000, () => {
  console.log('🚀 Servidor corriendo en http://localhost:3000');
});
