var express = require("express");
var router = express.Router();

var preferenciaVisualizacaoDashboardController = require("../controllers/preferenciaVisualizacaoDashboard");

router.get("/usuario/preferencias-visualizacao-dashboard", preferenciaVisualizacaoDashboardController.buscarPreferenciasUsuario);
router.put("/usuario/preferencias-visualizacao-dashboard", preferenciaVisualizacaoDashboardController.atualizarPreferenciasUsuario);

module.exports = router;


