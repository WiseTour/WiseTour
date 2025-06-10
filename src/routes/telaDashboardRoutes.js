const express = require('express');
const router = express.Router();
const TelaDashboardController = require('../controllers/telaDashboard');

router.get('/usuario/:usuarioId/telas', TelaDashboardController.buscarTelasUsuario);

module.exports = router;
