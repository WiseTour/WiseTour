const coresUsadas = {
  amarelo: "#F8CA26",
  marrom: "#735900",
  marromBeige: "#C49F1B", // Renomeado para consistência
  amareloClaro: "#FFE483",
  avermelhado: "#A66D44",
  cimento: "#87826E",
  acinzentado: "#DDD8C5",
  cinza: "#E0E0E0",
  marromForte: "#A98400",
  esverdeado: "#6B8E23",
  begeMedio: "#D9C7A7", // Adicionado para consistência com o uso no gráfico
};

const opcoesPadrao = {
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: {
      top: 10,
      bottom: 10,
      left: 10,
      right: 10,
    },
  },
};

const estiloDoTextoDoGrafico = {
  color: "#000000",
  font: {
    weight: "500",
    family: "'Anybody', sans-serif",
    size: 12,
  },
};

// Referências aos elementos de filtro (certifique-se de que esses IDs existem no seu HTML)
const selectMes = document.getElementById("mes");
const selectAno = document.getElementById("ano");

// Variáveis para armazenar as instâncias dos gráficos
let myChartInstance; // Para o gráfico de Principais Países de Origem
let presencaTuristaChartInstance; // Para o gráfico de Presença de Turistas por UF
let chegadasTuristasChartInstance; // Para o gráfico de Chegadas

