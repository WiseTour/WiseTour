var express = require("express");
var router = express.Router();

var usuario = require("../controllers/usuarioController");

router.post('/autenticar', usuario.autenticar);
router.get('/:id_usuario', usuario.buscarUsuarioPorId);
router.get('/:id_usuario/senha', usuario.buscarSenhaUsuarioPorId);
router.put('/alterar_informacoes', usuario.alterarInformacoesUsuario);
router.put('/alterar_senha', usuario.alterarSenhaUsuario);
router.post('/cadastrar_info_contato', usuario.cadastrarInfoContato);
router.put('/:id_usuario', usuario.atualizarUsuario);
router.post('/', usuario.criarUsuario);
router.delete('/', usuario.excluirUsuario);

module.exports = router;