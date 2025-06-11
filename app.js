
// var ambiente_processo = 'producao';
var ambiente_processo = "desenvolvimento";
var caminho_env = ambiente_processo === "producao" ? ".env" : ".env.dev";

require("dotenv").config({ path: caminho_env });

var express = require("express");
var cors = require("cors");
var path = require("path");
var PORTA_APP = process.env.APP_PORT;
var HOST_APP = process.env.APP_HOST;

var app = express();

var cacheService = require('./cacheService');
var indexRouter = require("./src/routes/index");
var usuarioRouter = require("./src/routes/usuario");
var funcionarioRoutes = require('./src/routes/funcionario');
var preferenciaVisualizacaoDashboardRoutes = require('./src/routes/preferenciaVisualizacaoDashboard');
var telaDashboardRoutes = require("./src/routes/telaDashboardRoutes");
var configuracaoSlackRoutes = require("./src/routes/configuracaoSlack");
var ipRouter = require("./src/routes/ipRoute"); // Nova rota para IP
var { sequelize } = require('./src/database/sequelizeConfig');
var graficoRouter = require("./src/routes/graficoRoute");

// Funções para formatação de logs padronizada
function logFormatado(operacao, detalhes, tempoInicio = null) {
  const timestamp = new Date().toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  
  console.log(`\n[${timestamp}] ${operacao}:`);
  
  if (typeof detalhes === 'string') {
    console.log(`  ${detalhes}`);
  } else if (typeof detalhes === 'object') {
    Object.entries(detalhes).forEach(([chave, valor]) => {
      console.log(`  ${chave}: ${valor}`);
    });
  }
  
  if (tempoInicio) {
    const tempoExecucao = Date.now() - tempoInicio;
    console.log(`  Tempo de execução: ${tempoExecucao}ms`);
  }
}

// Função para log de requisições HTTP
function logRequisicao(endpoint, parametros, tempoInicio = null) {
  const detalhes = {
    'Requisição HTTP': `GET ${endpoint}`,
    'Parâmetros': Object.entries(parametros).map(([k, v]) => `${k}=${v}`).join('&') || 'nenhum'
  };
  
  logFormatado('REQUISIÇÃO API', detalhes, tempoInicio);
}

// Função para log de cache
function logCache(operacao, periodo, dados) {
  const detalhes = {
    'Operação de Cache': operacao === 'RETRIEVE' ? 'Recuperação' : operacao === 'MISS' ? 'Não encontrado' : operacao,
    'Período': `${periodo.mes}/${periodo.ano}`,
    'Status dos Dados': dados ? 'Sucesso' : 'Falhou',
    'Tamanho dos Dados': dados ? `${JSON.stringify(dados).length} bytes` : '0 bytes'
  };
  
  logFormatado('OPERAÇÃO DE CACHE', detalhes);
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
}); // Definição de rota para o arquivo home html quando iniciar a API
app.use(express.static(path.join(__dirname, "public")));
app.use("/common", express.static(path.join(__dirname, "common")));
app.use("/auth", express.static(path.join(__dirname, "auth")));
app.use("/internal", express.static(path.join(__dirname, "internal")));
app.use("/private", express.static(path.join(__dirname, "private")));
app.use(cors());

app.use("/", indexRouter);
app.use("/usuario", usuarioRouter);
app.use('/funcionario', funcionarioRoutes);
app.use("/preferenciaVisualizacaoDashboard", preferenciaVisualizacaoDashboardRoutes);
app.use("/telaDashboard", telaDashboardRoutes);
app.use("/grafico", graficoRouter);
app.use("/configuracaoSlackRoutes", configuracaoSlackRoutes)

app.use("/ip", ipRouter); // Rota para serviços de IP

const graficoController = require('./src/controllers/perfilEstimadoTuristasController');

// Rotas simplificadas de cache
app.get('/grafico/perfil-estimado-turista/meses-anos-paises', graficoController.getMesesAnosPaises);