// Função assíncrona para carregar e atualizar todos os dados da dashboard principal
async function carregarDadosDashboard() {
  // Mostrar loading e esconder o dashboard principal
  mostrarLoading();

  const mes = selectMes ? selectMes.value : "";
  const ano = selectAno ? selectAno.value : "";

  const queryParams = new URLSearchParams();
  if (mes) queryParams.append("mes", mes);
  if (ano) queryParams.append("ano", ano);

  const queryString = queryParams.toString();
  const basePath = "/grafico"; // Base path para suas APIs

  // Array para controlar o carregamento de todos os gráficos
  const carregamentos = [];

  // ----------------------------------------------------
  // 1. Gráfico PRINCIPAIS PAÍSES DE ORIGEM
  // Rota esperada no backend: /grafico/paises-origem
  // Exemplo de retorno: [{ pais: 'Argentina', percentual: 20 }, ...]
  // ----------------------------------------------------
  const carregarPaisesOrigem = fetch(`${basePath}/paises-origem?${queryString}`)
    .then(async (res) => {
      const data = await res.json();

      const labels = data.map((item) => item.pais);
      const valores = data.map((item) => item.percentual);
      const ctx = document.getElementById("myChart");

      if (myChartInstance) {
        myChartInstance.data.labels = labels;
        myChartInstance.data.datasets[0].data = valores;
        myChartInstance.update();
      } else {
        myChartInstance = new Chart(ctx, {
          type: "bar",
          data: {
            labels: labels,
            datasets: [
              {
                data: valores,
                backgroundColor: [
                  coresUsadas.amarelo,
                  coresUsadas.marromBeige,
                  coresUsadas.marrom,
                  coresUsadas.amareloClaro,
                  coresUsadas.begeMedio,
                ],
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                titleFont: estiloDoTextoDoGrafico.font,
                bodyFont: estiloDoTextoDoGrafico.font,
                callbacks: {
                  label: function (context) {
                    return ` ${context.parsed.y}%`;
                  },
                },
              },
            },
            scales: {
              x: {
                ticks: {
                  ...estiloDoTextoDoGrafico,
                  autoSkip: false,
                  maxRotation: 90,
                  minRotation: 90,
                },
              },
              y: {
                beginAtZero: true,
                ticks: estiloDoTextoDoGrafico,
              },
            },
          },
        });
      }
    })
    .catch((err) => {
      console.error("Erro ao buscar dados dos principais países de origem:", err);
    });

  carregamentos.push(carregarPaisesOrigem);

  // ----------------------------------------------------
  // 2. Gráfico PRESENÇA DE TURISTAS POR UF
  // Rota esperada no backend: /grafico/presenca-uf
  // Exemplo de retorno: [{ uf: 'SP', quantidade: 5000 }, ...]
  // ----------------------------------------------------
  const carregarPresencaUF = fetch(`${basePath}/presenca-uf?${queryString}`)
    .then(async (res) => {
      const data = await res.json();

      const labels = data.map((item) => item.uf);
      const valores = data.map((item) => item.quantidade);
      const ctx = document.getElementById("presencaTuristaChart");

      if (presencaTuristaChartInstance) {
        presencaTuristaChartInstance.data.labels = labels;
        presencaTuristaChartInstance.data.datasets[0].data = valores;
        presencaTuristaChartInstance.update();
      } else {
        presencaTuristaChartInstance = new Chart(ctx, {
          type: "bar",
          data: {
            labels: labels,
            datasets: [
              {
                data: valores,
                backgroundColor: [
                  coresUsadas.amarelo,
                  coresUsadas.marromBeige,
                  coresUsadas.marrom,
                  coresUsadas.amareloClaro,
                  coresUsadas.begeMedio,
                ],
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                titleFont: estiloDoTextoDoGrafico.font,
                bodyFont: estiloDoTextoDoGrafico.font,
                callbacks: {
                  label: function (context) {
                    return ` ${context.parsed.y} turistas`;
                  },
                },
              },
            },
            scales: {
              x: {
                ticks: {
                  ...estiloDoTextoDoGrafico,
                  maxRotation: 0,
                  minRotation: 0,
                },
              },
              y: {
                beginAtZero: true,
                ticks: estiloDoTextoDoGrafico,
              },
            },
          },
        });
      }
    })
    .catch((err) => {
      console.error("Erro ao buscar dados de presença de turistas por UF:", err);
    });

  carregamentos.push(carregarPresencaUF);

  // ----------------------------------------------------
  // 3. Gráfico de CHEGADAS
  // Rota esperada no backend: /grafico/chegadas (anteriormente /grafico/dados)
  // Exemplo de retorno: [{ mes_nome: 'Janeiro', chegadas: 1000 }, ...]
  // ----------------------------------------------------
  const carregarChegadas = fetch(`${basePath}/chegadas?${queryString}`)
    .then(async (res) => {
      const data = await res.json();

      const labels = data.map((item) => item.mes_nome);
      const valores = data.map((item) => item.chegadas);
      const ctx = document.getElementById("chegadasTuristasChart");

      if (chegadasTuristasChartInstance) {
        chegadasTuristasChartInstance.data.labels = labels;
        chegadasTuristasChartInstance.data.datasets[0].data = valores;
        chegadasTuristasChartInstance.update();
      } else {
        chegadasTuristasChartInstance = new Chart(ctx, {
          type: "line",
          data: {
            labels: labels,
            datasets: [
              {
                data: valores,
                borderColor: coresUsadas.amarelo,
                borderWidth: 2,
                tension: 0.4,
                fill: false,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                titleFont: estiloDoTextoDoGrafico.font,
                bodyFont: estiloDoTextoDoGrafico.font,
              },
            },
            scales: {
              x: {
                ticks: {
                  ...estiloDoTextoDoGrafico,
                  maxRotation: 0,
                  minRotation: 0,
                },
              },
              y: {
                beginAtZero: true,
                ticks: estiloDoTextoDoGrafico,
              },
            },
          },
        });
      }
    })
    .catch((err) => {
      console.error("Erro ao buscar dados de chegadas de turistas:", err);
    });

  carregamentos.push(carregarChegadas);

  // ----------------------------------------------------
  // 4. KPIs Comparativos
  // ----------------------------------------------------
  const carregarKPIs = fetch(`${basePath}/chegadas-comparativas?${queryString}`)
    .then(async (res) => {
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.erro || `Erro HTTP: ${res.status}`);
      }
      const data = await res.json();

      document.getElementById("kpiChegadasAnoAnterior").textContent =
        data.chegadasAnoAnterior;
      document.getElementById(
        "labelAnoAnterior"
      ).textContent = `em ${data.anoAnterior}`;
      document.getElementById("kpiChegadasAnoAtual").textContent =
        data.chegadasAnoAtual;
      document.getElementById(
        "labelAnoAtual"
      ).textContent = `em ${data.anoAtual}`;
      document.getElementById("kpiPorcentagemComparativa").textContent =
        data.porcentagemComparativa;
    })
    .catch((err) => {
      console.error("Erro ao buscar KPIs de chegadas comparativas:", err);
      definirKPIsPadrao();
    });

  carregamentos.push(carregarKPIs);

  // Aguardar todos os carregamentos terminarem
  try {
    await Promise.all(carregamentos);
    // Todos os dados foram carregados, esconder loading e mostrar dashboard
    esconderLoading();
  } catch (error) {
    console.error("Erro durante o carregamento dos dados:", error);
    // Mesmo com erro, esconder o loading
    esconderLoading();
  }
}

