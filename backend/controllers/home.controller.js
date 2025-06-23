const prisma = require('../prisma/client');
const { Prisma } = require('@prisma/client');
const axios = require('axios');

const homeController = {
  // 🔐 LOGIN
  login: async (req, res) => {
    const { email, password } = req.body;
  
    const usuario = await prisma.usuarios.findUnique({ where: { email } });
  
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
  
    // ⚠️ Aquí deberías usar bcrypt si las contraseñas están hasheadas
    if (usuario.password !== password) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
  
    req.session.authenticated = true;
    req.session.user = {
      id: usuario.id_usuario,
      nombre: usuario.nombre,
      email: usuario.email
    };
  
    req.session.save(err => {
      if (err) {
        return res.status(500).json({ error: 'Error al guardar sesión' });
      }
  
      res.json({ success: true, usuario: req.session.user });
    });
  },  
  logout: (req, res) => {
    req.session.destroy(err => {
      if (err) {
        return res.status(500).send('Error al cerrar sesión');
      }
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

  // 🔐 Sincronizar sesión con Clerk
  clerkSync: async (req, res) => {
    try {
      const { clerkClient } = require('@clerk/clerk-sdk-node');
      const token = req.body.token || req.headers.authorization?.replace('Bearer ', '');
      if (!token) return res.status(400).json({ error: 'Token requerido' });

      const payload = await clerkClient.base.verifySessionToken(token);
      const userData = await clerkClient.users.getUser(payload.sub);

      // Clerk's SDK returns camelCase properties
      const email =
        userData.primaryEmailAddress?.emailAddress ||
        userData.emailAddresses?.[0]?.emailAddress;

      if (!email) throw new Error('No se pudo obtener email');

      let usuario = await prisma.usuarios.findUnique({ where: { email } });

      if (!usuario) {
        usuario = await prisma.usuarios.create({
          data: {
            nombre: userData.firstName || 'Usuario',
            email,
            fecha_registro: new Date(),
          }
        });
      }

      req.session.authenticated = true;
      req.session.user = {
        id: usuario.id_usuario,
        nombre: usuario.nombre,
        email: usuario.email,
      };

      req.session.save(err => {
        if (err) return res.status(500).json({ error: 'No se pudo guardar sesión' });
        res.json({ success: true, usuario: req.session.user });
      });
    } catch (error) {
      console.error('Error clerkSync:', error);
      res.status(401).json({ error: 'Token inválido' });
    }
  },

registrarUsuario: async (req, res) => {
    try {
      const { nombre, apellido, email, password } = req.body;
  
      if (!nombre || !apellido || !email || !password) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
      }
  
      const usuarioExistente = await prisma.usuarios.findUnique({
        where: { email }
      });
  
      if (usuarioExistente) {
        return res.status(409).json({ error: 'El email ya está registrado' });
      }
  
      const nuevoUsuario = await prisma.usuarios.create({
        data: {
          nombre: `${nombre} ${apellido}`,
          email,
          password,
          fecha_registro: new Date(),
          ultima_sesion: null,
          edad: null,
          sexo: null,
          peso: null,
          altura: null
        }
      });
  
      return res.status(201).json({
        message: 'Cuenta creada exitosamente',
        usuario: nuevoUsuario
      });
  
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      return res.status(500).json({
        error: 'Error al registrar usuario',
        detalles: error.message
      });
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

  obtenerPerfil: async (req, res) => {
    try {
      if (!req.session?.user?.email) return res.status(401).json({ error: 'No autenticado' });

      const email = req.session.user.email;
      const usuario = await prisma.usuarios.findUnique({
        where: { email },
        include: {
          actividades: { include: { actividad: true } },
          patologias: { include: { patologia: true } }
        }
      });

      if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

      const perfil = {
        edad: usuario.edad,
        sexo: usuario.sexo,
        peso: usuario.peso,
        altura: usuario.altura,
        actividades: usuario.actividades.map(a => ({
          id: a.id_actividad,
          nombre: a.actividad?.nombre_actividad,
          frecuencia: a.frecuencia_semanal
        })),
        patologias: usuario.patologias.map(p => ({
          id: p.id_patologia,
          nombre: p.patologia.nombre_patologia
        }))
      };

      const completo = perfil.edad && perfil.sexo !== null && perfil.peso && perfil.altura && perfil.patologias.length > 0 && perfil.actividades.length > 0;

      res.json({ perfil, completo });
    } catch (err) {
      console.error('Error obtenerPerfil:', err);
      res.status(500).json({ error: 'Error al obtener perfil' });
    }
  },

  actualizarPerfil: async (req, res) => {
    try {
      if (!req.session?.user?.email) return res.status(401).json({ error: 'No autenticado' });

      const {
        edad,
        sexo,
        peso,
        altura,
        patologias = [],
        actividades = []
      } = req.body;

      const email = req.session.user.email;
      const usuario = await prisma.usuarios.findUnique({ where: { email } });
      if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

      await prisma.usuarios.update({
        where: { id_usuario: usuario.id_usuario },
        data: { edad, sexo, peso, altura }
      });

      await prisma.usuariosPatologias.deleteMany({ where: { id_usuario: usuario.id_usuario } });
      for (const p of patologias) {
        let id = p.id;
        if (!id && p.nombre) {
          const nuevo = await prisma.patologias.create({ data: { nombre_patologia: p.nombre } });
          id = nuevo.id_patologia;
        }
        if (id) {
          await prisma.usuariosPatologias.create({ data: { id_usuario: usuario.id_usuario, id_patologia: id } });
        }
      }

      await prisma.actividadesUsuario.deleteMany({ where: { id_usuario: usuario.id_usuario } });
      for (const a of actividades) {
        let id = a.id;
        if (!id && a.nombre) {
          const nuevo = await prisma.actividades.create({ data: { nombre_actividad: a.nombre, coef_actividad: new Prisma.Decimal(1) } });
          id = nuevo.id_actividad;
        }
        if (id) {
          await prisma.actividadesUsuario.create({ data: { id_usuario: usuario.id_usuario, id_actividad: id, frecuencia_semanal: parseInt(a.frecuencia || 0) } });
        }
      }

      res.json({ success: true });
    } catch (err) {
      console.error('Error actualizarPerfil:', err);
      res.status(500).json({ error: 'Error al actualizar perfil' });
    }
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
  
    if (!email) {
      return res.status(400).json({ error: 'El parámetro "email" es requerido' });
    }
  
    try {
      const user = await prisma.usuarios.findUnique({ where: { email } });
      res.json({ existe: !!user });
    } catch (error) {
      res.status(500).json({ error: 'Error al verificar el correo', detalles: error.message });
    }
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
      const productos = result.data.products
        .filter(p =>
          ['es', 'en'].includes(p.lang) &&
          p.product_name &&
          p.image_url &&
          (p.countries?.toLowerCase()?.includes('argentina') || true)
        )
        .map(p => ({
          name: p.product_name,
          image: p.image_url
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
