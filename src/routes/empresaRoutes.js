const express = require('express');
const router = express.Router();
const EmpresaController = require('../controllers/empresaController');

router.post('/', EmpresaController.cadastrarEmpresa);

module.exports = router;