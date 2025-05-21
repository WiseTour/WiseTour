var express = require("express");
var router = express.Router();

var usuario = require("../controllers/usuario");

router.post('/autenticar', usuario.autenticar);

router.get('/:id', usuario.getUsuarioComFuncionario);

module.exports = router;