// Função para mostrar a tela de loading
function mostrarLoading() {
  const loadingContainer = document.querySelector('.loading-container');
  const mainGrafico = document.querySelector('.main-grafico');
  
  if (loadingContainer) {
    loadingContainer.style.display = 'block';
  }
  
  if (mainGrafico) {
    mainGrafico.style.display = 'none';
  }
}

// Função para esconder a tela de loading
function esconderLoading() {
  const loadingContainer = document.querySelector('.loading-container');
  const mainGrafico = document.querySelector('.main-grafico');
  
  if (loadingContainer) {
    loadingContainer.style.display = 'none';
  }
  
  if (mainGrafico) {
    mainGrafico.style.display = 'flex';
  }
}

// Função para carregar dados do cache ao inicializar a dashboard
async function carregarDadosDoCache() {
  console.log("carregarDadosDoCache: Função iniciada.");
  
  // Mostrar loading e esconder o dashboard principal
  mostrarLoading();
  
  const basePath = "/api"; // Base path para as APIs de cache

  try {
    // ----------------------------------------------------
    // 1. Buscar dados principais do cache
    // ----------------------------------------------------
    const resCache = await fetch(`${basePath}/cache-data`);
    if (!resCache.ok) {
      console.warn(
        "Nenhum dado em cache disponível. Carregando dados normalmente..."
      );
      await carregarDadosDashboard();
      return;
    }

    const dataCache = await resCache.json();
    console.log("Dados do cache recebidos:", dataCache);

    // Verificar se há dados válidos em cache
    if (
      !dataCache.ultimoPeriodo ||
      (!dataCache.ultimoPeriodo.mes && !dataCache.ultimoPeriodo.ano)
    ) {
      console.warn(
        "Nenhum período válido encontrado no cache. Carregando dados normalmente..."
      );
      await carregarDadosDashboard();
      return;
    }

    const { ultimoPeriodo } = dataCache;
    console.log("Último período encontrado:", ultimoPeriodo);

    // ----------------------------------------------------
    // 3. Atualizar os selects com os valores do cache
    // ----------------------------------------------------
    const selectMesElement =
      document.getElementById("selectMes") ||
      document.getElementById("mes") ||
      document.querySelector('select[name="mes"]');

    const selectAnoElement =
      document.getElementById("selectAno") ||
      document.getElementById("ano") ||
      document.querySelector('select[name="ano"]');

    console.log("Elementos de filtro encontrados:", {
      selectMes: selectMesElement,
      selectAno: selectAnoElement,
    });

    // Atualizar select de mês
    if (selectMesElement && ultimoPeriodo.mes) {
      definirValorSelect(selectMesElement, ultimoPeriodo.mes, "mês");
    }

    // Atualizar select de ano
    if (selectAnoElement && ultimoPeriodo.ano) {
      definirValorSelect(selectAnoElement, ultimoPeriodo.ano, "ano");
    }

    // ----------------------------------------------------
    // 4. Carregar todos os gráficos do cache em paralelo
    // ----------------------------------------------------
    const carregamentosCache = [
      carregarGraficoPaisesOrigemCache(ultimoPeriodo),
      carregarGraficoPresencaUFCache(),
      carregarGraficoChegadasCache(),
      carregarKPIsComparativosCache(),
    ];

    // Aguardar todos os carregamentos do cache terminarem
    await Promise.allSettled(carregamentosCache);

    console.log("Dashboard carregada com dados do cache");
    
    // Esconder loading após todos os dados serem carregados
    esconderLoading();

  } catch (err) {
    console.error("Erro geral ao carregar dados do cache:", err);
    // Em caso de erro, carregar dados normalmente
    // O loading será controlado pela função carregarDadosDashboard
    await carregarDadosDashboard();
  }
}

