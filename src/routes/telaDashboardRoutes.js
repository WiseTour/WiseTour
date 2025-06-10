const express = require('express');
const router = express.Router();
const TelaDashboardController = require('../controllers/telaDashboardController');

router.get('/usuario/:usuarioId/telas', TelaDashboardController.buscarTelasUsuario);

module.exports = router;
