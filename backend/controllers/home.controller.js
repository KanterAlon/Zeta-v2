const prisma = require('../prisma/client');
const { Prisma } = require('@prisma/client');
const axios = require('axios');
const { HttpsProxyAgent } = require('https-proxy-agent');
const redis = require('../utils/redis');
const { clerkClient } = require('@clerk/clerk-sdk-node');
const { getUserEmail } = require('../utils/auth');

const OFF_PROD_URL = process.env.OPENFOODFACTS_PRODUCT_URL ||
  'https://world.openfoodfacts.org/api/v2/product';
const OFF_SEARCH_URL = process.env.OPENFOODFACTS_SEARCH_URL ||
  'https://world.openfoodfacts.org/cgi/search.pl';
const OFF_API_URL = process.env.OPENFOODFACTS_API_URL || 'https://world.openfoodfacts.org/api/v2/search';

const CACHE_THRESHOLD = parseInt(process.env.CACHE_THRESHOLD || '3', 10);
const CACHE_TTL = 86400; // 24 hours

const normalize = (str) =>
  str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .toLowerCase();

const homeController = {
  // 🔐 Verificar autenticación
  isAuthenticated: async (req, res) => {
    try {
      const email = await getUserEmail(req);
      const usuario = await prisma.usuarios.findUnique({ where: { email } });
      return res.json({
        authenticated: true,
        user: usuario ? { id: usuario.id_usuario, nombre: usuario.nombre, email: usuario.email } : null
      });
    } catch {
      return res.status(401).json({ authenticated: false });
    }
  },

  // 🔐 Sincronizar usuario con Clerk
  clerkSync: async (req, res) => {
    try {
      if (!req.auth?.userId) return res.status(401).json({ error: 'No autenticado' });
      const userData = await clerkClient.users.getUser(req.auth.userId);

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

      return res.json({
        success: true,
        usuario: {
          id: usuario.id_usuario,
          nombre: usuario.nombre,
          email: usuario.email,
        }
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
      const email = await getUserEmail(req);
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
      const {
        edad,
        sexo,
        peso,
        altura,
        patologias = [],
        actividades = []
      } = req.body;
      const email = await getUserEmail(req);
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
      orderBy: { id_post: 'asc' },
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
    const normalized = isEAN ? query : normalize(query);
    const cacheKey = `product:${normalized}`;
    const freqKey = `freq:${cacheKey}`;
    let freq = 0;

    try {
      if (redis) {
        freq = await redis.incr(freqKey);
        if (freq === 1) await redis.expire(freqKey, CACHE_TTL);
        console.log('📦 Revisando cache para', cacheKey);
        const cached = await redis.get(cacheKey);
        if (cached) {
          console.log('✅ Cache hit para', cacheKey);
          return res.json(JSON.parse(cached));
        }
        console.log('❌ Cache miss para', cacheKey);
      } else {
        console.log('⚠️ Redis no está configurado');
      }
    } catch (err) {
      console.error('Redis read error:', err.message);
    }

    try {
      if (isEAN) {
        const productUrl = `${OFF_PROD_URL}/${encodeURIComponent(query)}.json`;
        console.log('🔍 OFF product URL:', productUrl);
        const response = await axios.get(productUrl);
        if (response.data.status !== 1) throw new Error('No encontrado');
        const product = response.data.product;
        if (redis && freq >= CACHE_THRESHOLD) {
          console.log('💾 Guardando producto en cache para', cacheKey);
          await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(product));
        }
        return res.json(product);
      } else {
        const searchParams = {
          search_terms: query,
          search_simple: 1,
          action: 'process',
          json: 1
        };
        const url = `${OFF_SEARCH_URL}?${new URLSearchParams(searchParams)}`;
        console.log('🔍 OFF search URL:', url);
        const response = await axios.get(OFF_SEARCH_URL, { params: searchParams });
        const productos = response.data.products;
        if (!productos.length) return res.status(404).json({ error: 'No hay resultados' });
        const product = productos[0];
        if (redis && freq >= CACHE_THRESHOLD) {
          console.log('💾 Guardando producto en cache para', cacheKey);
          await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(product));
        }
        return res.json(product);
      }
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  searchProducts: async (req, res) => {
    const { query } = req.query;
    if (!query) return res.status(400).json({ success: false, message: 'Falta query' });
    const normalizedQuery = normalize(query);
    const cacheKey = `search:${normalizedQuery}`;
    const freqKey = `freq:${cacheKey}`;
    let freq = 0;

    try {
      if (redis) {
        freq = await redis.incr(freqKey);
        if (freq === 1) await redis.expire(freqKey, CACHE_TTL);
        console.log('📦 Revisando cache para', cacheKey);
        const cached = await redis.get(cacheKey);
        if (cached) {
          console.log('✅ Cache hit para', cacheKey);
          return res.json({ success: true, products: JSON.parse(cached) });
        }
        console.log('❌ Cache miss para', cacheKey);
      } else {
        console.log('⚠️ Redis no está configurado');
      }
    } catch (err) {
      console.error('Redis read error:', err.message);
    }

    try {
      const searchParams = {
        search_terms: query,
        page_size: 20,
        fields: 'product_name,image_url',
        search_simple: 1,
        action: 'process',
        json: 1
      };
      const url = `${OFF_SEARCH_URL}?${new URLSearchParams(searchParams)}`;
      console.log('🔍 OFF API v1 search URL:', url);
      const agentUrl = process.env.https_proxy || process.env.HTTPS_PROXY;
      const options = { params: searchParams };
      if (agentUrl) {
        options.proxy = false;
        options.httpsAgent = new HttpsProxyAgent(agentUrl);
      }
      const result = await axios.get(OFF_SEARCH_URL, options);

      const productos = (result.data.products || [])
        .filter(p => p.product_name && p.image_url)
        .map(p => ({ name: p.product_name.trim(), image: p.image_url }));

      if (!productos.length) {
        console.log('🔎 No se encontraron productos para', query);
      } else {
        console.log(`🔎 Se encontraron ${productos.length} productos para ${query}`);
      }

      // Normaliza y combina productos duplicados con distintas fotos
      const map = new Map();
      for (const prod of productos) {
        const key = normalize(prod.name);
        if (!map.has(key)) {
          map.set(key, { name: prod.name, images: [prod.image] });
        } else {
          map.get(key).images.push(prod.image);
        }
      }

      const uniqueProducts = Array.from(map.values()).map(p => ({
        name: p.name,
        image: p.images.find(Boolean)
      }));

      try {
        if (redis && freq >= CACHE_THRESHOLD) {
          console.log('💾 Guardando resultado en cache para', cacheKey);
          await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(uniqueProducts));
        }
      } catch (err) {
        console.error('Redis write error:', err.message);
      }

      res.json({ success: true, products: uniqueProducts });
    } catch (error) {
      console.error("🔴 Error en API OpenFood:", error.message);
      res.status(500).json({ success: false, message: 'Error en API' });
    }
  },

  darLike: async (req, res) => {
    try {
      const { idPost } = req.body;
      const email = await getUserEmail(req);
      const user = await prisma.usuarios.findUnique({ where: { email } });
      const idUsuario = user.id_usuario;

      const existente = await prisma.interacciones.findFirst({
        where: { id_post: idPost, id_usuario: idUsuario }
      });

      if (existente?.tipo_interaccion === 1) {
        await prisma.interacciones.delete({ where: { id_interaccion: existente.id_interaccion } });
      } else {
        if (existente) {
          await prisma.interacciones.delete({ where: { id_interaccion: existente.id_interaccion } });
        }

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
      const status = err.message === 'Usuario no autenticado' ? 401 : 500;
      res.status(status).json({ success: false, message: err.message });
    }
  },

  darDislike: async (req, res) => {
    try {
      const { idPost } = req.body;
      const email = await getUserEmail(req);
      const user = await prisma.usuarios.findUnique({ where: { email } });
      const idUsuario = user.id_usuario;

      const existente = await prisma.interacciones.findFirst({
        where: { id_post: idPost, id_usuario: idUsuario }
      });

      if (existente?.tipo_interaccion === 2) {
        await prisma.interacciones.delete({ where: { id_interaccion: existente.id_interaccion } });
      } else {
        if (existente) {
          await prisma.interacciones.delete({ where: { id_interaccion: existente.id_interaccion } });
        }

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
      const status = err.message === 'Usuario no autenticado' ? 401 : 500;
      res.status(status).json({ success: false, message: err.message });
    }
  },

  publicarPost: async (req, res) => {
    try {
      const { contenidoPost, imagenUrl } = req.body;
      const email = await getUserEmail(req);
      const user = await prisma.usuarios.findUnique({ where: { email } });
      const idUsuario = user.id_usuario;

      if (!contenidoPost) return res.status(400).json({ success: false, message: 'Contenido vacío' });

      const nuevo = await prisma.posts.create({
        data: {
          contenido_post: contenidoPost,
          id_usuario: idUsuario,
          fecha_creacion: new Date(),
          imagen_url: imagenUrl ?? null
        }
      });

      res.json({
        success: true,
        post: {
          id_post: nuevo.id_post,
          contenido_post: nuevo.contenido_post,
          fecha_creacion: nuevo.fecha_creacion,
          autor: user.nombre,
          imagen_url: nuevo.imagen_url
        }
      });
    } catch (err) {
      console.error('❌ Error en publicarPost:', err.message);
      const status = err.message === 'Usuario no autenticado' ? 401 : 500;
      res.status(status).json({ success: false, message: err.message });
    }
  },

  obtenerPosts: async (req, res) => {
    const posts = await prisma.posts.findMany({
      where: {
        NOT: { id_usuario: 1 }
      },
      orderBy: { fecha_creacion: 'desc' },
      include: {
        usuario: true,
        interacciones: true
      }
    });

    let idUsuario = null;
    try {
      const email = await getUserEmail(req);
      const user = await prisma.usuarios.findUnique({ where: { email } });
      idUsuario = user?.id_usuario ?? null;
    } catch {
      idUsuario = null;
    }

    const formatted = posts.map(post => {
      const likes = post.interacciones.filter(i => i.tipo_interaccion === 1);
      const dislikes = post.interacciones.filter(i => i.tipo_interaccion === 2);

      const liked = idUsuario ? likes.some(i => i.id_usuario === idUsuario) : false;
      const disliked = idUsuario ? dislikes.some(i => i.id_usuario === idUsuario) : false;

      return {
        id_post: post.id_post,
        contenido_post: post.contenido_post,
        fecha_creacion: post.fecha_creacion,
        autor: post.usuario.nombre,
        imagen_url: post.imagen_url,
        likes: likes.length,
        dislikes: dislikes.length,
        liked,
        disliked
      };
    });

    res.json({ success: true, posts: formatted });
  }
};

module.exports = homeController;
