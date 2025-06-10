const request = require('supertest');

// Função para formatação de logs padronizada
function logFormatado(operacao, detalhes, tempoInicio = null) {
  const timestamp = new Date().toISOString();
  const separator = "=".repeat(150);
  
  console.log(separator);
  console.log(`[${timestamp}] ${operacao}:`);
  
  if (typeof detalhes === 'string') {
    console.log(detalhes);
  } else if (typeof detalhes === 'object') {
    Object.entries(detalhes).forEach(([chave, valor]) => {
      console.log(`${chave}: ${valor}`);
    });
  }
  
  if (tempoInicio) {
    const tempoExecucao = Date.now() - tempoInicio;
    console.log(`Execution time: ${tempoExecucao}ms`);
  }
  
  console.log(separator);
}

// Função para log de requisições HTTP
function logRequisicao(endpoint, parametros, tempoInicio = null) {
  const detalhes = {
    'HTTP Request': `GET ${endpoint}`,
    'Parameters': Object.entries(parametros).map(([k, v]) => `${k}=${v}`).join('&') || 'none'
  };
  
  logFormatado('API REQUEST', detalhes, tempoInicio);
}

// Função para log de cache
function logCache(operacao, periodo, dados) {
  const detalhes = {
    'Cache Operation': operacao,
    'Period': `${periodo.mes}/${periodo.ano}`,
    'Data Status': dados ? 'SUCCESS' : 'FAILED',
    'Data Size': dados ? `${JSON.stringify(dados).length} bytes` : '0 bytes'
  };
  
  logFormatado('CACHE OPERATION', detalhes);
}

// Cache simplificado - apenas para o último período
let mesesAnosPaises;
let ultimoPeriodoCache = {
  mes: null,
  ano: null,
  paisesOrigem: null,
  presencaUF: null,
  chegadas: null,
  chegadasComparativas: null,
  motivos: null,
  fontes: null,
  composicao: null,
  vias: null,
  genero: null,
  faixaEtaria: null,
  gastoMedio: null,
  // Novas propriedades para as rotas de sazonalidade
  sazonalidadeVariacaoTuristas: null,
  sazonalidadeTopEstados: null,
  sazonalidadeTotalTuristas: null,
  sazonalidadePicoVisitas: null,
  visitasPorEstado: null
};

// Função para buscar dados de países origem
async function obterPaisesOrigem(app, mes, ano) {
  const tempoInicio = Date.now();
  const endpoint = `/grafico/paises-origem`;
  const parametros = { mes, ano };
  
  try {
    logRequisicao(endpoint, parametros);
    
    const response = await request(app)
      .get(`${endpoint}?mes=${mes}&ano=${ano}`);
    
    const resultado = response.body;
    
    logFormatado('RESPONSE DATA', {
      'Endpoint': endpoint,
      'Status Code': response.status,
      'Data Type': typeof resultado,
      'Has Data': !!resultado
    }, tempoInicio);
    
    return resultado;
  } catch (error) {
    logFormatado('ERROR', {
      'Endpoint': endpoint,
      'Error Message': error.message,
      'Stack': error.stack
    }, tempoInicio);
    return null;
  }
}

// Função untuk buscar dados de presença por UF
async function obterPresencaUF(app, mes, ano) {
  const tempoInicio = Date.now();
  const endpoint = `/grafico/presenca-uf`;
  const parametros = { mes, ano };
  
  try {
    logRequisicao(endpoint, parametros);
    
    const response = await request(app)
      .get(`${endpoint}?mes=${mes}&ano=${ano}`);
    
    const resultado = response.body;
    
    logFormatado('RESPONSE DATA', {
      'Endpoint': endpoint,
      'Status Code': response.status,
      'Data Type': typeof resultado,
      'Has Data': !!resultado
    }, tempoInicio);
    
    return resultado;
  } catch (error) {
    logFormatado('ERROR', {
      'Endpoint': endpoint,
      'Error Message': error.message,
      'Stack': error.stack
    }, tempoInicio);
    return null;
  }
}

