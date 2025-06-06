var express = require("express");
var router = express.Router();

var usuario = require("../controllers/usuario");
var usuarioController = require("../controllers/usuarioController");

router.post("/cadastrar", function (req, res){
    usuarioController.cadastrar(req, res);
})

router.post('/autenticar', usuario.autenticar);

router.get('/:id', usuario.getUsuarioComFuncionario);

module.exports = router;