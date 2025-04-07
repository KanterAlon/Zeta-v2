const express = require('express');
const router = express.Router();
const controller = require('../controllers/home.Controller');

router.get('/', controller.index);
router.get('/blog', controller.blog);
router.get('/existeMail', controller.existeMail);
router.get('/product', controller.product);
router.get('/searchProducts', controller.searchProducts);
router.post('/darLike', controller.darLike);
router.post('/darDislike', controller.darDislike);
router.post('/publicarPost', controller.publicarPost);
router.get('/obtenerPosts', controller.obtenerPosts);

module.exports = router;
