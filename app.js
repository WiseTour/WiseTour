// var ambiente_processo = 'producao';
var ambiente_processo = "desenvolvimento";

var caminho_env = ambiente_processo === "producao" ? ".env" : ".env.dev";
// Acima, temos o uso do operador ternário para definir o caminho do arquivo .env
// A sintaxe do operador ternário é: condição ? valor_se_verdadeiro : valor_se_falso

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
var internalRoutes = require("./src/routes/internalRoutes");
var ipRouter = require("./src/routes/ipRoute"); // Nova rota para IP
var sequelize = require('./src//database/sequelizeConfig');
var graficoRouter = require("./src/routes/graficoRoute");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
}); // Definição de rota para o arquivo home html quando iniciar a API
app.use(express.static(path.join(__dirname, "public")));
app.use("/common", express.static(path.join(__dirname, "common")));
app.use("/auth", express.static(path.join(__dirname, "auth")));
app.use("/private", express.static(path.join(__dirname, "private")));
app.use("/internal", express.static(path.join(__dirname, "internal")));
app.use(cors());

app.use("/", indexRouter);
app.use("/usuario", usuarioRouter);
app.use("/internalRoutes", internalRoutes);
app.use("/grafico", graficoRouter);
app.use("/ip", ipRouter); // Rota para serviços de IP

const graficoController = require('./src/controllers/graficoController');

// Rotas simplificadas de cache
app.get('/grafico/perfil-estimado-turista/meses-anos-paises', graficoController.getMesesAnosPaises);

// Cache para meses-anos-paises
app.get('/api/meses-anos-paises-cached', (req, res) => {
  const mesesAnosPaises = cacheService.getMesesAnosPaises(); // CORRIGIDO: usar cacheService
  if (mesesAnosPaises) {
    res.json(mesesAnosPaises);
  } else {
    res.status(404).json({ error: 'Dados ainda não carregados' });
  }
});

// Cache para países origem
app.get('/api/paises-origem-cached', (req, res) => {
  const ultimoPeriodoCache = cacheService.getUltimoPeriodoCache();
  if (ultimoPeriodoCache.paisesOrigem) {
    res.json(ultimoPeriodoCache.paisesOrigem);
  } else {
    res.status(404).json({ 
      error: 'Dados não encontrados no cache',
      periodoCache: `${ultimoPeriodoCache.mes}/${ultimoPeriodoCache.ano}`
    });
  }
});

// Cache para presença UF
app.get('/api/presenca-uf-cached', (req, res) => {
  const ultimoPeriodoCache = cacheService.getUltimoPeriodoCache();
  if (ultimoPeriodoCache.presencaUF) {
    res.json(ultimoPeriodoCache.presencaUF);
  } else {
    res.status(404).json({ 
      error: 'Dados não encontrados no cache',
      periodoCache: `${ultimoPeriodoCache.mes}/${ultimoPeriodoCache.ano}`
    });
  }
});

// Cache para chegadas
app.get('/api/chegadas-cached', (req, res) => {
  const ultimoPeriodoCache = cacheService.getUltimoPeriodoCache();
  if (ultimoPeriodoCache.chegadas) {
    res.json(ultimoPeriodoCache.chegadas);
  } else {
    res.status(404).json({ 
      error: 'Dados não encontrados no cache',
      periodoCache: `${ultimoPeriodoCache.mes}/${ultimoPeriodoCache.ano}`
    });
  }
});

// Cache para chegadas comparativas
app.get('/api/chegadas-comparativas-cached', (req, res) => {
  const ultimoPeriodoCache = cacheService.getUltimoPeriodoCache();
  if (ultimoPeriodoCache.chegadasComparativas) {
    res.json(ultimoPeriodoCache.chegadasComparativas);
  } else {
    res.status(404).json({ 
      error: 'Dados não encontrados no cache',
      periodoCache: `${ultimoPeriodoCache.mes}/${ultimoPeriodoCache.ano}`
    });
  }
});

// Rota para atualizar cache manualmente
app.post('/api/atualizar-cache', async (req, res) => {
  const { mes, ano } = req.body;
  
  if (!mes || !ano) {
    return res.status(400).json({ error: 'Mês e ano são obrigatórios' });
  }
  
  const sucesso = await cacheService.atualizarCachePeriodo(app, mes, ano);
  
  if (sucesso) {
    res.json({ message: `Cache atualizado para ${mes}/${ano}` });
  } else {
    res.status(500).json({ error: 'Erro ao atualizar cache' });
  }
});