// Função auxiliar para definir valor do select (caso não exista)
function definirValorSelect(selectElement, valor, tipo) {
  try {
    // Procurar pela option com o valor correspondente
    const option = Array.from(selectElement.options).find(
      opt => opt.value === valor.toString()
    );
    
    if (option) {
      selectElement.value = valor;
      console.log(`Select de ${tipo} definido para:`, valor);
    } else {
      console.warn(`Valor ${valor} não encontrado no select de ${tipo}`);
    }
  } catch (err) {
    console.error(`Erro ao definir valor do select de ${tipo}:`, err);
  }
}

// Funções de carregamento de cache individuais (exemplo de implementação)
// Adapte conforme suas necessidades específicas

async function carregarGraficoPaisesOrigemCache(ultimoPeriodo) {
  try {
    console.log("Carregando gráfico de países de origem do cache...");
    
    const queryParams = new URLSearchParams();
    if (ultimoPeriodo.mes) queryParams.append("mes", ultimoPeriodo.mes);
    if (ultimoPeriodo.ano) queryParams.append("ano", ultimoPeriodo.ano);
    
    const res = await fetch(`/api/cache/paises-origem?${queryParams.toString()}`);
    const data = await res.json();
    
    // Implementar lógica de renderização do gráfico
    // Similar ao que você tem na função principal
    console.log("Gráfico de países de origem carregado do cache");
    
  } catch (err) {
    console.error("Erro ao carregar gráfico de países de origem do cache:", err);
    throw err;
  }
}

async function carregarGraficoPresencaUFCache() {
  try {
    console.log("Carregando gráfico de presença UF do cache...");
    
    // Implementar lógica específica do cache
    console.log("Gráfico de presença UF carregado do cache");
    
  } catch (err) {
    console.error("Erro ao carregar gráfico de presença UF do cache:", err);
    throw err;
  }
}

async function carregarGraficoChegadasCache() {
  try {
    console.log("Carregando gráfico de chegadas do cache...");
    
    // Implementar lógica específica do cache
    console.log("Gráfico de chegadas carregado do cache");
    
  } catch (err) {
    console.error("Erro ao carregar gráfico de chegadas do cache:", err);
    throw err;
  }
}

async function carregarKPIsComparativosCache() {
  try {
    console.log("Carregando KPIs comparativos do cache...");
    
    // Implementar lógica específica do cache
    console.log("KPIs comparativos carregados do cache");
    
  } catch (err) {
    console.error("Erro ao carregar KPIs comparativos do cache:", err);
    throw err;
  }
}

// Função auxiliar para definir valor do select corretamente
function definirValorSelect(selectElement, valor, tipoSelect) {
  if (!selectElement || !valor) return false;

  const valorString = valor.toString();
  console.log(`Tentando definir ${tipoSelect} para:`, valorString);

  // Primeiro, remover a seleção atual
  Array.from(selectElement.options).forEach(option => {
    option.selected = false;
  });

  // Procurar e selecionar a opção correta
  let optionEncontrada = false;
  Array.from(selectElement.options).forEach(option => {
    if (option.value === valorString) {
      option.selected = true;
      optionEncontrada = true;
      console.log(`Opção encontrada e selecionada: ${valorString}`);
    }
  });

  if (optionEncontrada) {
    // Definir o valor do select
    selectElement.value = valorString;
    
    // Disparar evento change para atualizar qualquer listener
    const changeEvent = new Event('change', { bubbles: true });
    selectElement.dispatchEvent(changeEvent);
    
    console.log(`Select ${tipoSelect} atualizado para:`, valorString);
    return true;
  } else {
    console.warn(`Opção de ${tipoSelect} não encontrada:`, valorString);
    // Listar todas as opções disponíveis para debug
    const opcoesDisponiveis = Array.from(selectElement.options).map(opt => opt.value);
    console.log(`Opções disponíveis para ${tipoSelect}:`, opcoesDisponiveis);
    return false;
  }
}