// Cache para meses-anos-paises
app.get('/api/meses-anos-paises-cached', (req, res) => {
  const tempoInicio = Date.now();
  logRequisicao('/api/meses-anos-paises-cached', req.query, tempoInicio);
  
  const mesesAnosPaises = cacheService.getMesesAnosPaises();
  if (mesesAnosPaises) {
    logFormatado('CACHE ENCONTRADO', 'Dados de meses-anos-países recuperados do cache com sucesso');
    res.json(mesesAnosPaises);
  } else {
    logFormatado('CACHE VAZIO', 'Dados de meses-anos-países não encontrados no cache');
    res.status(404).json({ error: 'Dados ainda não carregados' });
  }
});

// Cache para países origem
app.get('/api/paises-origem-cached', (req, res) => {
  const tempoInicio = Date.now();
  logRequisicao('/api/paises-origem-cached', req.query, tempoInicio);
  
  const ultimoPeriodoCache = cacheService.getUltimoPeriodoCache();
  if (ultimoPeriodoCache.paisesOrigem) {
    logCache('Recuperação', ultimoPeriodoCache, ultimoPeriodoCache.paisesOrigem);
    res.json(ultimoPeriodoCache.paisesOrigem);
  } else {
    logCache('Não encontrado', ultimoPeriodoCache, null);
    res.status(404).json({ 
      error: 'Dados não encontrados no cache',
      periodoCache: `${ultimoPeriodoCache.mes}/${ultimoPeriodoCache.ano}`
    });
  }
});

// Cache para presença UF
app.get('/api/presenca-uf-cached', (req, res) => {
  const tempoInicio = Date.now();
  logRequisicao('/api/presenca-uf-cached', req.query, tempoInicio);
  
  const ultimoPeriodoCache = cacheService.getUltimoPeriodoCache();
  if (ultimoPeriodoCache.presencaUF) {
    logCache('Recuperação', ultimoPeriodoCache, ultimoPeriodoCache.presencaUF);
    res.json(ultimoPeriodoCache.presencaUF);
  } else {
    logCache('Não encontrado', ultimoPeriodoCache, null);
    res.status(404).json({ 
      error: 'Dados não encontrados no cache',
      periodoCache: `${ultimoPeriodoCache.mes}/${ultimoPeriodoCache.ano}`
    });
  }
});

// Cache para chegadas
app.get('/api/chegadas-cached', (req, res) => {
  const tempoInicio = Date.now();
  logRequisicao('/api/chegadas-cached', req.query, tempoInicio);
  
  const ultimoPeriodoCache = cacheService.getUltimoPeriodoCache();
  if (ultimoPeriodoCache.chegadas) {
    logCache('Recuperação', ultimoPeriodoCache, ultimoPeriodoCache.chegadas);
    res.json(ultimoPeriodoCache.chegadas);
  } else {
    logCache('Não encontrado', ultimoPeriodoCache, null);
    res.status(404).json({ 
      error: 'Dados não encontrados no cache',
      periodoCache: `${ultimoPeriodoCache.mes}/${ultimoPeriodoCache.ano}`
    });
  }
});

// Cache para chegadas comparativas
app.get('/api/chegadas-comparativas-cached', (req, res) => {
  const tempoInicio = Date.now();
  logRequisicao('/api/chegadas-comparativas-cached', req.query, tempoInicio);
  
  const ultimoPeriodoCache = cacheService.getUltimoPeriodoCache();
  if (ultimoPeriodoCache.chegadasComparativas) {
    logCache('Recuperação', ultimoPeriodoCache, ultimoPeriodoCache.chegadasComparativas);
    res.json(ultimoPeriodoCache.chegadasComparativas);
  } else {
    logCache('Não encontrado', ultimoPeriodoCache, null);
    res.status(404).json({ 
      error: 'Dados não encontrados no cache',
      periodoCache: `${ultimoPeriodoCache.mes}/${ultimoPeriodoCache.ano}`
    });
  }
});

