const request = require('supertest');

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
  try {
    const response = await request(app)
      .get(`/grafico/paises-origem?mes=${mes}&ano=${ano}`);
    
    const resultado = response.body;
    console.log(`Países Origem (${mes}/${ano}):`, resultado);
    return resultado;
  } catch (error) {
    console.error('Erro ao obter países origem:', error);
    return null;
  }
}

// Função para buscar dados de presença por UF
async function obterPresencaUF(app, mes, ano) {
  try {
    const response = await request(app)
      .get(`/grafico/presenca-uf?mes=${mes}&ano=${ano}`);
    
    const resultado = response.body;
    console.log(`Presença UF (${mes}/${ano}):`, resultado);
    return resultado;
  } catch (error) {
    console.error('Erro ao obter presença UF:', error);
    return null;
  }
}

// Função para buscar dados de chegadas
async function obterChegadas(app, mes, ano) {
  try {
    const response = await request(app)
      .get(`/grafico/chegadas?mes=${mes}&ano=${ano}`);
    
    const resultado = response.body;
    console.log(`Chegadas (${mes}/${ano}):`, resultado);
    return resultado;
  } catch (error) {
    console.error('Erro ao obter chegadas:', error);
    return null;
  }
}

// Função para buscar dados de chegadas comparativas
async function obterChegadasComparativas(app, mes, ano) {
  try {
    const response = await request(app)
      .get(`/grafico/chegadas-comparativas?mes=${mes}&ano=${ano}`);
    
    const resultado = response.body;
    console.log(`Chegadas Comparativas (${mes}/${ano}):`, resultado);
    return resultado;
  } catch (error) {
    console.error('Erro ao obter chegadas comparativas:', error);
    return null;
  }
}

// Função para buscar dados de motivos
async function obterMotivos(app, mes, ano) {
  try {
    const response = await request(app)
      .get(`/grafico/motivo?mes=${mes}&ano=${ano}`);
    
    const resultado = response.body;
    console.log(`Motivos (${mes}/${ano}):`, resultado);
    return resultado;
  } catch (error) {
    console.error('Erro ao obter motivos:', error);
    return null;
  }
}

// Função para buscar dados de fontes de informação
async function obterFontes(app, mes, ano) {
  try {
    const response = await request(app)
      .get(`/grafico/fontes?mes=${mes}&ano=${ano}`);
    
    const resultado = response.body;
    console.log(`Fontes (${mes}/${ano}):`, resultado);
    return resultado;
  } catch (error) {
    console.error('Erro ao obter fontes:', error);
    return null;
  }
}

// Função para buscar dados de composição
async function obterComposicao(app, mes, ano) {
  try {
    const response = await request(app)
      .get(`/grafico/composicao?mes=${mes}&ano=${ano}`);
    
    const resultado = response.body;
    console.log(`Composição (${mes}/${ano}):`, resultado);
    return resultado;
  } catch (error) {
    console.error('Erro ao obter composição:', error);
    return null;
  }
}

// Função para buscar dados de vias
async function obterVias(app, mes, ano) {
  try {
    const response = await request(app)
      .get(`/grafico/vias?mes=${mes}&ano=${ano}`);
    
    const resultado = response.body;
    console.log(`Vias (${mes}/${ano}):`, resultado);
    return resultado;
  } catch (error) {
    console.error('Erro ao obter vias:', error);
    return null;
  }
}

// Função para buscar dados de gênero
async function obterGenero(app, mes, ano) {
  try {
    const response = await request(app)
      .get(`/grafico/genero?mes=${mes}&ano=${ano}`);
    
    const resultado = response.body;
    console.log(`Gênero (${mes}/${ano}):`, resultado);
    return resultado;
  } catch (error) {
    console.error('Erro ao obter gênero:', error);
    return null;
  }
}

// Função para buscar dados de faixa etária
async function obterFaixaEtaria(app, mes, ano) {
  try {
    const response = await request(app)
      .get(`/grafico/faixa_etaria?mes=${mes}&ano=${ano}`);
    
    const resultado = response.body;
    console.log(`Faixa Etária (${mes}/${ano}):`, resultado);
    return resultado;
  } catch (error) {
    console.error('Erro ao obter faixa etária:', error);
    return null;
  }
}

// Função para buscar dados de gasto médio
async function obterGastoMedio(app, mes, ano) {
  try {
    const response = await request(app)
      .get(`/grafico/gasto-medio?mes=${mes}&ano=${ano}`);
    
    const resultado = response.body;
    console.log(`Gasto Médio (${mes}/${ano}):`, resultado);
    return resultado;
  } catch (error) {
    console.error('Erro ao obter gasto médio:', error);
    return null;
  }
}

