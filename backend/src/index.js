require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Ruta raíz para verificar que el servidor corre
app.get('/', (req, res) => {
  res.send('🚀 Backend corriendo con conexión a Railway y Prisma');
});


// 📍 Rutas básicas de ejemplo (se pueden expandir)

/// --- USUARIOS --- ///
app.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await prisma.usuarios.findMany();
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

app.post('/usuarios', async (req, res) => {
  const { nombre, email } = req.body;
  try {
    const nuevo = await prisma.usuarios.create({
      data: { nombre, email },
    });
    res.json(nuevo);
  } catch (error) {
    res.status(400).json({ error: 'No se pudo crear el usuario' });
  }
});

/// --- POSTS --- ///
app.get('/posts', async (req, res) => {
  try {
    const posts = await prisma.posts.findMany({
      include: { usuario: true, comentarios: true }
    });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener posts' });
  }
});

app.post('/posts', async (req, res) => {
  const { id_usuario, contenido_post } = req.body;
  try {
    const nuevoPost = await prisma.posts.create({
      data: {
        id_usuario,
        contenido_post,
        fecha_creacion: new Date()
      }
    });
    res.json(nuevoPost);
  } catch (err) {
    res.status(400).json({ error: 'Error al crear el post' });
  }
});

// Más rutas se pueden agregar fácilmente copiando la estructura de arriba

// 🔁 Puerto y servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
