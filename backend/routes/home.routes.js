const express = require('express');
const router = express.Router();

const controller = require('../controllers/home.controller'); 

// Rutas GET ya existentes
router.get('/', controller.index);
router.get('/product', controller.product);
router.get('/SearchProducts', controller.searchProducts);

// Agrega las rutas POST para manejar las interacciones desde el front-end
router.post('/darLike', controller.darLike);
router.post('/darDislike', controller.darDislike);
router.post('/publicarPost', controller.publicarPost);
// Agrega esta ruta a home.routes.js
router.get('/obtenerPosts', controller.obtenerPosts);


module.exports = router;