async function obterSazonalidadeVariacaoTuristas(app, mes, ano) {
  try {
    const response = await request(app)
      .get(`/grafico/sazonalidade/variacao-turistas?mes=${mes}&ano=${ano}`);
    
    const resultado = response.body;
    console.log(`Sazonalidade Variação Turistas (${mes}/${ano}):`, resultado);
    return resultado;
  } catch (error) {
    console.error('Erro ao obter sazonalidade variação turistas:', error);
    return null;
  }
}

async function obterSazonalidadeTopEstados(app, mes, ano) {
  try {
    const response = await request(app)
      .get(`/grafico/sazonalidade/top-estados?mes=${mes}&ano=${ano}`);
    
    const resultado = response.body;
    console.log(`Sazonalidade Top Estados (${mes}/${ano}):`, resultado);
    return resultado;
  } catch (error) {
    console.error('Erro ao obter sazonalidade top estados:', error);
    return null;
  }
}

async function obterSazonalidadeTotalTuristas(app, mes, ano) {
  try {
    const response = await request(app)
      .get(`/grafico/sazonalidade/total-turistas?mes=${mes}&ano=${ano}`);
    
    const resultado = response.body;
    console.log(`Sazonalidade Total Turistas (${mes}/${ano}):`, resultado);
    return resultado;
  } catch (error) {
    console.error('Erro ao obter sazonalidade total turistas:', error);
    return null;
  }
}

async function obterSazonalidadePicoVisitas(app, mes, ano) {
  try {
    const response = await request(app)
      .get(`/grafico/sazonalidade/pico-visitas-unica-linha?mes=${mes}&ano=${ano}`);
    
    const resultado = response.body;
    console.log(`Sazonalidade Pico Visitas (${mes}/${ano}):`, resultado);
    return resultado;
  } catch (error) {
    console.error('Erro ao obter sazonalidade pico visitas:', error);
    return null;
  }
}

async function obterVisitasPorEstado(app, mes, ano) {
  try {
    const response = await request(app)
      .get(`/grafico/visitas-por-estado?mes=${mes}&ano=${ano}`);
    
    const resultado = response.body;
    console.log(`Visitas Por Estado (${mes}/${ano}):`, resultado);
    return resultado;
  } catch (error) {
    console.error('Erro ao obter visitas por estado:', error);
    return null;
  }
}

// Fazer a requisição e guardar o resultado
async function obterDados(app) {
  try {
    const response = await request(app)
      .get('/grafico/perfil-estimado-turista/meses-anos-paises');
    
    const resultado = response.body;
    console.log('Resultado:', resultado);
    return resultado;
  } catch (error) {
    console.error('Erro:', error);
  }
}

// Função para encontrar o último período dos dados mesesAnosPaises
function encontrarUltimoPeriodo(dadosMesesAnosPaises) {
  console.log('Dados recebidos para análise:', dadosMesesAnosPaises);
  console.log('Tipo dos dados:', typeof dadosMesesAnosPaises);
  console.log('É array?', Array.isArray(dadosMesesAnosPaises));
  
  if (!dadosMesesAnosPaises) {
    console.log('Dados mesesAnosPaises são null ou undefined');
    return null;
  }

  // Extrai o array de dados
  let dados = dadosMesesAnosPaises;
  
  // Se for um objeto, procura pela propriedade que contém o array
  if (!Array.isArray(dados)) {
    // Lista de possíveis propriedades que podem conter os dados
    const possiveisChaves = ['dados', 'data', 'resultado', 'meses', 'periodos', 'paises'];
    
    for (const chave of possiveisChaves) {
      if (dados[chave] && Array.isArray(dados[chave])) {
        console.log(`Array encontrado na propriedade: ${chave}`);
        dados = dados[chave];
        break;
      }
    }
    
    // Se ainda não é array, verifica se é um objeto com dados válidos
    if (!Array.isArray(dados)) {
      // Tenta converter para array se for um objeto com estrutura válida
      if (typeof dados === 'object' && dados !== null) {
        // Verifica se tem propriedades de mês e ano diretamente
        if (dados.hasOwnProperty('mes') || dados.hasOwnProperty('ano') || 
            dados.hasOwnProperty('month') || dados.hasOwnProperty('year')) {
          dados = [dados]; // Transforma em array com um elemento
        } else {
          // Tenta extrair valores do objeto
          const valores = Object.values(dados);
          if (valores.length > 0 && Array.isArray(valores[0])) {
            dados = valores[0];
          }
        }
      }
    }
  }

  if (!Array.isArray(dados) || dados.length === 0) {
    console.log('Dados mesesAnosPaises inválidos ou vazios após verificação');
    console.log('Estrutura completa dos dados:', JSON.stringify(dadosMesesAnosPaises, null, 2));
    return null;
  }

  console.log('Primeiro item do array:', dados[0]);
  console.log('Chaves do primeiro item:', Object.keys(dados[0]));

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

  console.log('Propriedade do mês encontrada:', propriedadeMes);
  console.log('Propriedade do ano encontrada:', propriedadeAno);

  if (!propriedadeMes || !propriedadeAno) {
    console.log('Não foi possível encontrar propriedades de mês e ano');
    console.log('Propriedades disponíveis:', Object.keys(dados[0]));
    return null;
  }

  // Cria um Set para armazenar períodos únicos
  const periodosUnicos = new Set();
  
  // Processa todos os registros para encontrar períodos únicos
  dados.forEach(item => {
    const mes = parseInt(item[propriedadeMes]);
    const ano = parseInt(item[propriedadeAno]);
    
    if (!isNaN(mes) && !isNaN(ano)) {
      // Cria uma chave única para o período (AAAAMM)
      const chavePeríodo = `${ano}${mes.toString().padStart(2, '0')}`;
      periodosUnicos.add(chavePeríodo);
    }
  });

  console.log('Períodos únicos encontrados:', Array.from(periodosUnicos));

  if (periodosUnicos.size === 0) {
    console.log('Nenhum período válido encontrado');
    return null;
  }

  // Converte o Set para array e ordena para encontrar o mais recente
  const periodosOrdenados = Array.from(periodosUnicos).sort((a, b) => b.localeCompare(a));
  const ultimoPeríodo = periodosOrdenados[0];
  
  console.log('Período mais recente:', ultimoPeríodo);

  // Extrai mês e ano do período mais recente
  const ano = parseInt(ultimoPeríodo.substring(0, 4));
  const mes = parseInt(ultimoPeríodo.substring(4));

  const resultado = { mes, ano };
  console.log('Último período encontrado:', resultado);
  
  return resultado;
}