// Rota para atualizar cache manualmente
app.post('/api/atualizar-cache', async (req, res) => {
  const tempoInicio = Date.now();
  const { mes, ano } = req.body;
  
  logFormatado('ATUALIZAÇÃO MANUAL DO CACHE', {
    'Período Solicitado': `${mes}/${ano}`,
    'Dados da Requisição': JSON.stringify(req.body)
  });
  
  if (!mes || !ano) {
    logFormatado('ERRO DE VALIDAÇÃO', 'Parâmetros obrigatórios ausentes: mês e ano');
    return res.status(400).json({ error: 'Mês e ano são obrigatórios' });
  }
  
  const sucesso = await cacheService.atualizarCachePeriodo(app, mes, ano);
  
  if (sucesso) {
    logFormatado('CACHE ATUALIZADO COM SUCESSO', `Cache atualizado para o período ${mes}/${ano}`, tempoInicio);
    res.json({ message: `Cache atualizado para ${mes}/${ano}` });
  } else {
    logFormatado('FALHA NA ATUALIZAÇÃO DO CACHE', `Não foi possível atualizar o cache para o período ${mes}/${ano}`, tempoInicio);
    res.status(500).json({ error: 'Erro ao atualizar cache' });
  }
});

// Rota para recarregar cache do último período
app.post('/api/recarregar-cache', async (req, res) => {
  const tempoInicio = Date.now();
  
  try {
    logFormatado('RECARREGAMENTO DO CACHE', 'Iniciando recarregamento do cache para o último período');
    await cacheService.carregarCacheUltimoPeriodo(app);
    const ultimoPeriodoCache = cacheService.getUltimoPeriodoCache();
    
    logFormatado('CACHE RECARREGADO COM SUCESSO', {
      'Período': `${ultimoPeriodoCache.mes}/${ultimoPeriodoCache.ano}`,
      'Status': 'Concluído com sucesso'
    }, tempoInicio);
    
    res.json({ 
      message: 'Cache recarregado para o último período',
      periodo: `${ultimoPeriodoCache.mes}/${ultimoPeriodoCache.ano}`
    });
  } catch (error) {
    logFormatado('ERRO NO RECARREGAMENTO DO CACHE', {
      'Erro': error.message,
      'Detalhes': error.stack
    }, tempoInicio);
    res.status(500).json({ error: 'Erro ao recarregar cache' });
  }
});

app.get('/api/motivos-cached', (req, res) => {
  const tempoInicio = Date.now();
  logRequisicao('/api/motivos-cached', req.query, tempoInicio);
  
  const ultimoPeriodoCache = cacheService.getUltimoPeriodoCache();
  if (ultimoPeriodoCache.motivos) {
    logCache('Recuperação', ultimoPeriodoCache, ultimoPeriodoCache.motivos);
    res.json(ultimoPeriodoCache.motivos);
  } else {
    logCache('Não encontrado', ultimoPeriodoCache, null);
    res.status(404).json({ 
      error: 'Dados não encontrados no cache',
      periodoCache: `${ultimoPeriodoCache.mes}/${ultimoPeriodoCache.ano}`
    });
  }
});

// Cache para fontes de informação
app.get('/api/fontes-cached', (req, res) => {
  const tempoInicio = Date.now();
  logRequisicao('/api/fontes-cached', req.query, tempoInicio);
  
  const ultimoPeriodoCache = cacheService.getUltimoPeriodoCache();
  if (ultimoPeriodoCache.fontes) {
    logCache('Recuperação', ultimoPeriodoCache, ultimoPeriodoCache.fontes);
    res.json(ultimoPeriodoCache.fontes);
  } else {
    logCache('Não encontrado', ultimoPeriodoCache, null);
    res.status(404).json({ 
      error: 'Dados não encontrados no cache',
      periodoCache: `${ultimoPeriodoCache.mes}/${ultimoPeriodoCache.ano}`
    });
  }
});

