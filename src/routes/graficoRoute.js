const express = require('express');
const router = express.Router();
const graficoController = require('../controllers/graficoController');

router.get('/dados', graficoController.listarDados);

module.exports = router;
