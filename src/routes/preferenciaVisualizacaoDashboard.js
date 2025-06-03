var express = require("express");
var router = express.Router();

var preferenciaVisualizacaoDashboardController = require("../controllers/preferenciaVisualizacaoDashboard");

router.get("/usuario/:id_usuario/preferencia", preferenciaVisualizacaoDashboardController.buscarPreferenciasUsuario);
router.put("/usuario/:id_usuario/preferencia", preferenciaVisualizacaoDashboardController.atualizarPreferenciasUsuario);

module.exports = router;