// Função para buscar dados de chegadas
async function obterChegadas(app, mes, ano) {
  const tempoInicio = Date.now();
  const endpoint = `/grafico/chegadas`;
  const parametros = { mes, ano };
  
  try {
    logRequisicao(endpoint, parametros);
    
    const response = await request(app)
      .get(`${endpoint}?mes=${mes}&ano=${ano}`);
    
    const resultado = response.body;
    
    logFormatado('RESPONSE DATA', {
      'Endpoint': endpoint,
      'Status Code': response.status,
      'Data Type': typeof resultado,
      'Has Data': !!resultado
    }, tempoInicio);
    
    return resultado;
  } catch (error) {
    logFormatado('ERROR', {
      'Endpoint': endpoint,
      'Error Message': error.message,
      'Stack': error.stack
    }, tempoInicio);
    return null;
  }
}

// Função para buscar dados de chegadas comparativas
async function obterChegadasComparativas(app, mes, ano) {
  const tempoInicio = Date.now();
  const endpoint = `/grafico/chegadas-comparativas`;
  const parametros = { mes, ano };
  
  try {
    logRequisicao(endpoint, parametros);
    
    const response = await request(app)
      .get(`${endpoint}?mes=${mes}&ano=${ano}`);
    
    const resultado = response.body;
    
    logFormatado('RESPONSE DATA', {
      'Endpoint': endpoint,
      'Status Code': response.status,
      'Data Type': typeof resultado,
      'Has Data': !!resultado
    }, tempoInicio);
    
    return resultado;
  } catch (error) {
    logFormatado('ERROR', {
      'Endpoint': endpoint,
      'Error Message': error.message,
      'Stack': error.stack
    }, tempoInicio);
    return null;
  }
}

// Função para buscar dados de motivos
async function obterMotivos(app, mes, ano) {
  const tempoInicio = Date.now();
  const endpoint = `/grafico/motivo`;
  const parametros = { mes, ano };
  
  try {
    logRequisicao(endpoint, parametros);
    
    const response = await request(app)
      .get(`${endpoint}?mes=${mes}&ano=${ano}`);
    
    const resultado = response.body;
    
    logFormatado('RESPONSE DATA', {
      'Endpoint': endpoint,
      'Status Code': response.status,
      'Data Type': typeof resultado,
      'Has Data': !!resultado
    }, tempoInicio);
    
    return resultado;
  } catch (error) {
    logFormatado('ERROR', {
      'Endpoint': endpoint,
      'Error Message': error.message,
      'Stack': error.stack
    }, tempoInicio);
    return null;
  }
}

// Função para buscar dados de fontes de informação
async function obterFontes(app, mes, ano) {
  const tempoInicio = Date.now();
  const endpoint = `/grafico/fontes`;
  const parametros = { mes, ano };
  
  try {
    logRequisicao(endpoint, parametros);
    
    const response = await request(app)
      .get(`${endpoint}?mes=${mes}&ano=${ano}`);
    
    const resultado = response.body;
    
    logFormatado('RESPONSE DATA', {
      'Endpoint': endpoint,
      'Status Code': response.status,
      'Data Type': typeof resultado,
      'Has Data': !!resultado
    }, tempoInicio);
    
    return resultado;
  } catch (error) {
    logFormatado('ERROR', {
      'Endpoint': endpoint,
      'Error Message': error.message,
      'Stack': error.stack
    }, tempoInicio);
    return null;
  }
}

// Função para buscar dados de composição
async function obterComposicao(app, mes, ano) {
  const tempoInicio = Date.now();
  const endpoint = `/grafico/composicao`;
  const parametros = { mes, ano };
  
  try {
    logRequisicao(endpoint, parametros);
    
    const response = await request(app)
      .get(`${endpoint}?mes=${mes}&ano=${ano}`);
    
    const resultado = response.body;
    
    logFormatado('RESPONSE DATA', {
      'Endpoint': endpoint,
      'Status Code': response.status,
      'Data Type': typeof resultado,
      'Has Data': !!resultado
    }, tempoInicio);
    
    return resultado;
  } catch (error) {
    logFormatado('ERROR', {
      'Endpoint': endpoint,
      'Error Message': error.message,
      'Stack': error.stack
    }, tempoInicio);
    return null;
  }
}

// Função para buscar dados de vias
async function obterVias(app, mes, ano) {
  const tempoInicio = Date.now();
  const endpoint = `/grafico/vias`;
  const parametros = { mes, ano };
  
  try {
    logRequisicao(endpoint, parametros);
    
    const response = await request(app)
      .get(`${endpoint}?mes=${mes}&ano=${ano}`);
    
    const resultado = response.body;
    
    logFormatado('RESPONSE DATA', {
      'Endpoint': endpoint,
      'Status Code': response.status,
      'Data Type': typeof resultado,
      'Has Data': !!resultado
    }, tempoInicio);
    
    return resultado;
  } catch (error) {
    logFormatado('ERROR', {
      'Endpoint': endpoint,
      'Error Message': error.message,
      'Stack': error.stack
    }, tempoInicio);
    return null;
  }
}

