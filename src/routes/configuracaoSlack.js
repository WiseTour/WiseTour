var express = require("express");
var router = express.Router();

var configuracaoSlack = require("../controllers/configuracaoSlack");

router.get("/usuario/:id_usuario/configuracaoSlack", configuracaoSlack.buscarConfiguracaoUsuario);

module.exports = router;