// Cache para composição
app.get('/api/composicao-cached', (req, res) => {
  const tempoInicio = Date.now();
  logRequisicao('/api/composicao-cached', req.query, tempoInicio);
  
  const ultimoPeriodoCache = cacheService.getUltimoPeriodoCache();
  if (ultimoPeriodoCache.composicao) {
    logCache('Recuperação', ultimoPeriodoCache, ultimoPeriodoCache.composicao);
    res.json(ultimoPeriodoCache.composicao);
  } else {
    logCache('Não encontrado', ultimoPeriodoCache, null);
    res.status(404).json({ 
      error: 'Dados não encontrados no cache',
      periodoCache: `${ultimoPeriodoCache.mes}/${ultimoPeriodoCache.ano}`
    });
  }
});

// Cache para vias
app.get('/api/vias-cached', (req, res) => {
  const tempoInicio = Date.now();
  logRequisicao('/api/vias-cached', req.query, tempoInicio);
  
  const ultimoPeriodoCache = cacheService.getUltimoPeriodoCache();
  if (ultimoPeriodoCache.vias) {
    logCache('Recuperação', ultimoPeriodoCache, ultimoPeriodoCache.vias);
    res.json(ultimoPeriodoCache.vias);
  } else {
    logCache('Não encontrado', ultimoPeriodoCache, null);
    res.status(404).json({ 
      error: 'Dados não encontrados no cache',
      periodoCache: `${ultimoPeriodoCache.mes}/${ultimoPeriodoCache.ano}`
    });
  }
});

// Cache para gênero
app.get('/api/genero-cached', (req, res) => {
  const tempoInicio = Date.now();
  logRequisicao('/api/genero-cached', req.query, tempoInicio);
  
  const ultimoPeriodoCache = cacheService.getUltimoPeriodoCache();
  if (ultimoPeriodoCache.genero) {
    logCache('Recuperação', ultimoPeriodoCache, ultimoPeriodoCache.genero);
    res.json(ultimoPeriodoCache.genero);
  } else {
    logCache('Não encontrado', ultimoPeriodoCache, null);
    res.status(404).json({ 
      error: 'Dados não encontrados no cache',
      periodoCache: `${ultimoPeriodoCache.mes}/${ultimoPeriodoCache.ano}`
    });
  }
});

// Cache para faixa etária
app.get('/api/faixa-etaria-cached', (req, res) => {
  const tempoInicio = Date.now();
  logRequisicao('/api/faixa-etaria-cached', req.query, tempoInicio);
  
  const ultimoPeriodoCache = cacheService.getUltimoPeriodoCache();
  if (ultimoPeriodoCache.faixaEtaria) {
    logCache('Recuperação', ultimoPeriodoCache, ultimoPeriodoCache.faixaEtaria);
    res.json(ultimoPeriodoCache.faixaEtaria);
  } else {
    logCache('Não encontrado', ultimoPeriodoCache, null);
    res.status(404).json({ 
      error: 'Dados não encontrados no cache',
      periodoCache: `${ultimoPeriodoCache.mes}/${ultimoPeriodoCache.ano}`
    });
  }
});

// Cache para gasto médio
app.get('/api/gasto-medio-cached', (req, res) => {
  const tempoInicio = Date.now();
  logRequisicao('/api/gasto-medio-cached', req.query, tempoInicio);
  
  const ultimoPeriodoCache = cacheService.getUltimoPeriodoCache();
  if (ultimoPeriodoCache.gastoMedio) {
    logCache('Recuperação', ultimoPeriodoCache, ultimoPeriodoCache.gastoMedio);
    res.json(ultimoPeriodoCache.gastoMedio);
  } else {
    logCache('Não encontrado', ultimoPeriodoCache, null);
    res.status(404).json({ 
      error: 'Dados não encontrados no cache',
      periodoCache: `${ultimoPeriodoCache.mes}/${ultimoPeriodoCache.ano}`
    });
  }
});