// Função para buscar dados de gênero
async function obterGenero(app, mes, ano) {
  const tempoInicio = Date.now();
  const endpoint = `/grafico/genero`;
  const parametros = { mes, ano };
  
  try {
    logRequisicao(endpoint, parametros);
    
    const response = await request(app)
      .get(`${endpoint}?mes=${mes}&ano=${ano}`);
    
    const resultado = response.body;
    
    logFormatado('RESPONSE DATA', {
      'Endpoint': endpoint,
      'Status Code': response.status,
      'Data Type': typeof resultado,
      'Has Data': !!resultado
    }, tempoInicio);
    
    return resultado;
  } catch (error) {
    logFormatado('ERROR', {
      'Endpoint': endpoint,
      'Error Message': error.message,
      'Stack': error.stack
    }, tempoInicio);
    return null;
  }
}

// Função para buscar dados de faixa etária
async function obterFaixaEtaria(app, mes, ano) {
  const tempoInicio = Date.now();
  const endpoint = `/grafico/faixa_etaria`;
  const parametros = { mes, ano };
  
  try {
    logRequisicao(endpoint, parametros);
    
    const response = await request(app)
      .get(`${endpoint}?mes=${mes}&ano=${ano}`);
    
    const resultado = response.body;
    
    logFormatado('RESPONSE DATA', {
      'Endpoint': endpoint,
      'Status Code': response.status,
      'Data Type': typeof resultado,
      'Has Data': !!resultado
    }, tempoInicio);
    
    return resultado;
  } catch (error) {
    logFormatado('ERROR', {
      'Endpoint': endpoint,
      'Error Message': error.message,
      'Stack': error.stack
    }, tempoInicio);
    return null;
  }
}

// Função para buscar dados de gasto médio
async function obterGastoMedio(app, mes, ano) {
  const tempoInicio = Date.now();
  const endpoint = `/grafico/gasto-medio`;
  const parametros = { mes, ano };
  
  try {
    logRequisicao(endpoint, parametros);
    
    const response = await request(app)
      .get(`${endpoint}?mes=${mes}&ano=${ano}`);
    
    const resultado = response.body;
    
    logFormatado('RESPONSE DATA', {
      'Endpoint': endpoint,
      'Status Code': response.status,
      'Data Type': typeof resultado,
      'Has Data': !!resultado
    }, tempoInicio);
    
    return resultado;
  } catch (error) {
    logFormatado('ERROR', {
      'Endpoint': endpoint,
      'Error Message': error.message,
      'Stack': error.stack
    }, tempoInicio);
    return null;
  }
}

async function obterSazonalidadeVariacaoTuristas(app, mes, ano) {
  const tempoInicio = Date.now();
  const endpoint = `/grafico/sazonalidade/variacao-turistas`;
  const parametros = { mes, ano };
  
  try {
    logRequisicao(endpoint, parametros);
    
    const response = await request(app)
      .get(`${endpoint}?mes=${mes}&ano=${ano}`);
    
    const resultado = response.body;
    
    logFormatado('RESPONSE DATA', {
      'Endpoint': endpoint,
      'Status Code': response.status,
      'Data Type': typeof resultado,
      'Has Data': !!resultado
    }, tempoInicio);
    
    return resultado;
  } catch (error) {
    logFormatado('ERROR', {
      'Endpoint': endpoint,
      'Error Message': error.message,
      'Stack': error.stack
    }, tempoInicio);
    return null;
  }
}

async function obterSazonalidadeTopEstados(app, mes, ano) {
  const tempoInicio = Date.now();
  const endpoint = `/grafico/sazonalidade/top-estados`;
  const parametros = { mes, ano };
  
  try {
    logRequisicao(endpoint, parametros);
    
    const response = await request(app)
      .get(`${endpoint}?mes=${mes}&ano=${ano}`);
    
    const resultado = response.body;
    
    logFormatado('RESPONSE DATA', {
      'Endpoint': endpoint,
      'Status Code': response.status,
      'Data Type': typeof resultado,
      'Has Data': !!resultado
    }, tempoInicio);
    
    return resultado;
  } catch (error) {
    logFormatado('ERROR', {
      'Endpoint': endpoint,
      'Error Message': error.message,
      'Stack': error.stack
    }, tempoInicio);
    return null;
  }
}