// Função auxiliar para carregar gráfico de países de origem do cache
async function carregarGraficoPaisesOrigemCache(ultimoPeriodo) {
  try {
    console.log("Carregando gráfico de países de origem do cache...");
    
    // Primeiro tentar buscar os dados específicos do cache
    let dadosPaises;
    
    // Tentar diferentes estruturas de dados que podem vir do cache
    if (ultimoPeriodo && ultimoPeriodo.paisesOrigem) {
      dadosPaises = ultimoPeriodo.paisesOrigem;
    } else if (ultimoPeriodo && ultimoPeriodo.paises) {
      dadosPaises = ultimoPeriodo.paises;
    } else {
      // Se não estiver no ultimoPeriodo, tentar buscar diretamente da API
      const res = await fetch("/api/paises-origem-cached");
      if (res.ok) {
        const data = await res.json();
        dadosPaises = data.dados || data.results || data;
      }
    }

    if (!Array.isArray(dadosPaises) || dadosPaises.length === 0) {
      console.warn("Dados de países não encontrados ou vazios no cache");
      return;
    }

    const labels = dadosPaises.map((item) => item.pais);
    const valores = dadosPaises.map((item) => item.percentual);
    const ctx = document.getElementById("myChart");

    if (!ctx) {
      console.error("Elemento canvas 'myChart' não encontrado");
      return;
    }

    if (myChartInstance) {
      myChartInstance.data.labels = labels;
      myChartInstance.data.datasets[0].data = valores;
      myChartInstance.update();
    } else {
      myChartInstance = new Chart(ctx, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              data: valores,
              backgroundColor: [
                coresUsadas.amarelo,
                coresUsadas.marromBeige,
                coresUsadas.marrom,
                coresUsadas.amareloClaro,
                coresUsadas.begeMedio,
              ],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              titleFont: estiloDoTextoDoGrafico.font,
              bodyFont: estiloDoTextoDoGrafico.font,
              callbacks: {
                label: function (context) {
                  return ` ${context.parsed.y}%`;
                },
              },
            },
          },
          scales: {
            x: {
              ticks: {
                ...estiloDoTextoDoGrafico,
                autoSkip: false,
                maxRotation: 90,
                minRotation: 90,
              },
            },
            y: {
              beginAtZero: true,
              ticks: estiloDoTextoDoGrafico,
            },
          },
        },
      });
    }
    console.log("Gráfico de países de origem carregado do cache com sucesso");
  } catch (err) {
    console.error(
      "Erro ao carregar gráfico de países de origem do cache:",
      err
    );
  }
}

// Função auxiliar para carregar gráfico de presença por UF do cache
async function carregarGraficoPresencaUFCache() {
  try {
    console.log("Carregando gráfico de presença por UF do cache...");
    
    const res = await fetch("/api/presenca-uf-cached");
    if (!res.ok) {
      console.warn("Dados de presença por UF não encontrados no cache");
      return;
    }

    const data = await res.json();
    const dadosUF = data.dados || data.results || data;

    if (!Array.isArray(dadosUF) || dadosUF.length === 0) {
      console.warn("Dados de UF não encontrados ou vazios no cache");
      return;
    }

    const labels = dadosUF.map((item) => item.uf);
    const valores = dadosUF.map((item) => item.quantidade);
    const ctx = document.getElementById("presencaTuristaChart");

    if (!ctx) {
      console.error("Elemento canvas 'presencaTuristaChart' não encontrado");
      return;
    }

    if (presencaTuristaChartInstance) {
      presencaTuristaChartInstance.data.labels = labels;
      presencaTuristaChartInstance.data.datasets[0].data = valores;
      presencaTuristaChartInstance.update();
    } else {
      presencaTuristaChartInstance = new Chart(ctx, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              data: valores,
              backgroundColor: [
                coresUsadas.amarelo,
                coresUsadas.marromBeige,
                coresUsadas.marrom,
                coresUsadas.amareloClaro,
                coresUsadas.begeMedio,
              ],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              titleFont: estiloDoTextoDoGrafico.font,
              bodyFont: estiloDoTextoDoGrafico.font,
              callbacks: {
                label: function (context) {
                  return ` ${context.parsed.y} turistas`;
                },
              },
            },
          },
          scales: {
            x: {
              ticks: {
                ...estiloDoTextoDoGrafico,
                maxRotation: 0,
                minRotation: 0,
              },
            },
            y: {
              beginAtZero: true,
              ticks: estiloDoTextoDoGrafico,
            },
          },
        },
      });
    }
    console.log("Gráfico de presença por UF carregado do cache com sucesso");
  } catch (err) {
    console.error("Erro ao carregar gráfico de presença por UF do cache:", err);
  }
}

