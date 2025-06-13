const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home.controller'); // ✅ ESTO FALTABA
const { ClerkExpressWithAuth } = require('@clerk/clerk-sdk-node');


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
router.get('/ExisteMail', homeController.existeMail);
router.get('/patologias', homeController.getPatologias);
router.get('/actividades', homeController.getActividades);

router.post('/clerk/sync', ClerkExpressWithAuth(), homeController.clerkSync);



module.exports = router;