async function obterSazonalidadeTotalTuristas(app, mes, ano) {
  const tempoInicio = Date.now();
  const endpoint = `/grafico/sazonalidade/total-turistas`;
  const parametros = { mes, ano };
  
  try {
    logRequisicao(endpoint, parametros);
    
    const response = await request(app)
      .get(`${endpoint}?mes=${mes}&ano=${ano}`);
    
    const resultado = response.body;
    
    logFormatado('RESPONSE DATA', {
      'Endpoint': endpoint,
      'Status Code': response.status,
      'Data Type': typeof resultado,
      'Has Data': !!resultado
    }, tempoInicio);
    
    return resultado;
  } catch (error) {
    logFormatado('ERROR', {
      'Endpoint': endpoint,
      'Error Message': error.message,
      'Stack': error.stack
    }, tempoInicio);
    return null;
  }
}

async function obterSazonalidadePicoVisitas(app, mes, ano) {
  const tempoInicio = Date.now();
  const endpoint = `/grafico/sazonalidade/pico-visitas-unica-linha`;
  const parametros = { mes, ano };
  
  try {
    logRequisicao(endpoint, parametros);
    
    const response = await request(app)
      .get(`${endpoint}?mes=${mes}&ano=${ano}`);
    
    const resultado = response.body;
    
    logFormatado('RESPONSE DATA', {
      'Endpoint': endpoint,
      'Status Code': response.status,
      'Data Type': typeof resultado,
      'Has Data': !!resultado
    }, tempoInicio);
    
    return resultado;
  } catch (error) {
    logFormatado('ERROR', {
      'Endpoint': endpoint,
      'Error Message': error.message,
      'Stack': error.stack
    }, tempoInicio);
    return null;
  }
}

async function obterVisitasPorEstado(app, mes, ano) {
  const tempoInicio = Date.now();
  const endpoint = `/grafico/visitas-por-estado`;
  const parametros = { mes, ano };
  
  try {
    logRequisicao(endpoint, parametros);
    
    const response = await request(app)
      .get(`${endpoint}?mes=${mes}&ano=${ano}`);
    
    const resultado = response.body;
    
    logFormatado('RESPONSE DATA', {
      'Endpoint': endpoint,
      'Status Code': response.status,
      'Data Type': typeof resultado,
      'Has Data': !!resultado
    }, tempoInicio);
    
    return resultado;
  } catch (error) {
    logFormatado('ERROR', {
      'Endpoint': endpoint,
      'Error Message': error.message,
      'Stack': error.stack
    }, tempoInicio);
    return null;
  }
}

// Fazer a requisição e guardar o resultado
async function obterDados(app) {
  const tempoInicio = Date.now();
  const endpoint = '/grafico/perfil-estimado-turista/meses-anos-paises';
  
  try {
    logRequisicao(endpoint, {});
    
    const response = await request(app)
      .get(endpoint);
    
    const resultado = response.body;
    
    logFormatado('RESPONSE DATA', {
      'Endpoint': endpoint,
      'Status Code': response.status,
      'Data Type': typeof resultado,
      'Has Data': !!resultado,
      'Is Array': Array.isArray(resultado)
    }, tempoInicio);
    
    return resultado;
  } catch (error) {
    logFormatado('ERROR', {
      'Endpoint': endpoint,
      'Error Message': error.message,
      'Stack': error.stack
    }, tempoInicio);
    return null;
  }
}