app.get('/api/sazonalidade-variacao-turistas-cached', (req, res) => {
  const tempoInicio = Date.now();
  logRequisicao('/api/sazonalidade-variacao-turistas-cached', req.query, tempoInicio);
  
  const ultimoPeriodoCache = cacheService.getUltimoPeriodoCache();
  if (ultimoPeriodoCache.sazonalidadeVariacaoTuristas) {
    logCache('Recuperação', ultimoPeriodoCache, ultimoPeriodoCache.sazonalidadeVariacaoTuristas);
    res.json(ultimoPeriodoCache.sazonalidadeVariacaoTuristas);
  } else {
    logCache('Não encontrado', ultimoPeriodoCache, null);
    res.status(404).json({ 
      error: 'Dados não encontrados no cache',
      periodoCache: `${ultimoPeriodoCache.mes}/${ultimoPeriodoCache.ano}`
    });
  }
});

app.get('/api/sazonalidade-top-estados-cached', (req, res) => {
  const tempoInicio = Date.now();
  logRequisicao('/api/sazonalidade-top-estados-cached', req.query, tempoInicio);
  
  const ultimoPeriodoCache = cacheService.getUltimoPeriodoCache();
  if (ultimoPeriodoCache.sazonalidadeTopEstados) {
    logCache('Recuperação', ultimoPeriodoCache, ultimoPeriodoCache.sazonalidadeTopEstados);
    res.json(ultimoPeriodoCache.sazonalidadeTopEstados);
  } else {
    logCache('Não encontrado', ultimoPeriodoCache, null);
    res.status(404).json({ 
      error: 'Dados não encontrados no cache',
      periodoCache: `${ultimoPeriodoCache.mes}/${ultimoPeriodoCache.ano}`
    });
  }
});

app.get('/api/sazonalidade-total-turistas-cached', (req, res) => {
  const tempoInicio = Date.now();
  logRequisicao('/api/sazonalidade-total-turistas-cached', req.query, tempoInicio);
  
  const ultimoPeriodoCache = cacheService.getUltimoPeriodoCache();
  if (ultimoPeriodoCache.sazonalidadeTotalTuristas) {
    logCache('Recuperação', ultimoPeriodoCache, ultimoPeriodoCache.sazonalidadeTotalTuristas);
    res.json(ultimoPeriodoCache.sazonalidadeTotalTuristas);
  } else {
    logCache('Não encontrado', ultimoPeriodoCache, null);
    res.status(404).json({ 
      error: 'Dados não encontrados no cache',
      periodoCache: `${ultimoPeriodoCache.mes}/${ultimoPeriodoCache.ano}`
    });
  }
});

app.get('/api/sazonalidade-pico-visitas-cached', (req, res) => {
  const tempoInicio = Date.now();
  logRequisicao('/api/sazonalidade-pico-visitas-cached', req.query, tempoInicio);
  
  const ultimoPeriodoCache = cacheService.getUltimoPeriodoCache();
  if (ultimoPeriodoCache.sazonalidadePicoVisitas) {
    logCache('Recuperação', ultimoPeriodoCache, ultimoPeriodoCache.sazonalidadePicoVisitas);
    res.json(ultimoPeriodoCache.sazonalidadePicoVisitas);
  } else {
    logCache('Não encontrado', ultimoPeriodoCache, null);
    res.status(404).json({ 
      error: 'Dados não encontrados no cache',
      periodoCache: `${ultimoPeriodoCache.mes}/${ultimoPeriodoCache.ano}`
    });
  }
});

app.get('/api/visitas-por-estado-cached', (req, res) => {
  const tempoInicio = Date.now();
  logRequisicao('/api/visitas-por-estado-cached', req.query, tempoInicio);
  
  const ultimoPeriodoCache = cacheService.getUltimoPeriodoCache();
  if (ultimoPeriodoCache.visitasPorEstado) {
    logCache('Recuperação', ultimoPeriodoCache, ultimoPeriodoCache.visitasPorEstado);
    res.json(ultimoPeriodoCache.visitasPorEstado);
  } else {
    logCache('Não encontrado', ultimoPeriodoCache, null);
    res.status(404).json({ 
      error: 'Dados não encontrados no cache',
      periodoCache: `${ultimoPeriodoCache.mes}/${ultimoPeriodoCache.ano}`
    });
  }
});