// Função principal para carregar cache apenas do último período
async function carregarCacheUltimoPeriodo(app) {
  console.log('Iniciando carregamento do cache para o último período...');
  
  try {
    // Carrega dados básicos primeiro
    console.log('Buscando dados mesesAnosPaises...');
    const dadosMesesAnosPaises = await obterDados(app);
    
    if (!dadosMesesAnosPaises) {
      console.error('Falha ao obter dados mesesAnosPaises');
      return;
    }
    
    mesesAnosPaises = dadosMesesAnosPaises;
    console.log('Dados mesesAnosPaises carregados com sucesso');
    
    // Encontra o último período disponível
    const ultimoPeriodo = encontrarUltimoPeriodo(dadosMesesAnosPaises);
    
    if (!ultimoPeriodo) {
      console.error('Não foi possível determinar o último período');
      console.log('Tentando usar valores padrão: mes=12, ano=2024');
      
      // Fallback para valores padrão
      const mesPadrao = 12;
      const anoPadrao = 2024;
      
      console.log(`Usando valores padrão: ${mesPadrao}/${anoPadrao}`);
      
      // Executa requisições com valores padrão
      await executarRequisicoesPeriodo(app, mesPadrao, anoPadrao);
      
      console.log(`Cache carregado com valores padrão: ${mesPadrao}/${anoPadrao}`);
      return;
    }
    
    const { mes, ano } = ultimoPeriodo;
    console.log(`Carregando cache para o último período: ${mes}/${ano}`);
    
    // Executa todas as requisições
    await executarRequisicoesPeriodo(app, mes, ano);
    
    console.log(`Cache carregado com sucesso para ${mes}/${ano}!`);
    
    // Log do status do cache
    console.log('Status do cache:', {
      periodo: `${mes}/${ano}`,
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
    });
    
  } catch (error) {
    console.error('Erro ao carregar cache:', error);
    
    // Fallback em caso de erro
    console.log('Executando fallback devido ao erro...');
    const mesPadrao = 12;
    const anoPadrao = 2024;
    
    try {
      await executarRequisicoesPeriodo(app, mesPadrao, anoPadrao);
      console.log(`Fallback executado com sucesso para ${mesPadrao}/${anoPadrao}`);
    } catch (fallbackError) {
      console.error('Erro no fallback:', fallbackError);
    }
  }
}

// Função auxiliar para executar todas as requisições de um período
async function executarRequisicoesPeriodo(app, mes, ano) {
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
}

// Função para atualizar cache para um período específico
async function atualizarCachePeriodo(app, mes, ano) {
  console.log(`Atualizando cache para ${mes}/${ano}...`);
  
  try {
    await executarRequisicoesPeriodo(app, mes, ano);
    console.log(`Cache atualizado para ${mes}/${ano}`);
    return true;
  } catch (error) {
    console.error(`Erro ao atualizar cache para ${mes}/${ano}:`, error);
    return false;
  }
}

// Getters para acessar os dados do cache
function getMesesAnosPaises() {
  return mesesAnosPaises;
}

function getUltimoPeriodoCache() {
  return ultimoPeriodoCache;
}

module.exports = {
  carregarCacheUltimoPeriodo,
  atualizarCachePeriodo,
  getMesesAnosPaises,
  getUltimoPeriodoCache
};