// Função para encontrar o último período dos dados mesesAnosPaises
function encontrarUltimoPeriodo(dadosMesesAnosPaises) {
  const tempoInicio = Date.now();
  
  logFormatado('PERIOD ANALYSIS', {
    'Input Data Type': typeof dadosMesesAnosPaises,
    'Is Array': Array.isArray(dadosMesesAnosPaises),
    'Has Data': !!dadosMesesAnosPaises
  });
  
  if (!dadosMesesAnosPaises) {
    logFormatado('ERROR', 'Dados mesesAnosPaises são null ou undefined');
    return null;
  }

  // Extrai o array de dados
  let dados = dadosMesesAnosPaises;
  
  // Se for um objeto, procura pela propriedade que contém o array
  if (!Array.isArray(dados)) {
    const possiveisChaves = ['dados', 'data', 'resultado', 'meses', 'periodos', 'paises'];
    
    for (const chave of possiveisChaves) {
      if (dados[chave] && Array.isArray(dados[chave])) {
        logFormatado('DATA EXTRACTION', `Array encontrado na propriedade: ${chave}`);
        dados = dados[chave];
        break;
      }
    }
    
    if (!Array.isArray(dados)) {
      if (typeof dados === 'object' && dados !== null) {
        if (dados.hasOwnProperty('mes') || dados.hasOwnProperty('ano') || 
            dados.hasOwnProperty('month') || dados.hasOwnProperty('year')) {
          dados = [dados];
        } else {
          const valores = Object.values(dados);
          if (valores.length > 0 && Array.isArray(valores[0])) {
            dados = valores[0];
          }
        }
      }
    }
  }

  if (!Array.isArray(dados) || dados.length === 0) {
    logFormatado('ERROR', {
      'Message': 'Dados mesesAnosPaises inválidos ou vazios após verificação',
      'Final Data Type': typeof dados,
      'Is Array': Array.isArray(dados),
      'Length': dados?.length || 0
    });
    return null;
  }

  logFormatado('DATA VALIDATION', {
    'Array Length': dados.length,
    'First Item Keys': Object.keys(dados[0]).join(', ')
  });

  // Lista expandida de possíveis nomes para mês e ano
  const possiveisNomesMes = ['mes', 'month', 'mes_numero', 'numeroMes', 'mesNumero', 'mes_num', 'mês'];
  const possiveisNomesAno = ['ano', 'year', 'ano_numero', 'anoNumero', 'ano_num'];

  let propriedadeMes = null;
  let propriedadeAno = null;

  // Encontra as propriedades corretas de mês e ano
  for (const nome of possiveisNomesMes) {
    if (dados[0].hasOwnProperty(nome)) {
      propriedadeMes = nome;
      break;
    }
  }

  for (const nome of possiveisNomesAno) {
    if (dados[0].hasOwnProperty(nome)) {
      propriedadeAno = nome;
      break;
    }
  }

  logFormatado('PROPERTY MAPPING', {
    'Month Property': propriedadeMes || 'NOT FOUND',
    'Year Property': propriedadeAno || 'NOT FOUND'
  });

  if (!propriedadeMes || !propriedadeAno) {
    logFormatado('ERROR', {
      'Message': 'Não foi possível encontrar propriedades de mês e ano',
      'Available Properties': Object.keys(dados[0]).join(', ')
    });
    return null;
  }

  // Cria um Set para armazenar períodos únicos
  const periodosUnicos = new Set();
  
  // Processa todos os registros para encontrar períodos únicos
  dados.forEach(item => {
    const mes = parseInt(item[propriedadeMes]);
    const ano = parseInt(item[propriedadeAno]);
    
    if (!isNaN(mes) && !isNaN(ano)) {
      const chavePeríodo = `${ano}${mes.toString().padStart(2, '0')}`;
      periodosUnicos.add(chavePeríodo);
    }
  });

  logFormatado('PERIOD PROCESSING', {
    'Unique Periods Found': periodosUnicos.size,
    'Periods': Array.from(periodosUnicos).join(', ')
  });

  if (periodosUnicos.size === 0) {
    logFormatado('ERROR', 'Nenhum período válido encontrado');
    return null;
  }

  // Converte o Set para array e ordena para encontrar o mais recente
  const periodosOrdenados = Array.from(periodosUnicos).sort((a, b) => b.localeCompare(a));
  const ultimoPeríodo = periodosOrdenados[0];
  
  // Extrai mês e ano do período mais recente
  const ano = parseInt(ultimoPeríodo.substring(0, 4));
  const mes = parseInt(ultimoPeríodo.substring(4));

  const resultado = { mes, ano };
  
  logFormatado('PERIOD RESULT', {
    'Latest Period': ultimoPeríodo,
    'Month': mes,
    'Year': ano
  }, tempoInicio);
  
  return resultado;
}

