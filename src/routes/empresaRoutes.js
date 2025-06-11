const express = require('express');
const router = express.Router();
const EmpresaController = require('../controllers/empresaController');

router.post('/', EmpresaController.cadastrarEmpresa);
router.put('/', EmpresaController.editarEmpresa);
router.delete('/:cnpj', EmpresaController.excluirEmpresa);  

module.exports = router;