// Rota para listar status do cache
app.get('/api/status-cache', (req, res) => {
  const tempoInicio = Date.now();
  logRequisicao('/api/status-cache', req.query, tempoInicio);
  
  const ultimoPeriodoCache = cacheService.getUltimoPeriodoCache();
  const mesesAnosPaises = cacheService.getMesesAnosPaises();
  
  const status = {
    mesesAnosPaises: !!mesesAnosPaises,
    ultimoPeriodo: {
      mes: ultimoPeriodoCache.mes,
      ano: ultimoPeriodoCache.ano,
      paisesOrigem: !!ultimoPeriodoCache.paisesOrigem,
      presencaUF: !!ultimoPeriodoCache.presencaUF,
      chegadas: !!ultimoPeriodoCache.chegadas,
      chegadasComparativas: !!ultimoPeriodoCache.chegadasComparativas,
      motivos: !!ultimoPeriodoCache.motivos,
      fontes: !!ultimoPeriodoCache.fontes,
      composicao: !!ultimoPeriodoCache.composicao,
      vias: !!ultimoPeriodoCache.vias,
      genero: !!ultimoPeriodoCache.genero,
      faixaEtaria: !!ultimoPeriodoCache.faixaEtaria,
      gastoMedio: !!ultimoPeriodoCache.gastoMedio,
      sazonalidadeVariacaoTuristas: !!ultimoPeriodoCache.sazonalidadeVariacaoTuristas,
      sazonalidadeTopEstados: !!ultimoPeriodoCache.sazonalidadeTopEstados,
      sazonalidadeTotalTuristas: !!ultimoPeriodoCache.sazonalidadeTotalTuristas,
      sazonalidadePicoVisitas: !!ultimoPeriodoCache.sazonalidadePicoVisitas,
      visitasPorEstado: !!ultimoPeriodoCache.visitasPorEstado
    }
  };
  
  logFormatado('STATUS DO CACHE', {
    'Período': `${ultimoPeriodoCache.mes}/${ultimoPeriodoCache.ano}`,
    'Componentes Ativos': Object.values(status.ultimoPeriodo).filter(Boolean).length,
    'Total de Componentes': Object.keys(status.ultimoPeriodo).length - 2 // Excluindo mes e ano
  });
  
  res.json(status);
});

// Nova rota para obter os dados reais do cache
app.get('/api/cache-data', (req, res) => {
  const tempoInicio = Date.now();
  logRequisicao('/api/cache-data', req.query, tempoInicio);
  
  const ultimoPeriodoCache = cacheService.getUltimoPeriodoCache();
  const mesesAnosPaises = cacheService.getMesesAnosPaises();
  
  const data = {
    mesesAnosPaises: mesesAnosPaises || null,
    ultimoPeriodo: {
      mes: ultimoPeriodoCache.mes,
      ano: ultimoPeriodoCache.ano,
      paisesOrigem: ultimoPeriodoCache.paisesOrigem || null,
      presencaUF: ultimoPeriodoCache.presencaUF || null,
      chegadas: ultimoPeriodoCache.chegadas || null,
      chegadasComparativas: ultimoPeriodoCache.chegadasComparativas || null,
      motivos: ultimoPeriodoCache.motivos || null,
      fontes: ultimoPeriodoCache.fontes || null,
      composicao: ultimoPeriodoCache.composicao || null,
      vias: ultimoPeriodoCache.vias || null,
      genero: ultimoPeriodoCache.genero || null,
      faixaEtaria: ultimoPeriodoCache.faixaEtaria || null,
      gastoMedio: ultimoPeriodoCache.gastoMedio || null,
      sazonalidadeVariacaoTuristas: ultimoPeriodoCache.sazonalidadeVariacaoTuristas || null,
      sazonalidadeTopEstados: ultimoPeriodoCache.sazonalidadeTopEstados || null,
      sazonalidadeTotalTuristas: ultimoPeriodoCache.sazonalidadeTotalTuristas || null,
      sazonalidadePicoVisitas: ultimoPeriodoCache.sazonalidadePicoVisitas || null,
      visitasPorEstado: ultimoPeriodoCache.visitasPorEstado || null
    }
  };
  
  logFormatado('EXPORTAÇÃO DOS DADOS DO CACHE', {
    'Período': `${ultimoPeriodoCache.mes}/${ultimoPeriodoCache.ano}`,
    'Tamanho dos Dados': `${JSON.stringify(data).length} bytes`
  });
  
  res.json(data);
});