// Função principal para carregar cache apenas do último período
async function carregarCacheUltimoPeriodo(app) {
  const tempoInicio = Date.now();
  
  logFormatado('CACHE INITIALIZATION', 'Iniciando carregamento do cache para o último período...');
  
  try {
    // Carrega dados básicos primeiro
    logFormatado('DATA LOADING', 'Buscando dados mesesAnosPaises...');
    const dadosMesesAnosPaises = await obterDados(app);
    
    if (!dadosMesesAnosPaises) {
      logFormatado('ERROR', 'Falha ao obter dados mesesAnosPaises');
      return;
    }
    
    mesesAnosPaises = dadosMesesAnosPaises;
    logFormatado('SUCCESS', 'Dados mesesAnosPaises carregados com sucesso');
    
    // Encontra o último período disponível
    const ultimoPeriodo = encontrarUltimoPeriodo(dadosMesesAnosPaises);
    
    if (!ultimoPeriodo) {
      logFormatado('FALLBACK', {
        'Message': 'Não foi possível determinar o último período',
        'Action': 'Usando valores padrão: mes=12, ano=2024'
      });
      
      const mesPadrao = 12;
      const anoPadrao = 2024;
      
      await executarRequisicoesPeriodo(app, mesPadrao, anoPadrao);
      
      logFormatado('CACHE COMPLETE', {
        'Period': `${mesPadrao}/${anoPadrao}`,
        'Status': 'FALLBACK SUCCESS'
      }, tempoInicio);
      return;
    }
    
    const { mes, ano } = ultimoPeriodo;
    logFormatado('CACHE LOADING', `Carregando cache para o último período: ${mes}/${ano}`);
    
    // Executa todas as requisições
    await executarRequisicoesPeriodo(app, mes, ano);
    
    // Log do status do cache
    const statusCache = {
      'Period': `${mes}/${ano}`,
      'paisesOrigem': !!ultimoPeriodoCache.paisesOrigem,
      'presencaUF': !!ultimoPeriodoCache.presencaUF,
      'chegadas': !!ultimoPeriodoCache.chegadas,
      'chegadasComparativas': !!ultimoPeriodoCache.chegadasComparativas,
      'motivos': !!ultimoPeriodoCache.motivos,
      'fontes': !!ultimoPeriodoCache.fontes,
      'composicao': !!ultimoPeriodoCache.composicao,
      'vias': !!ultimoPeriodoCache.vias,
      'genero': !!ultimoPeriodoCache.genero,
      'faixaEtaria': !!ultimoPeriodoCache.faixaEtaria,
      'gastoMedio': !!ultimoPeriodoCache.gastoMedio,
      'sazonalidadeVariacaoTuristas': !!ultimoPeriodoCache.sazonalidadeVariacaoTuristas,
      'sazonalidadeTopEstados': !!ultimoPeriodoCache.sazonalidadeTopEstados,
      'sazonalidadeTotalTuristas': !!ultimoPeriodoCache.sazonalidadeTotalTuristas,
      'sazonalidadePicoVisitas': !!ultimoPeriodoCache.sazonalidadePicoVisitas,
      'visitasPorEstado': !!ultimoPeriodoCache.visitasPorEstado
    };
    
    logFormatado('CACHE COMPLETE', statusCache, tempoInicio);
    
  } catch (error) {
    logFormatado('CACHE ERROR', {
      'Error Message': error.message,
      'Stack': error.stack
    });
    
    // Fallback em caso de erro
    logFormatado('FALLBACK EXECUTION', 'Executando fallback devido ao erro...');
    const mesPadrao = 12;
    const anoPadrao = 2024;
    
    try {
      await executarRequisicoesPeriodo(app, mesPadrao, anoPadrao);
      logFormatado('FALLBACK SUCCESS', `Fallback executado com sucesso para ${mesPadrao}/${anoPadrao}`, tempoInicio);
    } catch (fallbackError) {
      logFormatado('FALLBACK ERROR', {
        'Error Message': fallbackError.message,
        'Stack': fallbackError.stack
      }, tempoInicio);
    }
  }
}

