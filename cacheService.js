const request = require('supertest');

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
    'Chamada da API': `GET ${endpoint}`,
    'Parametros enviados': Object.entries(parametros).map(([k, v]) => `${k}=${v}`).join('&') || 'nenhum'
  };
  
  logFormatado('CHAMADA DE API', detalhes, tempoInicio);
}

// Função para log de cache
function logCache(operacao, periodo, dados) {
  const operacaoTexto = {
    'RETRIEVE': 'Dados recuperados do cache',
    'MISS': 'Dados não encontrados no cache',
    'UPDATE': 'Cache atualizado'
  };
  
  const detalhes = {
    'Ação realizada': operacaoTexto[operacao] || operacao,
    'Periodo consultado': `${periodo.mes}/${periodo.ano}`,
    'Status da operação': dados ? 'Sucesso' : 'Falha',
    'Tamanho dos dados': dados ? `${JSON.stringify(dados).length} caracteres` : '0 caracteres'
  };
  
  logFormatado('GERENCIAMENTO DE CACHE', detalhes);
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
      .get(`${endpoint}?ano=${ano}`);
    
    const resultado = response.body;
    
    logFormatado('RESPOSTA RECEBIDA', {
      'Endpoint consultado': endpoint,
      'Codigo de status': response.status,
      'Tipo de dados': typeof resultado,
      'Dados recebidos': resultado ? 'Sim' : 'Não'
    }, tempoInicio);
    
    return resultado;
  } catch (error) {
    logFormatado('ERRO NA REQUISIÇÃO', {
      'Endpoint que falhou': endpoint,
      'Mensagem de erro': error.message,
      'Detalhes técnicos': error.stack
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
      .get(`${endpoint}?ano=${ano}`);
    
    const resultado = response.body;
    
    logFormatado('RESPOSTA RECEBIDA', {
      'Endpoint consultado': endpoint,
      'Codigo de status': response.status,
      'Tipo de dados': typeof resultado,
      'Dados recebidos': resultado ? 'Sim' : 'Não'
    }, tempoInicio);
    
    return resultado;
  } catch (error) {
    logFormatado('ERRO NA REQUISIÇÃO', {
      'Endpoint que falhou': endpoint,
      'Mensagem de erro': error.message,
      'Detalhes técnicos': error.stack
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
      .get(`${endpoint}?ano=${ano}`);
    
    const resultado = response.body;
    
    logFormatado('RESPOSTA RECEBIDA', {
      'Endpoint consultado': endpoint,
      'Codigo de status': response.status,
      'Tipo de dados': typeof resultado,
      'Dados recebidos': resultado ? 'Sim' : 'Não'
    }, tempoInicio);
    
    return resultado;
  } catch (error) {
    logFormatado('ERRO NA REQUISIÇÃO', {
      'Endpoint que falhou': endpoint,
      'Mensagem de erro': error.message,
      'Detalhes técnicos': error.stack
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
      .get(`${endpoint}?ano=${ano}`);
    
    const resultado = response.body;
    
    logFormatado('RESPOSTA RECEBIDA', {
      'Endpoint consultado': endpoint,
      'Codigo de status': response.status,
      'Tipo de dados': typeof resultado,
      'Dados recebidos': resultado ? 'Sim' : 'Não'
    }, tempoInicio);
    
    return resultado;
  } catch (error) {
    logFormatado('ERRO NA REQUISIÇÃO', {
      'Endpoint que falhou': endpoint,
      'Mensagem de erro': error.message,
      'Detalhes técnicos': error.stack
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
    
    logFormatado('RESPOSTA RECEBIDA', {
      'Endpoint consultado': endpoint,
      'Codigo de status': response.status,
      'Tipo de dados': typeof resultado,
      'Dados recebidos': resultado ? 'Sim' : 'Não'
    }, tempoInicio);
    
    return resultado;
  } catch (error) {
    logFormatado('ERRO NA REQUISIÇÃO', {
      'Endpoint que falhou': endpoint,
      'Mensagem de erro': error.message,
      'Detalhes técnicos': error.stack
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
    
    logFormatado('RESPOSTA RECEBIDA', {
      'Endpoint consultado': endpoint,
      'Codigo de status': response.status,
      'Tipo de dados': typeof resultado,
      'Dados recebidos': resultado ? 'Sim' : 'Não'
    }, tempoInicio);
    
    return resultado;
  } catch (error) {
    logFormatado('ERRO NA REQUISIÇÃO', {
      'Endpoint que falhou': endpoint,
      'Mensagem de erro': error.message,
      'Detalhes técnicos': error.stack
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
    
    logFormatado('RESPOSTA RECEBIDA', {
      'Endpoint consultado': endpoint,
      'Codigo de status': response.status,
      'Tipo de dados': typeof resultado,
      'Dados recebidos': resultado ? 'Sim' : 'Não'
    }, tempoInicio);
    
    return resultado;
  } catch (error) {
    logFormatado('ERRO NA REQUISIÇÃO', {
      'Endpoint que falhou': endpoint,
      'Mensagem de erro': error.message,
      'Detalhes técnicos': error.stack
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
    
    logFormatado('RESPOSTA RECEBIDA', {
      'Endpoint consultado': endpoint,
      'Codigo de status': response.status,
      'Tipo de dados': typeof resultado,
      'Dados recebidos': resultado ? 'Sim' : 'Não'
    }, tempoInicio);
    
    return resultado;
  } catch (error) {
    logFormatado('ERRO NA REQUISIÇÃO', {
      'Endpoint que falhou': endpoint,
      'Mensagem de erro': error.message,
      'Detalhes técnicos': error.stack
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
    
    logFormatado('RESPOSTA RECEBIDA', {
      'Endpoint consultado': endpoint,
      'Codigo de status': response.status,
      'Tipo de dados': typeof resultado,
      'Dados recebidos': resultado ? 'Sim' : 'Não'
    }, tempoInicio);
    
    return resultado;
  } catch (error) {
    logFormatado('ERRO NA REQUISIÇÃO', {
      'Endpoint que falhou': endpoint,
      'Mensagem de erro': error.message,
      'Detalhes técnicos': error.stack
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
    
    logFormatado('RESPOSTA RECEBIDA', {
      'Endpoint consultado': endpoint,
      'Codigo de status': response.status,
      'Tipo de dados': typeof resultado,
      'Dados recebidos': resultado ? 'Sim' : 'Não'
    }, tempoInicio);
    
    return resultado;
  } catch (error) {
    logFormatado('ERRO NA REQUISIÇÃO', {
      'Endpoint que falhou': endpoint,
      'Mensagem de erro': error.message,
      'Detalhes técnicos': error.stack
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
    
    logFormatado('RESPOSTA RECEBIDA', {
      'Endpoint consultado': endpoint,
      'Codigo de status': response.status,
      'Tipo de dados': typeof resultado,
      'Dados recebidos': resultado ? 'Sim' : 'Não'
    }, tempoInicio);
    
    return resultado;
  } catch (error) {
    logFormatado('ERRO NA REQUISIÇÃO', {
      'Endpoint que falhou': endpoint,
      'Mensagem de erro': error.message,
      'Detalhes técnicos': error.stack
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
    
    logFormatado('RESPOSTA RECEBIDA', {
      'Endpoint consultado': endpoint,
      'Codigo de status': response.status,
      'Tipo de dados': typeof resultado,
      'Dados recebidos': resultado ? 'Sim' : 'Não'
    }, tempoInicio);
    
    return resultado;
  } catch (error) {
    logFormatado('ERRO NA REQUISIÇÃO', {
      'Endpoint que falhou': endpoint,
      'Mensagem de erro': error.message,
      'Detalhes técnicos': error.stack
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
    
    logFormatado('RESPOSTA RECEBIDA', {
      'Endpoint consultado': endpoint,
      'Codigo de status': response.status,
      'Tipo de dados': typeof resultado,
      'Dados recebidos': resultado ? 'Sim' : 'Não'
    }, tempoInicio);
    
    return resultado;
  } catch (error) {
    logFormatado('ERRO NA REQUISIÇÃO', {
      'Endpoint que falhou': endpoint,
      'Mensagem de erro': error.message,
      'Detalhes técnicos': error.stack
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
    
    logFormatado('RESPOSTA RECEBIDA', {
      'Endpoint consultado': endpoint,
      'Codigo de status': response.status,
      'Tipo de dados': typeof resultado,
      'Dados recebidos': resultado ? 'Sim' : 'Não'
    }, tempoInicio);
    
    return resultado;
  } catch (error) {
    logFormatado('ERRO NA REQUISIÇÃO', {
      'Endpoint que falhou': endpoint,
      'Mensagem de erro': error.message,
      'Detalhes técnicos': error.stack
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
    
    logFormatado('RESPOSTA RECEBIDA', {
      'Endpoint consultado': endpoint,
      'Codigo de status': response.status,
      'Tipo de dados': typeof resultado,
      'Dados recebidos': resultado ? 'Sim' : 'Não'
    }, tempoInicio);
    
    return resultado;
  } catch (error) {
    logFormatado('ERRO NA REQUISIÇÃO', {
      'Endpoint que falhou': endpoint,
      'Mensagem de erro': error.message,
      'Detalhes técnicos': error.stack
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
    
    logFormatado('RESPOSTA RECEBIDA', {
      'Endpoint consultado': endpoint,
      'Codigo de status': response.status,
      'Tipo de dados': typeof resultado,
      'Dados recebidos': resultado ? 'Sim' : 'Não'
    }, tempoInicio);
    
    return resultado;
  } catch (error) {
    logFormatado('ERRO NA REQUISIÇÃO', {
      'Endpoint que falhou': endpoint,
      'Mensagem de erro': error.message,
      'Detalhes técnicos': error.stack
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
    
    logFormatado('RESPOSTA RECEBIDA', {
      'Endpoint consultado': endpoint,
      'Codigo de status': response.status,
      'Tipo de dados': typeof resultado,
      'Dados recebidos': resultado ? 'Sim' : 'Não',
      'É um array': Array.isArray(resultado) ? 'Sim' : 'Não'
    }, tempoInicio);
    
    return resultado;
  } catch (error) {
    logFormatado('ERRO NA REQUISIÇÃO', {
      'Endpoint que falhou': endpoint,
      'Mensagem de erro': error.message,
      'Detalhes técnicos': error.stack
    }, tempoInicio);
    return null;
  }
}

// Função para encontrar o último período dos dados mesesAnosPaises
function encontrarUltimoPeriodo(dadosMesesAnosPaises) {
  const tempoInicio = Date.now();
  
  logFormatado('ANÁLISE DE PERÍODOS', {
    'Tipo de dados recebidos': typeof dadosMesesAnosPaises,
    'É um array': Array.isArray(dadosMesesAnosPaises) ? 'Sim' : 'Não',
    'Possui dados': dadosMesesAnosPaises ? 'Sim' : 'Não'
  });
  
  if (!dadosMesesAnosPaises) {
    logFormatado('ERRO NA ANÁLISE', 'Os dados de meses/anos/países estão vazios ou indefinidos');
    return null;
  }

  // Extrai o array de dados
  let dados = dadosMesesAnosPaises;
  
  // Se for um objeto, procura pela propriedade que contém o array
  if (!Array.isArray(dados)) {
    const possiveisChaves = ['dados', 'data', 'resultado', 'meses', 'periodos', 'paises'];
    
    for (const chave of possiveisChaves) {
      if (dados[chave] && Array.isArray(dados[chave])) {
        logFormatado('EXTRAÇÃO DE DADOS', `Array de dados encontrado na propriedade: ${chave}`);
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
    logFormatado('ERRO NA VALIDAÇÃO', {
      'Mensagem': 'Dados inválidos ou vazios após verificação completa',
      'Tipo final dos dados': typeof dados,
      'É um array': Array.isArray(dados) ? 'Sim' : 'Não',
      'Quantidade de itens': dados?.length || 0
    });
    return null;
  }

  logFormatado('VALIDAÇÃO DOS DADOS', {
    'Quantidade de registros': dados.length,
    'Propriedades do primeiro item': Object.keys(dados[0]).join(', ')
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

  logFormatado('MAPEAMENTO DE PROPRIEDADES', {
    'Propriedade do mês': propriedadeMes || 'Não encontrada',
    'Propriedade do ano': propriedadeAno || 'Não encontrada'
  });

  if (!propriedadeMes || !propriedadeAno) {
    logFormatado('ERRO NO MAPEAMENTO', {
      'Mensagem': 'Não foi possível identificar as propriedades de mês e ano',
      'Propriedades disponíveis': Object.keys(dados[0]).join(', ')
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

  logFormatado('PROCESSAMENTO DE PERÍODOS', {
    'Períodos únicos encontrados': periodosUnicos.size,
    'Lista de períodos': Array.from(periodosUnicos).join(', ')
  });

  if (periodosUnicos.size === 0) {
    logFormatado('ERRO NO PROCESSAMENTO', 'Nenhum período válido foi encontrado nos dados');
    return null;
  }

  // Converte o Set para array e ordena para encontrar o mais recente
  const periodosOrdenados = Array.from(periodosUnicos).sort((a, b) => b.localeCompare(a));
  const ultimoPeríodo = periodosOrdenados[0];
  
  // Extrai mês e ano do período mais recente
  const ano = parseInt(ultimoPeríodo.substring(0, 4));
  const mes = parseInt(ultimoPeríodo.substring(4));

  const resultado = { mes, ano };
  
  logFormatado('RESULTADO DA ANÁLISE', {
    'Período mais recente identificado': ultimoPeríodo,
    'Mês selecionado': mes,
    'Ano selecionado': ano
  }, tempoInicio);
  
  return resultado;
}

// Função principal para carregar cache apenas do último período
async function carregarCacheUltimoPeriodo(app) {
  const tempoInicio = Date.now();
  
  logFormatado('Inicialização do Cache', 'Carregando dados do último período disponível...');
  
  try {
    // Carrega dados básicos primeiro
    logFormatado('Carregamento de Dados', 'Buscando informações dos meses, anos e países...');
    const dadosMesesAnosPaises = await obterDados(app);
    
    if (!dadosMesesAnosPaises) {
      logFormatado('Erro', 'Não foi possível obter os dados básicos do sistema');
      return;
    }
    
    mesesAnosPaises = dadosMesesAnosPaises;
    logFormatado('Sucesso', 'Dados básicos carregados com sucesso');
    
    // Encontra o último período disponível
    const ultimoPeriodo = encontrarUltimoPeriodo(dadosMesesAnosPaises);
    
    if (!ultimoPeriodo) {
      logFormatado('Fallback Ativado', {
        'Motivo': 'Não foi possível determinar o último período disponível',
        'Ação': 'Usando valores padrão - dezembro de 2024'
      });
      
      const mesPadrao = 12;
      const anoPadrao = 2024;
      
      await executarRequisicoesPeriodo(app, mesPadrao, anoPadrao);
      
      logFormatado('Cache Finalizado', {
        'Período': `${mesPadrao}/${anoPadrao}`,
        'Status': 'Concluído com valores padrão'
      }, tempoInicio);
      return;
    }
    
    const { mes, ano } = ultimoPeriodo;
    logFormatado('Carregamento do Cache', `Processando dados do período ${mes}/${ano}`);
    
    // Executa todas as requisições
    await executarRequisicoesPeriodo(app, mes, ano);
    
    // Log do status do cache
    const statusCache = {
      'Período': `${mes}/${ano}`,
      'Países de Origem': ultimoPeriodoCache.paisesOrigem ? 'Carregado' : 'Não disponível',
      'Presença por UF': ultimoPeriodoCache.presencaUF ? 'Carregado' : 'Não disponível',
      'Chegadas': ultimoPeriodoCache.chegadas ? 'Carregado' : 'Não disponível',
      'Chegadas Comparativas': ultimoPeriodoCache.chegadasComparativas ? 'Carregado' : 'Não disponível',
      'Motivos de Viagem': ultimoPeriodoCache.motivos ? 'Carregado' : 'Não disponível',
      'Fontes de Informação': ultimoPeriodoCache.fontes ? 'Carregado' : 'Não disponível',
      'Composição': ultimoPeriodoCache.composicao ? 'Carregado' : 'Não disponível',
      'Vias de Acesso': ultimoPeriodoCache.vias ? 'Carregado' : 'Não disponível',
      'Gênero': ultimoPeriodoCache.genero ? 'Carregado' : 'Não disponível',
      'Faixa Etária': ultimoPeriodoCache.faixaEtaria ? 'Carregado' : 'Não disponível',
      'Gasto Médio': ultimoPeriodoCache.gastoMedio ? 'Carregado' : 'Não disponível',
      'Sazonalidade - Variação': ultimoPeriodoCache.sazonalidadeVariacaoTuristas ? 'Carregado' : 'Não disponível',
      'Sazonalidade - Top Estados': ultimoPeriodoCache.sazonalidadeTopEstados ? 'Carregado' : 'Não disponível',
      'Sazonalidade - Total': ultimoPeriodoCache.sazonalidadeTotalTuristas ? 'Carregado' : 'Não disponível',
      'Sazonalidade - Picos': ultimoPeriodoCache.sazonalidadePicoVisitas ? 'Carregado' : 'Não disponível',
      'Visitas por Estado': ultimoPeriodoCache.visitasPorEstado ? 'Carregado' : 'Não disponível'
    };
    
    logFormatado('Cache Concluído', statusCache, tempoInicio);
    
  } catch (error) {
    logFormatado('Erro no Cache', {
      'Mensagem': error.message,
      'Detalhes': error.stack
    });
    
    // Fallback em caso de erro
    logFormatado('Executando Fallback', 'Tentando carregar dados com valores padrão...');
    const mesPadrao = 12;
    const anoPadrao = 2024;
    
    try {
      await executarRequisicoesPeriodo(app, mesPadrao, anoPadrao);
      logFormatado('Fallback Concluído', `Dados carregados com sucesso para ${mesPadrao}/${anoPadrao}`, tempoInicio);
    } catch (fallbackError) {
      logFormatado('Erro no Fallback', {
        'Mensagem': fallbackError.message,
        'Detalhes': fallbackError.stack
      }, tempoInicio);
    }
  }
}

// Função auxiliar para executar todas as requisições de um período
async function executarRequisicoesPeriodo(app, mes, ano) {
  const tempoInicio = Date.now();
  
  logFormatado('Requisições do Período', {
    'Período': `${mes}/${ano}`,
    'Total de Requisições': '15'
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

  logFormatado('Requisições Finalizadas', {
    'Período': `${mes}/${ano}`,
    'Requisições Bem-sucedidas': `${sucessos} de 15`,
    'Taxa de Sucesso': `${((sucessos/15) * 100).toFixed(1)}%`
  }, tempoInicio);
  
  logCache('Atualização', { mes, ano }, ultimoPeriodoCache);
}

// Função para atualizar cache para um período específico
async function atualizarCachePeriodo(app, mes, ano) {
  const tempoInicio = Date.now();
  
  logFormatado('Atualização de Cache', `Processando dados para o período ${mes}/${ano}...`);
  
  try {
    await executarRequisicoesPeriodo(app, mes, ano);
    
    logFormatado('Atualização Concluída', {
      'Período': `${mes}/${ano}`,
      'Status': 'Cache atualizado com sucesso'
    }, tempoInicio);
    
    return true;
  } catch (error) {
    logFormatado('Erro na Atualização', {
      'Período': `${mes}/${ano}`,
      'Mensagem': error.message,
      'Detalhes': error.stack
    }, tempoInicio);
    
    return false;
  }
}

// Getters para acessar os dados do cache
function getMesesAnosPaises() {
  logFormatado('Acesso ao Cache', {
    'Operação': 'Buscar dados de meses, anos e países',
    'Dados Disponíveis': mesesAnosPaises ? 'Sim' : 'Não',
    'Tipo de Dados': typeof mesesAnosPaises
  });
  
  return mesesAnosPaises;
}

function getUltimoPeriodoCache() {
  const periodo = ultimoPeriodoCache.mes && ultimoPeriodoCache.ano 
    ? `${ultimoPeriodoCache.mes}/${ultimoPeriodoCache.ano}` 
    : 'Não definido';
    
  logFormatado('Acesso ao Cache', {
    'Operação': 'Buscar dados do último período',
    'Período': periodo,
    'Dados Disponíveis': (ultimoPeriodoCache.mes && ultimoPeriodoCache.ano) ? 'Sim' : 'Não'
  });
  
  return ultimoPeriodoCache;
}

module.exports = {
  carregarCacheUltimoPeriodo,
  atualizarCachePeriodo,
  getMesesAnosPaises,
  getUltimoPeriodoCache
};