// Inicializar cache quando o servidor iniciar
async function inicializarCache() {
  logFormatado('INICIALIZAÇÃO DO CACHE', 'Iniciando processo de inicialização do cache...');
  setTimeout(async () => {
    const tempoInicio = Date.now();
    await cacheService.carregarCacheUltimoPeriodo(app);
    logFormatado('INICIALIZAÇÃO DO CACHE CONCLUÍDA', 'Cache carregado com sucesso', tempoInicio);
  }, 3000);
}

// Chama a inicialização
inicializarCache();

// Atualizar cache periodicamente (a cada 1 hora) apenas para o último período
setInterval(async () => {
  const tempoInicio = Date.now();
  logFormatado('ATUALIZAÇÃO AUTOMÁTICA DO CACHE', 'Iniciando atualização automática do cache...');
  await cacheService.carregarCacheUltimoPeriodo(app);
  logFormatado('ATUALIZAÇÃO AUTOMÁTICA CONCLUÍDA', 'Atualização automática do cache finalizada', tempoInicio);
}, 60 * 60 * 1000); // 1 hora em millisegundos

sequelize.authenticate().then(() => {
  logFormatado('CONEXÃO COM BANCO DE DADOS', 'Sequelize conectado com sucesso');
}).catch(err => {
  logFormatado('ERRO NA CONEXÃO COM BANCO DE DADOS', {
    'Erro': err.message,
    'Detalhes': err.stack
  });
});

app.listen(PORTA_APP, function () {
  console.log(`
    \n\n\n
    ##   ##  ######   #####             ####       ##     ######     ##              ##  ##    ####    ######  
    ##   ##  ##       ##  ##            ## ##     ####      ##      ####             ##  ##     ##         ##  
    ##   ##  ##       ##  ##            ##  ##   ##  ##     ##     ##  ##            ##  ##     ##        ##   
    ## # ##  ####     #####    ######   ##  ##   ######     ##     ######   ######   ##  ##     ##       ##    
    #######  ##       ##  ##            ##  ##   ##  ##     ##     ##  ##            ##  ##     ##      ##     
    ### ###  ##       ##  ##            ## ##    ##  ##     ##     ##  ##             ####      ##     ##      
    ##   ##  ######   #####             ####     ##  ##     ##     ##  ##              ##      ####    ######  
    \n\n\n


    ██     ██ ██ ███████ ███████ ████████  ██████  ██    ██ ██████  
    ██     ██ ██ ██      ██         ██    ██    ██ ██    ██ ██   ██ 
    ██  █  ██ ██ ███████ █████      ██    ██    ██ ██    ██ ██████  
    ██ ███ ██ ██      ██ ██         ██    ██    ██ ██    ██ ██   ██ 
     ███ ███  ██ ███████ ███████    ██     ██████   ██████  ██   ██ 
    \n\n                                                                                                 
    Servidor .: http://localhost:${PORTA_APP} :. \n\n
    Você está rodando sua aplicação em ambiente de .:${process.env.AMBIENTE_PROCESSO}:. \n\n`);
    
  logFormatado('SERVER STARTUP', {
    'Port': PORTA_APP,
    'Host': HOST_APP || 'localhost',
    'Environment': process.env.AMBIENTE_PROCESSO || ambiente_processo,
    'Status': 'Server running successfully'
  });
});