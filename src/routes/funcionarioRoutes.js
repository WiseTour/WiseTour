const express = require('express');
const router = express.Router();
const funcionarioController = require('../controllers/funcionario');

// Rota para buscar o funcionário por fkUsuario
router.get('/funcionario/:fkUsuario', funcionarioController.getFuncionarioByFkUsuario);

router.post('/', funcionarioController.criarFuncionario);

router.put('/:id_funcionario', funcionarioController.atualizarFuncionario);


module.exports = router;
