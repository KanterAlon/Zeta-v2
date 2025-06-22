const express = require('express');
const multer = require('multer');
const router = express.Router();
const cameraController = require('../controllers/camera.controller');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('image'), cameraController.handleUpload);

module.exports = router;