// Rota para recarregar cache do último período
app.post('/api/recarregar-cache', async (req, res) => {
  try {
    await cacheService.carregarCacheUltimoPeriodo(app); // CORRIGIDO: passar app como parâmetro
    const ultimoPeriodoCache = cacheService.getUltimoPeriodoCache(); // CORRIGIDO: pegar depois de carregar
    res.json({ 
      message: 'Cache recarregado para o último período',
      periodo: `${ultimoPeriodoCache.mes}/${ultimoPeriodoCache.ano}`
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao recarregar cache' });
  }
});

app.get('/api/motivos-cached', (req, res) => {
  const ultimoPeriodoCache = cacheService.getUltimoPeriodoCache();
  if (ultimoPeriodoCache.motivos) {
    res.json(ultimoPeriodoCache.motivos);
  } else {
    res.status(404).json({ 
      error: 'Dados não encontrados no cache',
      periodoCache: `${ultimoPeriodoCache.mes}/${ultimoPeriodoCache.ano}`
    });
  }
});

// Cache para fontes de informação
app.get('/api/fontes-cached', (req, res) => {
  const ultimoPeriodoCache = cacheService.getUltimoPeriodoCache();
  if (ultimoPeriodoCache.fontes) {
    res.json(ultimoPeriodoCache.fontes);
  } else {
    res.status(404).json({ 
      error: 'Dados não encontrados no cache',
      periodoCache: `${ultimoPeriodoCache.mes}/${ultimoPeriodoCache.ano}`
    });
  }
});

// Cache para composição
app.get('/api/composicao-cached', (req, res) => {
  const ultimoPeriodoCache = cacheService.getUltimoPeriodoCache();
  if (ultimoPeriodoCache.composicao) {
    res.json(ultimoPeriodoCache.composicao);
  } else {
    res.status(404).json({ 
      error: 'Dados não encontrados no cache',
      periodoCache: `${ultimoPeriodoCache.mes}/${ultimoPeriodoCache.ano}`
    });
  }
});

// Cache para vias
app.get('/api/vias-cached', (req, res) => {
  const ultimoPeriodoCache = cacheService.getUltimoPeriodoCache();
  if (ultimoPeriodoCache.vias) {
    res.json(ultimoPeriodoCache.vias);
  } else {
    res.status(404).json({ 
      error: 'Dados não encontrados no cache',
      periodoCache: `${ultimoPeriodoCache.mes}/${ultimoPeriodoCache.ano}`
    });
  }
});

// Cache para gênero
app.get('/api/genero-cached', (req, res) => {
  const ultimoPeriodoCache = cacheService.getUltimoPeriodoCache();
  if (ultimoPeriodoCache.genero) {
    res.json(ultimoPeriodoCache.genero);
  } else {
    res.status(404).json({ 
      error: 'Dados não encontrados no cache',
      periodoCache: `${ultimoPeriodoCache.mes}/${ultimoPeriodoCache.ano}`
    });
  }
});

// Cache para faixa etária
app.get('/api/faixa-etaria-cached', (req, res) => {
  const ultimoPeriodoCache = cacheService.getUltimoPeriodoCache();
  if (ultimoPeriodoCache.faixaEtaria) {
    res.json(ultimoPeriodoCache.faixaEtaria);
  } else {
    res.status(404).json({ 
      error: 'Dados não encontrados no cache',
      periodoCache: `${ultimoPeriodoCache.mes}/${ultimoPeriodoCache.ano}`
    });
  }
});

// Cache para gasto médio
app.get('/api/gasto-medio-cached', (req, res) => {
  const ultimoPeriodoCache = cacheService.getUltimoPeriodoCache();
  if (ultimoPeriodoCache.gastoMedio) {
    res.json(ultimoPeriodoCache.gastoMedio);
  } else {
    res.status(404).json({ 
      error: 'Dados não encontrados no cache',
      periodoCache: `${ultimoPeriodoCache.mes}/${ultimoPeriodoCache.ano}`
    });
  }
});

app.get('/api/sazonalidade-variacao-turistas-cached', (req, res) => {
  const ultimoPeriodoCache = cacheService.getUltimoPeriodoCache();
  if (ultimoPeriodoCache.sazonalidadeVariacaoTuristas) {
    res.json(ultimoPeriodoCache.sazonalidadeVariacaoTuristas);
  } else {
    res.status(404).json({ 
      error: 'Dados não encontrados no cache',
      periodoCache: `${ultimoPeriodoCache.mes}/${ultimoPeriodoCache.ano}`
    });
  }
});

app.get('/api/sazonalidade-top-estados-cached', (req, res) => {
  const ultimoPeriodoCache = cacheService.getUltimoPeriodoCache();
  if (ultimoPeriodoCache.sazonalidadeTopEstados) {
    res.json(ultimoPeriodoCache.sazonalidadeTopEstados);
  } else {
    res.status(404).json({ 
      error: 'Dados não encontrados no cache',
      periodoCache: `${ultimoPeriodoCache.mes}/${ultimoPeriodoCache.ano}`
    });
  }
});

app.get('/api/sazonalidade-total-turistas-cached', (req, res) => {
  const ultimoPeriodoCache = cacheService.getUltimoPeriodoCache();
  if (ultimoPeriodoCache.sazonalidadeTotalTuristas) {
    res.json(ultimoPeriodoCache.sazonalidadeTotalTuristas);
  } else {
    res.status(404).json({ 
      error: 'Dados não encontrados no cache',
      periodoCache: `${ultimoPeriodoCache.mes}/${ultimoPeriodoCache.ano}`
    });
  }
});

app.get('/api/sazonalidade-pico-visitas-cached', (req, res) => {
  const ultimoPeriodoCache = cacheService.getUltimoPeriodoCache();
  if (ultimoPeriodoCache.sazonalidadePicoVisitas) {
    res.json(ultimoPeriodoCache.sazonalidadePicoVisitas);
  } else {
    res.status(404).json({ 
      error: 'Dados não encontrados no cache',
      periodoCache: `${ultimoPeriodoCache.mes}/${ultimoPeriodoCache.ano}`
    });
  }
});

app.get('/api/visitas-por-estado-cached', (req, res) => {
  const ultimoPeriodoCache = cacheService.getUltimoPeriodoCache();
  if (ultimoPeriodoCache.visitasPorEstado) {
    res.json(ultimoPeriodoCache.visitasPorEstado);
  } else {
    res.status(404).json({ 
      error: 'Dados não encontrados no cache',
      periodoCache: `${ultimoPeriodoCache.mes}/${ultimoPeriodoCache.ano}`
    });
  }
});

// Rota para listar status do cache
app.get('/api/status-cache', (req, res) => {
  const ultimoPeriodoCache = cacheService.getUltimoPeriodoCache();
  const mesesAnosPaises = cacheService.getMesesAnosPaises(); // CORRIGIDO: usar cacheService
  
  res.json({
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
  });
});

// Nova rota para obter os dados reais do cache
app.get('/api/cache-data', (req, res) => {
  const ultimoPeriodoCache = cacheService.getUltimoPeriodoCache();
  const mesesAnosPaises = cacheService.getMesesAnosPaises(); // CORRIGIDO: usar cacheService
  
  res.json({
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
  });
});

// Inicializar cache quando o servidor iniciar
async function inicializarCache() {
  console.log('Aguardando 2 segundos antes de carregar cache...');
  setTimeout(async () => {
    await cacheService.carregarCacheUltimoPeriodo(app); // CORRIGIDO: passar app como parâmetro
  }, 2000); // Aguarda 2 segundos para garantir que o servidor esteja pronto
}

// Chama a inicialização
inicializarCache();

// Atualizar cache periodicamente (a cada 1 hora) apenas para o último período
setInterval(async () => {
  console.log('Atualizando cache automaticamente...');
  await cacheService.carregarCacheUltimoPeriodo(app); // CORRIGIDO: usar cacheService e passar app
}, 60 * 60 * 1000); // 1 hora em millisegundos

sequelize.authenticate().then(() => {
  console.log("Conectado ao banco com Sequelize");
}).catch(err => {
  console.error("Erro na conexão Sequelize:", err);
});

app.listen(PORTA_APP, function () {
  console.log(`
    ##   ##  ######   #####             ####       ##     ######     ##              ##  ##    ####    ######  
    ##   ##  ##       ##  ##            ## ##     ####      ##      ####             ##  ##     ##         ##  
    ##   ##  ##       ##  ##            ##  ##   ##  ##     ##     ##  ##            ##  ##     ##        ##   
    ## # ##  ####     #####    ######   ##  ##   ######     ##     ######   ######   ##  ##     ##       ##    
    #######  ##       ##  ##            ##  ##   ##  ##     ##     ##  ##            ##  ##     ##      ##     
    ### ###  ##       ##  ##            ## ##    ##  ##     ##     ##  ##             ####      ##     ##      
    ##   ##  ######   #####             ####     ##  ##     ##     ##  ##              ##      ####    ######  
    \n\n\n                                                                                                 
    Servidor do seu site já está rodando! Acesse o caminho a seguir para visualizar .: http://localhost:${PORTA_APP} :. \n\n
    Você está rodando sua aplicação em ambiente de .:${process.env.AMBIENTE_PROCESSO}:. \n\n
    \tSe .:desenvolvimento:. você está se conectando ao banco local. \n
    \tSe .:producao:. você está se conectando ao banco remoto. \n\n
    \t\tPara alterar o ambiente, comente ou descomente as linhas 1 ou 2 no arquivo 'app.js'\n\n`);
});