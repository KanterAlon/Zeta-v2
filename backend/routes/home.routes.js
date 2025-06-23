const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home.controller'); // ✅ ESTO FALTABA


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
router.post('/login', homeController.login);
router.post('/logout', homeController.logout);
router.get('/auth', homeController.isAuthenticated);
router.post('/CreateAccount', homeController.registrarUsuario);
router.post('/clerk/sync', homeController.clerkSync);
router.get('/ExisteMail', homeController.existeMail);
router.get('/patologias', homeController.getPatologias);
router.get('/actividades', homeController.getActividades);
router.get('/user/me', homeController.obtenerPerfil);
router.post('/user/update', homeController.actualizarPerfil);

const contactController = require('../controllers/contact.controller');
router.post('/contact', contactController.sendContactEmail);



module.exports = router;
