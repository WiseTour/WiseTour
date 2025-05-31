var express = require("express");
var router = express.Router();

var usuario = require("../controllers/usuario");

router.post('/autenticar', usuario.autenticar);
router.get('/:id_usuario', usuario.buscarUsuarioPorId);
router.put('/alterar_informacoes', usuario.alterarInformacoesUsuario);

module.exports = router;