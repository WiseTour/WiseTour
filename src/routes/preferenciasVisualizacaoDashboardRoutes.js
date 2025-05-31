const express = require('express');
const router = express.Router();
const preferenciasVisualizacaoDashboard = require('../controllers/preferenciasVisualizacaoDashboard');

router.get('/:id_usuario', preferenciasVisualizacaoDashboard.verificarPreferenciaAtiva);

module.exports = router;