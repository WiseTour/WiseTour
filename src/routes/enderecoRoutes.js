const express = require('express');
const router = express.Router();
const EnderecoController = require('../controllers/enderecoController');

router.post('/', EnderecoController.cadastrarEnderecoEmpresa);

module.exports = router;