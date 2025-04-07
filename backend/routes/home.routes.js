const express = require('express');
const router = express.Router();

const controller = require('../controllers/home.controller'); // ← esta línea te faltaba

router.get('/', controller.index);
router.get('/product', controller.product);
router.get('/SearchProducts', controller.searchProducts);

module.exports = router;
