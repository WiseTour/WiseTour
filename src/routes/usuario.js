var express = require("express");
var router = express.Router();

var usuario = require("../controllers/usuario");

router.post('/autenticar', usuario.autenticar);
router.get('/:id_usuario', usuario.buscarUsuarioPorId);
router.get('/:id_usuario/senha', usuario.buscarSenhaUsuarioPorId);
router.put('/alterar_informacoes', usuario.alterarInformacoesUsuario);
router.put('/alterar_senha', usuario.alterarSenhaUsuario);

module.exports = router;