require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Ruta base para verificar que el servidor esté activo
app.get('/', (req, res) => {
  res.send('🚀 Backend corriendo correctamente');
});

// Obtener todos los usuarios
app.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany();
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// Crear un nuevo usuario
app.post('/usuarios', async (req, res) => {
  const { nombre, email } = req.body;
  try {
    const nuevoUsuario = await prisma.usuario.create({
      data: { nombre, email },
    });
    res.json(nuevoUsuario);
  } catch (error) {
    res.status(400).json({ error: 'No se pudo crear el usuario' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