// Função auxiliar para carregar gráfico de chegadas do cache
async function carregarGraficoChegadasCache() {
  try {
    console.log("Carregando gráfico de chegadas do cache...");
    
    const res = await fetch("/api/chegadas-cached");
    if (!res.ok) {
      console.warn("Dados de chegadas não encontrados no cache");
      return;
    }

    const data = await res.json();
    const dadosChegadas = data.dados || data.results || data;

    if (!Array.isArray(dadosChegadas) || dadosChegadas.length === 0) {
      console.warn("Dados de chegadas não encontrados ou vazios no cache");
      return;
    }

    const labels = dadosChegadas.map((item) => item.mes_nome);
    const valores = dadosChegadas.map((item) => item.chegadas);
    const ctx = document.getElementById("chegadasTuristasChart");

    if (!ctx) {
      console.error("Elemento canvas 'chegadasTuristasChart' não encontrado");
      return;
    }

    if (chegadasTuristasChartInstance) {
      chegadasTuristasChartInstance.data.labels = labels;
      chegadasTuristasChartInstance.data.datasets[0].data = valores;
      chegadasTuristasChartInstance.update();
    } else {
      chegadasTuristasChartInstance = new Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              data: valores,
              borderColor: coresUsadas.amarelo,
              borderWidth: 2,
              tension: 0.4,
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              titleFont: estiloDoTextoDoGrafico.font,
              bodyFont: estiloDoTextoDoGrafico.font,
            },
          },
          scales: {
            x: {
              ticks: {
                ...estiloDoTextoDoGrafico,
                maxRotation: 0,
                minRotation: 0,
              },
            },
            y: {
              beginAtZero: true,
              ticks: estiloDoTextoDoGrafico,
            },
          },
        },
      });
    }
    console.log("Gráfico de chegadas carregado do cache com sucesso");
  } catch (err) {
    console.error("Erro ao carregar gráfico de chegadas do cache:", err);
  }
}

// Função auxiliar para carregar KPIs comparativos do cache
async function carregarKPIsComparativosCache() {
  try {
    console.log("Carregando KPIs comparativos do cache...");
    
    const res = await fetch("/api/chegadas-comparativas-cached");
    if (!res.ok) {
      console.warn("Dados de chegadas comparativas não encontrados no cache");
      definirKPIsPadrao();
      return;
    }

    const data = await res.json();

    // Atualizar elementos do DOM
    const elementos = {
      kpiChegadasAnoAnterior: document.getElementById("kpiChegadasAnoAnterior"),
      labelAnoAnterior: document.getElementById("labelAnoAnterior"),
      kpiChegadasAnoAtual: document.getElementById("kpiChegadasAnoAtual"),
      labelAnoAtual: document.getElementById("labelAnoAtual"),
      kpiPorcentagemComparativa: document.getElementById("kpiPorcentagemComparativa"),
    };

    if (elementos.kpiChegadasAnoAnterior) {
      elementos.kpiChegadasAnoAnterior.textContent =
        data.chegadasAnoAnterior || "N/A";
    }
    if (elementos.labelAnoAnterior) {
      elementos.labelAnoAnterior.textContent = `em ${data.anoAnterior || "---"}`;
    }
    if (elementos.kpiChegadasAnoAtual) {
      elementos.kpiChegadasAnoAtual.textContent =
        data.chegadasAnoAtual || "N/A";
    }
    if (elementos.labelAnoAtual) {
      elementos.labelAnoAtual.textContent = `em ${data.anoAtual || "---"}`;
    }
    if (elementos.kpiPorcentagemComparativa) {
      elementos.kpiPorcentagemComparativa.textContent =
        data.porcentagemComparativa || "N/A";
    }

    console.log("KPIs comparativos carregados do cache com sucesso");
  } catch (err) {
    console.error("Erro ao carregar KPIs comparativos do cache:", err);
    definirKPIsPadrao();
  }
}

