const express = require('express');
const router = express.Router();
const controller = require('../controllers/home.controller');

// Rutas GET ya existentes
router.get('/', controller.index);
router.get('/product', controller.product);
router.get('/SearchProducts', controller.searchProducts);
router.get('/blog', controller.blog);
router.post('/darLike', controller.darLike);
router.post('/darDislike', controller.darDislike);
router.post('/publicarPost', controller.publicarPost);
router.get('/obtenerPosts', controller.obtenerPosts);
router.post('/login', controller.login);
router.post('/logout', controller.logout);
router.get('/auth', controller.isAuthenticated);
router.post('/CreateAccount', controller.registrarUsuario);
router.post('/clerk/sync', controller.clerkSync);
router.get('/ExisteMail', controller.existeMail);
router.get('/patologias', controller.getPatologias);
router.get('/actividades', controller.getActividades);
router.get('/user/me', controller.obtenerPerfil);
router.post('/user/update', controller.actualizarPerfil);

const contactController = require('../controllers/contact.controller');
router.post('/contact', contactController.sendContactEmail);



module.exports = router;
