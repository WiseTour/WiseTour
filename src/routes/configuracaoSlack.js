var express = require("express");
var router = express.Router();

var configuracaoSlack = require("../controllers/configuracaoSlackController");

router.get("/usuario/configuracaoSlack/tiposNotificacoes", configuracaoSlack.buscarConfiguracaoUsuario);
router.put("/usuario/configuracaoSlack/tiposNotificacoes", configuracaoSlack.atualizarConfiguracaoSlack);

module.exports = router;


