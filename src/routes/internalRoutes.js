var express = require("express");
var router = express.Router();

var internalController = require("../controllers/internalController");


router.post("/cadastrarEmpresa", function (req, res) {
    internalController.cadastrarEmpresa(req, res);
})

router.post("/excluirEmpresa", function (req, res) {
    internalController.excluirEmpresa(req, res);
})

router.post("/editarInformacoesEmpresariaisEmpresa", function (req, res) {
    internalController.editarInformacoesEmpresariaisEmpresa(req, res);
})

router.post("/editarEnderecoEmpresa", function (req, res) {
    internalController.editarEnderecoEmpresa(req, res);
})

router.post("/cadastrarFuncionario", function (req, res) {
    internalController.cadastrarFuncionario(req, res);
})

router.post("/cadastrarUsuario", function (req, res) {
    internalController.cadastrarUsuario(req, res);
})

router.post("/editarFuncionario", function (req, res) {
    internalController.editarFuncionario(req, res);
})

router.post("/editarUsuario", function (req, res) {
    internalController.editarUsuario(req, res);
})

router.post("/excluirFuncionario", function (req, res) {
    internalController.excluirFuncionario(req, res);
})

router.post("/excluirUsuario", function (req, res) {
    internalController.excluirUsuario(req, res);
})


module.exports = router;