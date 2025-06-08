const express = require('express');
const router = express.Router();
const graficoController = require('../controllers/graficoController');

// Rotas do perfil do turista (já existentes)
router.get('/motivo', graficoController.listarMotivos);
router.get('/fontes', graficoController.listarFontesInformacao);
router.get('/composicao', graficoController.listarComposicao);
router.get('/vias', graficoController.listarVias);
router.get('/genero', graficoController.listarGeneroMaisRecorrente);
router.get('/faixa_etaria', graficoController.listarFaixaEtariaMaisRecorrente);
router.get('/gasto-medio', graficoController.calcularGastoMedio);


// NOVAS ROTAS para o Panorama Geral (index.js)
router.get('/paises-origem', graficoController.listarPrincipaisPaisesOrigem);
router.get('/presenca-uf', graficoController.listarPresencaTuristasUF);
router.get('/chegadas', graficoController.listarChegadasTuristasEstrangeiros);
router.get('/chegadas-comparativas', graficoController.calcularChegadasComparativas);

// --- NOVAS ROTAS PARA SAZONALIDADE (sazonalidade.js) ---
// Rota para a KPI "TOP 3 Estados Mais Visitados"
router.get('/visitas-por-estado', graficoController.obterDadosVisitasPorEstado);
router.get('/dashboard-data', graficoController.buscarDadosParaDashboard);
router.get('/sazonalidade/top-estados', graficoController.listarTopEstadosVisitadosSazonalidade);
router.get('/sazonalidade/pico-visitas-unica-linha', graficoController.listarPicoVisitasSazonalidade);

router.get('/sazonalidade/total-turistas', graficoController.getKPITotalTuristasSazonalidade);
router.get('/sazonalidade/variacao-turistas', graficoController.getKPIVariacaoTuristasSazonalidade);

module.exports = router;