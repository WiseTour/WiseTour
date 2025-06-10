const express = require('express');
const router = express.Router();
const funcionarioController = require('../controllers/funcionarioController');

// Rota para buscar o funcionário por fkUsuario
router.get('/funcionario/:fkUsuario', funcionarioController.getFuncionarioByFkUsuario);

module.exports = router;
