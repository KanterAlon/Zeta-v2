process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const prisma = require('../prisma/client');
const axios = require('axios');

const homeController = {
  // 🔐 LOGIN
  login: async (req, res) => {
    const { email, password } = req.body;
    const usuario = await prisma.usuarios.findUnique({ where: { email } });

    if (!usuario || usuario.password !== password) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    req.session.authenticated = true;
    req.session.user = {
      id: usuario.id_usuario,
      nombre: usuario.nombre,
      email: usuario.email
    };

    res.json({ success: true, usuario: req.session.user });
  },

  logout: (req, res) => {
    req.session.destroy(err => {
      if (err) return res.status(500).send('Error al cerrar sesión');
      res.clearCookie('connect.sid');
      res.sendStatus(200);
    });
  },

  isAuthenticated: (req, res) => {
    res.json({
      authenticated: !!req.session.authenticated,
      user: req.session.user || null
    });
  },

  registrarUsuario: async (req, res) => {
    try {
      const {
        email, password, nombre, apellido,
        fecha_nacimiento, genero, altura, peso,
        patologias, actividades
      } = req.body;

      const nuevoUsuario = await prisma.usuarios.create({
        data: {
          email,
          password,
          nombre: `${nombre} ${apellido}`,
          fecha_registro: new Date(),
          sexo: genero === "1",
          altura: parseFloat(altura),
          peso: parseFloat(peso),
          patologias: {
            create: patologias.map(id => ({ id_patologia: parseInt(id) }))
          },
          actividades: {
            create: actividades.map(a => ({
              id_actividad: parseInt(a.id),
              frecuencia_semanal: parseInt(a.frecuencia)
            }))
          }
        }
      });

      res.status(201).json({ message: 'Cuenta creada', usuario: nuevoUsuario });
    } catch (error) {
      res.status(500).json({ error: 'Error al registrar usuario', detalles: error.message });
    }
  },

  getPatologias: async (req, res) => {
    const data = await prisma.patologias.findMany();
    res.json(data);
  },

  getActividades: async (req, res) => {
    const data = await prisma.actividades.findMany();
    res.json(data);
  },

  index: async (req, res) => {
    const posts = await prisma.posts.findMany({
      take: 3,
      orderBy: { fecha_creacion: 'desc' },
      include: {
        usuario: true,
        interacciones: true
      }
    });
    res.json(posts);
  },

  blog: async (req, res) => {
    const posts = await prisma.posts.findMany({
      where: { id_usuario: 1 },
      orderBy: { fecha_creacion: 'desc' },
      include: {
        usuario: true,
        interacciones: true
      }
    });
    res.json(posts);
  },

  existeMail: async (req, res) => {
    const { email } = req.query;
    const user = await prisma.usuarios.findUnique({ where: { email } });
    res.json({ existe: !!user });
  },

  product: async (req, res) => {
    const { query } = req.query;
    if (!query) return res.status(400).json({ error: 'Falta query' });

    const isEAN = /^\d{8,13}$/.test(query);

    try {
      if (isEAN) {
        const response = await axios.get(`https://world.openfoodfacts.org/api/v0/product/${query}.json`);
        if (response.data.status !== 1) throw new Error("No encontrado");
        return res.json(response.data.product);
      } else {
        const response = await axios.get(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&json=1`);
        const productos = response.data.products;
        if (!productos.length) return res.status(404).json({ error: 'No hay resultados' });
        return res.json(productos[0]);
      }
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  searchProducts: async (req, res) => {
    const { query } = req.query;
    if (!query) return res.status(400).json({ success: false, message: "Falta query" });

    try {
      const result = await axios.get(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&json=1`);
      const productos = result.data.products.filter(p =>
        ['es', 'en'].includes(p.lang) &&
        (p.countries?.toLowerCase()?.includes('argentina') || true)
      ).map(p => ({
        name: p.product_name,
        image: p.image_url || "/img/default_product.png"
      }));

      res.json({ success: true, products: productos });
    } catch (error) {
      console.error("🔴 Error en API OpenFood:", error.message);
      res.status(500).json({ success: false, message: "Error en API" });
    }
  },

  darLike: async (req, res) => {
    try {
      if (!req.session?.user?.email) throw new Error('Usuario no autenticado');
      const { idPost } = req.body;
      const email = req.session.user.email;
      const user = await prisma.usuarios.findUnique({ where: { email } });
      const idUsuario = user.id_usuario;

      const yaTieneLike = await prisma.interacciones.findFirst({
        where: { id_post: idPost, id_usuario: idUsuario, tipo_interaccion: 1 }
      });

      if (!yaTieneLike) {
        await prisma.interacciones.deleteMany({
          where: { id_post: idPost, id_usuario: idUsuario, tipo_interaccion: 2 }
        });

        await prisma.interacciones.create({
          data: {
            id_post: idPost,
            id_usuario: idUsuario,
            tipo_interaccion: 1,
            fecha_interaccion: new Date()
          }
        });
      }

      res.json({ success: true });
    } catch (err) {
      console.error('❌ Error en darLike:', err.message);
      res.status(500).json({ success: false, message: err.message });
    }
  },

  darDislike: async (req, res) => {
    try {
      if (!req.session?.user?.email) throw new Error('Usuario no autenticado');
      const { idPost } = req.body;
      const email = req.session.user.email;
      const user = await prisma.usuarios.findUnique({ where: { email } });
      const idUsuario = user.id_usuario;

      const yaTieneDislike = await prisma.interacciones.findFirst({
        where: { id_post: idPost, id_usuario: idUsuario, tipo_interaccion: 2 }
      });

      if (!yaTieneDislike) {
        await prisma.interacciones.deleteMany({
          where: { id_post: idPost, id_usuario: idUsuario, tipo_interaccion: 1 }
        });

        await prisma.interacciones.create({
          data: {
            id_post: idPost,
            id_usuario: idUsuario,
            tipo_interaccion: 2,
            fecha_interaccion: new Date()
          }
        });
      }

      res.json({ success: true });
    } catch (err) {
      console.error('❌ Error en darDislike:', err.message);
      res.status(500).json({ success: false, message: err.message });
    }
  },

  publicarPost: async (req, res) => {
    try {
      if (!req.session?.user?.email) throw new Error('Usuario no autenticado');
      const { contenidoPost } = req.body;
      const email = req.session.user.email;
      const user = await prisma.usuarios.findUnique({ where: { email } });
      const idUsuario = user.id_usuario;

      if (!contenidoPost) return res.status(400).json({ success: false, message: 'Contenido vacío' });

      const nuevo = await prisma.posts.create({
        data: {
          contenido_post: contenidoPost,
          id_usuario: idUsuario,
          fecha_creacion: new Date()
        }
      });

      res.json({
        success: true,
        post: {
          id_post: nuevo.id_post,
          contenido_post: nuevo.contenido_post,
          fecha_creacion: nuevo.fecha_creacion,
          autor: user.nombre
        }
      });
    } catch (err) {
      console.error('❌ Error en publicarPost:', err.message);
      res.status(500).json({ success: false, message: err.message });
    }
  },

  obtenerPosts: async (req, res) => {
    const posts = await prisma.posts.findMany({
      orderBy: { fecha_creacion: 'desc' },
      include: {
        usuario: true,
        interacciones: true
      }
    });

    const formatted = posts.map(post => ({
      id_post: post.id_post,
      contenido_post: post.contenido_post,
      fecha_creacion: post.fecha_creacion,
      autor: post.usuario.nombre,
      imagen_url: post.imagen_url,
      likes: post.interacciones.filter(i => i.tipo_interaccion === 1).length,
      dislikes: post.interacciones.filter(i => i.tipo_interaccion === 2).length
    }));

    res.json({ success: true, posts: formatted });
  }
};

module.exports = homeController;