// Função auxiliar para executar todas as requisições de um período
async function executarRequisicoesPeriodo(app, mes, ano) {
  const tempoInicio = Date.now();
  
  logFormatado('PERIOD REQUESTS', {
    'Period': `${mes}/${ano}`,
    'Total Requests': '15'
  });
  
  const [
    paisesOrigem, presencaUF, chegadas, chegadasComparativas,
    motivos, fontes, composicao, vias, genero, faixaEtaria, gastoMedio,
    sazonalidadeVariacaoTuristas, sazonalidadeTopEstados, sazonalidadeTotalTuristas,
    sazonalidadePicoVisitas, visitasPorEstado
  ] = await Promise.all([
    obterPaisesOrigem(app, mes, ano),
    obterPresencaUF(app, mes, ano),
    obterChegadas(app, mes, ano),
    obterChegadasComparativas(app, mes, ano),
    obterMotivos(app, mes, ano),
    obterFontes(app, mes, ano),
    obterComposicao(app, mes, ano),
    obterVias(app, mes, ano),
    obterGenero(app, mes, ano),
    obterFaixaEtaria(app, mes, ano),
    obterGastoMedio(app, mes, ano),
    obterSazonalidadeVariacaoTuristas(app, mes, ano),
    obterSazonalidadeTopEstados(app, mes, ano),
    obterSazonalidadeTotalTuristas(app, mes, ano),
    obterSazonalidadePicoVisitas(app, mes, ano),
    obterVisitasPorEstado(app, mes, ano)
  ]);
  
  // Atualiza o cache
  ultimoPeriodoCache = {
    mes: mes,
    ano: ano,
    paisesOrigem: paisesOrigem,
    presencaUF: presencaUF,
    chegadas: chegadas,
    chegadasComparativas: chegadasComparativas,
    motivos: motivos,
    fontes: fontes,
    composicao: composicao,
    vias: vias,
    genero: genero,
    faixaEtaria: faixaEtaria,
    gastoMedio: gastoMedio,
    sazonalidadeVariacaoTuristas: sazonalidadeVariacaoTuristas,
    sazonalidadeTopEstados: sazonalidadeTopEstados,
    sazonalidadeTotalTuristas: sazonalidadeTotalTuristas,
    sazonalidadePicoVisitas: sazonalidadePicoVisitas,
    visitasPorEstado: visitasPorEstado
  };

  const sucessos = [
    paisesOrigem, presencaUF, chegadas, chegadasComparativas,
    motivos, fontes, composicao, vias, genero, faixaEtaria, gastoMedio,
    sazonalidadeVariacaoTuristas, sazonalidadeTopEstados, sazonalidadeTotalTuristas,
    sazonalidadePicoVisitas, visitasPorEstado
  ].filter(Boolean).length;

  logFormatado('PERIOD REQUESTS COMPLETE', {
    'Period': `${mes}/${ano}`,
    'Successful Requests': `${sucessos}/15`,
    'Success Rate': `${((sucessos/15) * 100).toFixed(1)}%`
  }, tempoInicio);
  
  logCache('UPDATE', { mes, ano }, ultimoPeriodoCache);
}

// Função para atualizar cache para um período específico
async function atualizarCachePeriodo(app, mes, ano) {
  const tempoInicio = Date.now();
  
  logFormatado('CACHE UPDATE', `Atualizando cache para ${mes}/${ano}...`);
  
  try {
    await executarRequisicoesPeriodo(app, mes, ano);
    
    logFormatado('CACHE UPDATE SUCCESS', {
      'Period': `${mes}/${ano}`,
      'Status': 'UPDATED'
    }, tempoInicio);
    
    return true;
  } catch (error) {
    logFormatado('CACHE UPDATE ERROR', {
      'Period': `${mes}/${ano}`,
      'Error Message': error.message,
      'Stack': error.stack
    }, tempoInicio);
    
    return false;
  }
}

// Getters para acessar os dados do cache
function getMesesAnosPaises() {
  logFormatado('CACHE ACCESS', {
    'Operation': 'GET mesesAnosPaises',
    'Has Data': !!mesesAnosPaises,
    'Data Type': typeof mesesAnosPaises
  });
  
  return mesesAnosPaises;
}

function getUltimoPeriodoCache() {
  const periodo = ultimoPeriodoCache.mes && ultimoPeriodoCache.ano 
    ? `${ultimoPeriodoCache.mes}/${ultimoPeriodoCache.ano}` 
    : 'NOT SET';
    
  logFormatado('CACHE ACCESS', {
    'Operation': 'GET ultimoPeriodoCache',
    'Period': periodo,
    'Has Data': !!(ultimoPeriodoCache.mes && ultimoPeriodoCache.ano)
  });
  
  return ultimoPeriodoCache;
}

module.exports = {
  carregarCacheUltimoPeriodo,
  atualizarCachePeriodo,
  getMesesAnosPaises,
  getUltimoPeriodoCache
};