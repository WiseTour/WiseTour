let mesesAnosPaisesBanco;
let dadosCache = null;

// Função para normalizar dados
function normalizarDados(data) {
  if (!data || !Array.isArray(data.mesesAnosPaises)) {
    throw new Error("Formato inválido da resposta");
  }

  return data.mesesAnosPaises.map((item) => ({
    ...item,
    pais: item.pais?.toUpperCase(), 
  }));
}

// Função para comparar se os dados mudaram
function dadosMudaram(dadosAntigos, dadosNovos) {
  if (!dadosAntigos || !dadosNovos) return true;
  if (dadosAntigos.length !== dadosNovos.length) return true;
  
  // Compara cada item (comparação simples por JSON)
  return JSON.stringify(dadosAntigos) !== JSON.stringify(dadosNovos);
}

// Função para carregar dados do cache
async function carregarCache() {
  try {
    console.log("Carregando dados do cache...");
    const response = await fetch('/api/meses-anos-paises-cached');
    
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      dadosCache = normalizarDados(data);
      console.log("Dados do cache carregados:", dadosCache.length, "registros");
      return dadosCache;
    } else {
      console.log("Cache não disponível, carregando direto do banco...");
      return null;
    }
  } catch (error) {
    console.log("Erro ao carregar cache:", error.message);
    return null;
  }
}

// Função para carregar dados do banco
async function carregarBanco() {
  try {
    console.log("Carregando dados do banco...");
    const response = await fetch('/grafico/perfil-estimado-turista/meses-anos-paises');
    
    if (!response.ok) throw new Error("Erro ao buscar meses e anos do banco");
    
    const data = await response.json();
    const dadosBanco = normalizarDados(data);
    console.log("Dados do banco carregados:", dadosBanco.length, "registros");
    return dadosBanco;
  } catch (error) {
    console.error("Erro ao carregar do banco:", error);
    throw error;
  }
}

// Função principal para inicializar os dados
async function inicializarDados() {
  try {
    // 1. Primeiro tenta carregar do cache
    const dadosDoCache = await carregarCache();
    
    if (dadosDoCache) {
      // Se tem cache, usa ele imediatamente
      mesesAnosPaisesBanco = dadosDoCache;
      inicializarSelects();
      console.log("Interface inicializada com dados do cache");
    }
    
    // 2. Depois busca no banco para comparar
    const dadosDoBanco = await carregarBanco();
    
    if (!dadosDoCache) {
      // Se não tinha cache, usa os dados do banco
      mesesAnosPaisesBanco = dadosDoBanco;
      inicializarSelects();
      console.log("Interface inicializada com dados do banco");
    } else {
      // Se tinha cache, compara com os dados do banco
      if (dadosMudaram(dadosDoCache, dadosDoBanco)) {
        console.log("Dados mudaram! Atualizando interface...");
        mesesAnosPaisesBanco = dadosDoBanco;
        atualizarTodosSelects();
      } else {
        console.log("Dados não mudaram, mantendo cache");
      }
    }

    
  } catch (error) {
    console.error("Erro ao inicializar dados:", error);
    alert("Não foi possível carregar os meses, anos e países.");
  }
}

// Função para verificar se um select existe
function selectExiste(id) {
  const elemento = document.getElementById(id);
  return elemento !== null;
}

// Função para inicializar os selects pela primeira vez
function inicializarSelects() {
  if (selectExiste("mes")) {
    preencherMeses();
  }
  
  if (selectExiste("ano")) {
    preencherAnos();
  }
  
  if (selectExiste("pais")) {
    preencherPaises();
  }
}

// Função para atualizar todos os selects (preservando seleções)
function atualizarTodosSelects() {
  const selectMes = document.getElementById("mes");
  const selectAno = document.getElementById("ano");
  const selectPais = document.getElementById("pais");

  // Salva os valores atuais apenas dos selects que existem
  const valoresAtuais = {};
  
  if (selectMes) {
    valoresAtuais.mes = selectMes.value;
  }
  
  if (selectAno) {
    valoresAtuais.ano = selectAno.value;
  }
  
  if (selectPais) {
    valoresAtuais.pais = selectPais.value;
  }

  // Atualiza os selects que existem
  if (selectMes) {
    preencherMeses();
  }
  
  if (selectAno) {
    preencherAnos();
  }
  
  if (selectPais) {
    preencherPaises();
  }

  // Tenta restaurar os valores selecionados
  if (selectMes && valoresAtuais.mes) {
    selectMes.value = valoresAtuais.mes;
  }
  
  if (selectAno && valoresAtuais.ano) {
    selectAno.value = valoresAtuais.ano;
  }
  
  if (selectPais && valoresAtuais.pais) {
    selectPais.value = valoresAtuais.pais;
  }

  console.log("Todos os selects existentes foram atualizados");
}

const nomesMeses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

