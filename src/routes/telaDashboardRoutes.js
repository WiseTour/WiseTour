const express = require('express');
const router = express.Router();
const telaDashboardController = require('../controllers/telaDashboard');

router.get('/:id_usuario', telaDashboardController.buscarTelasPorUsuario);
router.put('/:id_usuario', telaDashboardController.atualizarPreferencias);

module.exports = router;