// Função auxiliar para definir valores padrão dos KPIs
function definirKPIsPadrao() {
  const elementos = [
    { id: "kpiChegadasAnoAnterior", valor: "N/A" },
    { id: "labelAnoAnterior", valor: "em ---" },
    { id: "kpiChegadasAnoAtual", valor: "N/A" },
    { id: "labelAnoAtual", valor: "em ---" },
    { id: "kpiPorcentagemComparativa", valor: "N/A" },
  ];

  elementos.forEach(({ id, valor }) => {
    const elemento = document.getElementById(id);
    if (elemento) {
      elemento.textContent = valor;
    }
  });
}

function aplicarPreferenciasDoUsuario() {
  // IDs dos elementos relacionados às preferências
  const mapeamentoIds = {
    panoramaGeral: "btnPanoramaGeral",
    perfilTurista: "btnPerfilTurista",
    sazonalidade: "btnSazonalidade",
  };

  const menuContainer = document.querySelector(".menu_container_middle");

  let botoesVisiveis = 0;

  // Recuperar preferências do localStorage
  const preferencias = JSON.parse(
    localStorage.getItem("preferenciaUsuario") || "[]"
  );

  // Mapeia preferências por tela
  const telasAtivas = {};
  preferencias.forEach((pref) => {
    const tela = pref.tela_dashboard?.tela;
    const ativo = pref.ativo;
    if (tela) telasAtivas[tela] = ativo;
  });

  // Aplica visibilidade e conta os visíveis
  Object.entries(mapeamentoIds).forEach(([tela, idElemento]) => {
    const el = document.getElementById(idElemento);
    if (!el) return;

    const ativo = telasAtivas[tela];
    if (ativo === "nao" || ativo === undefined) {
      el.style.display = "none";
    } else {
      el.style.display = "block"; // ou "flex" se preferir
      botoesVisiveis++;
    }
  });

  // Ajusta as colunas conforme a quantidade de botões visíveis
  if (menuContainer) {
    if (botoesVisiveis === 0) {
      menuContainer.style.gridTemplateColumns = "1fr";
    } else {
      menuContainer.style.gridTemplateColumns = `repeat(${botoesVisiveis}, 1fr)`;
    }
  }
}

function aplicarPermissaoUsuario() {
  const idElementoAdmin = "btnAdmin"; // Altere conforme o ID real no HTML
  const el = document.getElementById(idElementoAdmin);

  if (el) {
    // Remove classe e garante que o botão não esteja visível por padrão
    el.classList.remove("ativado");
    el.style.display = "none";

    // Recupera o usuário do localStorage
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    // Se for admin, mostra e aplica a classe ativado
    if (usuario && usuario.permissao === "admin") {
      el.style.display = "block"; // ou "flex", conforme necessário
      el.classList.add("ativado");
    }
  }
}

// Adiciona os event listeners ao funil para chamar a função de carregamento da dashboard
document
  .getElementById("funil")
  .addEventListener("click", carregarDadosDashboard);


// Chama a função de carregamento ao carregar a página.
// Prioriza o carregamento do cache para melhor performance inicial
document.addEventListener("DOMContentLoaded", () => {
  aplicarPreferenciasDoUsuario();
  aplicarPermissaoUsuario();
  carregarDadosDoCache();
});