function atualizarFiltros() {
  const selectMes = document.getElementById("mes");
  const selectAno = document.getElementById("ano");
  const selectPais = document.getElementById("pais");

  // Só processa valores de selects que existem
  const mesSelecionado = selectMes ? parseInt(selectMes.value) : NaN;
  const anoSelecionado = selectAno ? parseInt(selectAno.value) : NaN;
  const paisSelecionado = selectPais ? parseInt(selectPais.value) : NaN;

  const filtro = {
    mes: isNaN(mesSelecionado) ? null : mesSelecionado,
    ano: isNaN(anoSelecionado) ? null : anoSelecionado,
    pais: isNaN(paisSelecionado) ? null : paisSelecionado,
  };

  // Só atualiza selects que existem
  if (selectMes) {
    preencherMeses(filtro);
  }
  
  if (selectAno) {
    preencherAnos(filtro);
  }
  
  if (selectPais) {
    preencherPaises(filtro);
  }
}

function preencherMeses(filtro = {}) {
  const selectMes = document.getElementById("mes");
  
  // Verifica se o select existe
  if (!selectMes) {
    console.log("Select 'mes' não encontrado na página");
    return;
  }
  
  const mesesFiltrados = mesesAnosPaisesBanco
    .filter(
      (item) =>
        (filtro.ano == null || item.ano === filtro.ano) &&
        (filtro.pais == null || item.id_pais === filtro.pais)
    )
    .map((item) => item.mes);

  const mesesUnicos = Array.from(new Set(mesesFiltrados)).sort((a, b) => a - b);

  const novasOpcoes = [
    { value: "", label: "MÊS:" },
    ...mesesUnicos.map((mes) => ({
      value: `${mes}`,
      label: nomesMeses[mes - 1] || `Mês ${mes}`,
    })),
  ];

  atualizarSelect(selectMes, novasOpcoes);
}

function preencherAnos(filtro = {}) {
  const selectAno = document.getElementById("ano");
  
  // Verifica se o select existe
  if (!selectAno) {
    console.log("Select 'ano' não encontrado na página");
    return;
  }
  
  const anosFiltrados = mesesAnosPaisesBanco
    .filter(
      (item) =>
        (filtro.mes == null || item.mes === filtro.mes) &&
        (filtro.pais == null || item.id_pais === filtro.pais)
    )
    .map((item) => item.ano);

  const anosUnicos = Array.from(new Set(anosFiltrados)).sort((a, b) => b - a);

  const novasOpcoes = [
    { value: "", label: "ANO:" },
    ...anosUnicos.map((ano) => ({
      value: `${ano}`,
      label: `${ano}`,
    })),
  ];

  atualizarSelect(selectAno, novasOpcoes);
}

function preencherPaises(filtro = {}) {
  const selectPais = document.getElementById("pais");
  
  // Verifica se o select existe
  if (!selectPais) {
    console.log("Select 'pais' não encontrado na página");
    return;
  }
  
  const paisesFiltrados = mesesAnosPaisesBanco
    .filter(
      (item) =>
        (filtro.mes == null || item.mes === filtro.mes) &&
        (filtro.ano == null || item.ano === filtro.ano)
    )
    .filter((item) => item.id_pais && item.pais);

  const paisesUnicosMap = new Map();
  for (const item of paisesFiltrados) {
    if (!paisesUnicosMap.has(item.id_pais)) {
      paisesUnicosMap.set(item.id_pais, item.pais);
    }
  }

  const paisesOrdenados = Array.from(paisesUnicosMap.entries()).sort(
    (a, b) => a[1].localeCompare(b[1], "pt", { sensitivity: "base" })
  );

  const novasOpcoes = [
    { value: "", label: "PAÍS:" },
    ...paisesOrdenados.map(([id, nome]) => ({
      value: `${id}`,
      label: nome.toUpperCase(),
    })),
  ];

  atualizarSelect(selectPais, novasOpcoes);
}

function atualizarSelect(select, novasOpcoes) {
  // Verifica se o select é válido
  if (!select) {
    console.log("Select não fornecido para atualização");
    return;
  }

  // Salva o valor atual selecionado
  const valorAtual = select.value;
  
  // Verifica se precisa atualizar comparando as opções
  const precisaAtualizar = select.options.length !== novasOpcoes.length ||
    Array.from(select.options).some((opt, i) => {
      const opcaoAtual = novasOpcoes[i];
      if (!opcaoAtual) return true;
      
      return opt.value !== opcaoAtual.value || 
             opt.textContent.trim() !== opcaoAtual.label.trim();
    });

  if (precisaAtualizar) {
    // Limpa as opções existentes
    select.innerHTML = "";
    
    // Adiciona as novas opções
    novasOpcoes.forEach(({ value, label }) => {
      const opt = document.createElement("option");
      opt.value = value;
      opt.textContent = label;
      select.appendChild(opt);
    });

    // Tenta restaurar o valor selecionado se ainda existir
    const valorExiste = novasOpcoes.some(opcao => opcao.value === valorAtual);
    if (valorExiste && valorAtual !== "") {
      select.value = valorAtual;
    } else {
      // Se o valor não existe mais, seleciona a primeira opção (placeholder)
      select.selectedIndex = 0;
    }
    
    console.log(`Select ${select.id} atualizado com ${novasOpcoes.length} opções`);
  } else {
    console.log(`Select ${select.id} não precisou ser atualizado`);
  }
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', inicializarDados);

// Também inicializar se o script for carregado depois do DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inicializarDados);
} else {
  inicializarDados();
}