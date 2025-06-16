const coresUsadas = {
  amarelo: "#F8CA26",
  marrom: "#735900",
  marromBeige: "#C49F1B",
  amareloClaro: "#FFE483",
  avermelhado: "#A66D44",
  cimento: "#87826E",
  acinzentado: "#DDD8C5",
  cinza: "#E0E0E0",
  marromForte: "#A98400",
  esverdeado: "#6B8E23",
  begeMedio: "#D9C7A7",
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

let myMapaChart;
let myPicoVisitasSazonalidadeChart;

// Referências dos elementos de filtro
const selectMes = document.getElementById("mes");
const selectAno = document.getElementById("ano");
const selectPais = document.getElementById("pais");

// Referências dos elementos de KPI (SPANs para os estados TOP 3).
const variacaoTuristasKPI = document.getElementById("variacaoTuristasKPI");
const variacaoDescKPI = document.getElementById("variacaoDescKPI");
const estadoVisitado1 = document.getElementById("estadoVisitado1");
const estadoVisitado2 = document.getElementById("estadoVisitado2");
const estadoVisitado3 = document.getElementById("estadoVisitado3");
const totalTuristasKPI = document.getElementById("totalTuristasKPI");

// NOVAS REFERÊNCIAS PARA O GRÁFICO DE PICO DE VISITAS (adicionadas ou confirmadas aqui)
const picoVisitasChartContainer = document.getElementById(
  "picoVisitasChartContainer"
);
const picoVisitasChartCanvas = document.getElementById("picoVisitasChart");
const picoVisitasNoDataMessage = document.getElementById(
  "picoVisitasNoDataMessage"
);

function getFiltros() {
  const filtros = {
    mes: selectMes ? selectMes.value : "",
    ano: selectAno ? selectAno.value : "",
    pais: selectPais ? selectPais.value : "",
  };
  console.log("getFiltros(): Filtros atuais:", filtros); // LOG
  return filtros;
}

async function carregarDadosDoCache() {
  console.log("carregarDadosDoCache(): Iniciado.");

  try {
    const response = await fetch("/api/cache-data");
    if (!response.ok) {
      throw new Error(`Erro HTTP! status: ${response.status}`);
    }

    const cacheData = await response.json();
    console.log("carregarDadosDoCache(): Dados do cache recebidos:", cacheData);

    // Definir filtros baseados no último período do cache
    if (cacheData.ultimoPeriodo.mes && selectMes) {
      selectMes.value = cacheData.ultimoPeriodo.mes;
    }
    if (cacheData.ultimoPeriodo.ano && selectAno) {
      selectAno.value = cacheData.ultimoPeriodo.ano;
    }

    // Carregar KPIs com dados do cache
    if (cacheData.ultimoPeriodo.sazonalidadeTotalTuristas && totalTuristasKPI) {
      totalTuristasKPI.textContent = formatNumber(
        cacheData.ultimoPeriodo.sazonalidadeTotalTuristas.total || 0
      );
    }

    if (
      cacheData.ultimoPeriodo.sazonalidadeVariacaoTuristas &&
      variacaoTuristasKPI &&
      variacaoDescKPI
    ) {
      const variacao = cacheData.ultimoPeriodo.sazonalidadeVariacaoTuristas;
      if (variacao.variacao !== null && variacao.variacao !== undefined) {
        variacaoTuristasKPI.textContent = `${
          variacao.variacao > 0 ? "+" : ""
        }${formatNumber(parseFloat(variacao.variacao))}%`;
      }
      if (variacao.mesNome && variacao.anoComparado) {
        const mesNomeFormatado =
          variacao.mesNome.charAt(0).toUpperCase() + variacao.mesNome.slice(1);
        variacaoDescKPI.textContent = `DE VARIAÇÃO DE TURISTAS EM RELAÇÃO A ${mesNomeFormatado.toUpperCase()} DE ${
          variacao.anoComparado
        }.`;
      }
    }

    // Carregar Top 3 Estados com dados do cache
    if (cacheData.ultimoPeriodo.sazonalidadeTopEstados) {
      const topEstados = cacheData.ultimoPeriodo.sazonalidadeTopEstados;
      if (estadoVisitado1) estadoVisitado1.textContent = topEstados[0] || "";
      if (estadoVisitado2) estadoVisitado2.textContent = topEstados[1] || "";
      if (estadoVisitado3) estadoVisitado3.textContent = topEstados[2] || "";
    }

    // Carregar mapa com dados do cache
    if (cacheData.ultimoPeriodo.visitasPorEstado) {
      carregarMapaComDadosCache(cacheData.ultimoPeriodo.visitasPorEstado);
    }

    // Carregar gráfico de pico de visitas com dados do cache
    if (cacheData.ultimoPeriodo.sazonalidadePicoVisitas) {
      carregarPicoVisitasComDadosCache(
        cacheData.ultimoPeriodo.sazonalidadePicoVisitas
      );
    }

    console.log(
      "carregarDadosDoCache(): Dados do cache carregados com sucesso."
    );
  } catch (error) {
    console.error("Erro ao carregar dados do cache:", error);
    console.log("Fallback: Carregando dados via API devido ao erro no cache.");

    // Executa as funções individuais em paralelo
    await Promise.all([
      carregarKPITotalTuristas(),
      carregarKPIVariacaoTuristas(),
      carregarKPITopEstados(),
      carregarMapaEstadosVisitados(),
      carregarPicoVisitasSazonalidadeChart(),
    ]);
  }
}

function carregarMapaComDadosCache(dadosDoCache) {
  console.log(
    "carregarMapaComDadosCache(): Carregando mapa com dados do cache."
  );
  const chartDom = document.getElementById("mapaBrasil");
  if (!chartDom) return;

  if (!dadosDoCache || dadosDoCache.length === 0) {
    chartDom.innerHTML =
      '<div style="text-align: center; padding: 20px;">Nenhum dado de visita disponível.</div>';
    return;
  }

  // Mapeamento dos nomes dos estados para os códigos do mapa do Highcharts
  const estadosParaCodigo = {
    Acre: "br-ac",
    Alagoas: "br-al",
    Amapá: "br-ap",
    Amazonas: "br-am",
    Bahia: "br-ba",
    Ceará: "br-ce",
    "Distrito Federal": "br-df",
    "Espírito Santo": "br-es",
    Goiás: "br-go",
    Maranhão: "br-ma",
    "Mato Grosso": "br-mt",
    "Mato Grosso do Sul": "br-ms",
    "Minas Gerais": "br-mg",
    Pará: "br-pa",
    Paraíba: "br-pb",
    Paraná: "br-pr",
    Pernambuco: "br-pe",
    Piauí: "br-pi",
    "Rio de Janeiro": "br-rj",
    "Rio Grande do Norte": "br-rn",
    "Rio Grande do Sul": "br-rs",
    Rondônia: "br-ro",
    Roraima: "br-rr",
    "Santa Catarina": "br-sc",
    "São Paulo": "br-sp",
    Sergipe: "br-se",
    Tocantins: "br-to",
  };

  // Mapear os dados para o formato esperado pelo Highcharts
  const dadosMapeados = dadosDoCache
    .map((item) => {
      const codigoEstado = estadosParaCodigo[item.estado];
      if (!codigoEstado) {
        console.warn(`Estado não encontrado no mapeamento: ${item.estado}`);
      }
      return {
        "hc-key": codigoEstado,
        name: item.estado,
        value: parseInt(item.total_turistas) || 0,
      };
    })
    .filter((item) => item["hc-key"]);

  // Calcular o valor máximo dos dados convertidos
  const maxValor = Math.max(...dadosMapeados.map((d) => d.value));

  console.log("Dados mapeados:", dadosMapeados);
  console.log("Valor máximo:", maxValor);

  if (myMapaChart) {
    myMapaChart.series[0].setData(dadosMapeados);
    myMapaChart.colorAxis[0].update({ max: maxValor });
  } else {
    if (
      typeof Highcharts !== "undefined" &&
      typeof Highcharts.mapChart !== "undefined"
    ) {
      myMapaChart = Highcharts.mapChart("mapaBrasil", {
        chart: { map: "countries/br/br-all" },
        title: { text: "" },
        colorAxis: {
          min: 0,
          max: maxValor,
          stops: [
            [0.1, coresUsadas.amareloClaro],
            [0.5, coresUsadas.amarelo],
            [0.9, coresUsadas.marrom],
          ],
        },
        series: [
          {
            data: dadosMapeados,
            name: "Turistas estrangeiros",
            tooltip: {
              pointFormat: "<b>{point.name}</b><br>Turistas: {point.value}",
            },
          },
        ],
      });
    }
  }
}

function carregarPicoVisitasComDadosCache(dadosDoCache) {
  console.log(
    "carregarPicoVisitasComDadosCache(): Carregando gráfico com dados do cache."
  );

  const chartCtxElement = picoVisitasChartCanvas;
  const noDataMessageDiv = picoVisitasNoDataMessage;

  if (!chartCtxElement || !noDataMessageDiv) return;

  noDataMessageDiv.style.display = "none";
  chartCtxElement.style.display = "block";

  let labels = [];
  let valores = [];

  if (!dadosDoCache || dadosDoCache.length === 0) {
    labels = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];
    valores = Array(12).fill(0);
  } else {
    labels = dadosDoCache.map((item) => item.mes_nome);
    valores = dadosDoCache.map((item) => item.chegadas);
  }

  if (myPicoVisitasSazonalidadeChart) {
    myPicoVisitasSazonalidadeChart.data.labels = labels;
    myPicoVisitasSazonalidadeChart.data.datasets[0].data = valores;
    myPicoVisitasSazonalidadeChart.update();
  } else if (typeof Chart !== "undefined") {
    myPicoVisitasSazonalidadeChart = new Chart(chartCtxElement, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Pico de Chegadas de Turistas",
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
            callbacks: {
              label: function (context) {
                if (
                  context.parsed.y === 0 &&
                  valores.every((val) => val === 0)
                ) {
                  return ` Chegadas: Nenhum dado`;
                }
                return ` Chegadas: ${formatNumber(context.parsed.y)}`;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { ...estiloDoTextoDoGrafico },
            grid: { color: "rgb(0, 0, 0, 0.1)" },
          },
          x: {
            ticks: { ...estiloDoTextoDoGrafico },
            grid: { color: "rgb(0, 0, 0, 0.1)" },
          },
        },
      },
    });
  }
}

function formatNumber(num) {
  if (typeof num !== "number") return num;
  return num.toLocaleString("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

async function carregarKPITotalTuristas() {
  console.log("carregarKPITotalTuristas(): Iniciado.");
  const { mes, ano, pais } = getFiltros();
  const params = new URLSearchParams();
  if (mes) params.append("mes", mes);
  if (ano) params.append("ano", ano);
  if (pais) params.append("pais", pais);
  const queryString = params.toString();
  const apiUrl = `/grafico/sazonalidade/total-turistas?${queryString}`;
  console.log("carregarKPITotalTuristas(): API URL:", apiUrl);

  try {
    // Assegura que o elemento existe e mostra 'Carregando...'
    if (totalTuristasKPI) {
      totalTuristasKPI.textContent = "Carregando...";
    } else {
      console.error(
        "Elemento 'totalTuristasSazonalidade' não encontrado no DOM para a KPI de Total de Turistas."
      );
      return;
    }

    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Erro HTTP! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("carregarKPITotalTuristas(): Dados recebidos da API:", data);

    if (totalTuristasKPI) {
      if (data && typeof data.total === "number") {
        totalTuristasKPI.textContent = formatNumber(data.total);
      } else {
        totalTuristasKPI.textContent = "N/A";
        console.error(
          "carregarKPITotalTuristas(): Dados.total não é um número válido:",
          data
        );
      }
    }
  } catch (error) {
    console.error("Erro ao carregar KPI Total Turistas Sazonalidade:", error);
    if (totalTuristasKPI) {
      totalTuristasKPI.textContent = "Erro"; // Exibe 'Erro' em caso de falha na requisição
    }
  }
}
async function carregarKPIVariacaoTuristas() {
  console.log("carregarKPIVariacaoTuristas(): Iniciado.");
  const { mes, ano, pais } = getFiltros();
  const params = new URLSearchParams();
  if (mes) params.append("mes", mes);
  if (ano) params.append("ano", ano);
  if (pais) params.append("pais", pais);
  const queryString = params.toString();
  console.log("carregarKPIVariacaoTuristas(): Query String:", queryString);

  try {
    if (variacaoTuristasKPI) variacaoTuristasKPI.textContent = "Carregando...";
    if (variacaoDescKPI) variacaoDescKPI.textContent = "Carregando variação...";

    const response = await fetch(
      `/grafico/sazonalidade/variacao-turistas?${queryString}`
    );
    if (!response.ok) throw new Error(`Erro HTTP! status: ${response.status}`);
    const data = await response.json();
    console.log("carregarKPIVariacaoTuristas(): Dados recebidos:", data);

    if (variacaoTuristasKPI) {
      if (data.variacao !== null && data.variacao !== undefined) {
        variacaoTuristasKPI.textContent = `${
          data.variacao > 0 ? "+" : ""
        }${formatNumber(parseFloat(data.variacao))}%`;
      } else {
        variacaoTuristasKPI.textContent = "N/A";
      }
    }
    if (variacaoDescKPI) {
      if (data.mesNome !== null && data.anoComparado !== null) {
        const mesNomeFormatado = data.mesNome
          ? data.mesNome.charAt(0).toUpperCase() + data.mesNome.slice(1)
          : "o período";
        const anoComparadoFormatado = data.anoComparado || "o ano anterior";
        variacaoDescKPI.textContent = `DE VARIAÇÃO DE TURISTAS EM RELAÇÃO A ${mesNomeFormatado.toUpperCase()} DE ${anoComparadoFormatado}.`;
      } else {
        variacaoDescKPI.textContent = "SELECIONE UM ANO PARA VER A VARIAÇÃO.";
      }
    }
  } catch (error) {
    console.error(
      "Erro ao carregar KPI Variação Turistas Sazonalidade:",
      error
    );
    if (variacaoTuristasKPI) variacaoTuristasKPI.textContent = "Erro";
    if (variacaoDescKPI)
      variacaoDescKPI.textContent = "Erro ao carregar variação.";
  }
}
async function carregarKPITopEstados() {
  console.log("carregarKPITopEstados(): Iniciado."); // LOG
  const { mes, ano, pais } = getFiltros();
  const params = new URLSearchParams();
  if (mes) params.append("mes", mes);
  if (ano) params.append("ano", ano);
  if (pais) params.append("pais", pais);
  const queryString = params.toString();
  console.log(
    "carregarKPITopEstados(): Query String para top-estados:",
    queryString
  );

  const setEstadoText = (element, text) => {
    if (element) element.textContent = text;
  };
  const clearEstados = () => {
    setEstadoText(estadoVisitado1, "");
    setEstadoText(estadoVisitado2, "");
    setEstadoText(estadoVisitado3, "");
  };

  try {
    setEstadoText(estadoVisitado1, "Carregando...");
    setEstadoText(estadoVisitado2, "");
    setEstadoText(estadoVisitado3, "");

    const response = await fetch(
      `/grafico/sazonalidade/top-estados?${queryString}`
    );
    if (!response.ok) throw new Error(`Erro HTTP! status: ${response.status}`);

    const data = await response.json();
    console.log("carregarKPITopEstados(): Dados recebidos:", data);

    clearEstados();
    if (data && data.length > 0) {
      setEstadoText(estadoVisitado1, data[0] || "");
      setEstadoText(estadoVisitado2, data[1] || "");
      setEstadoText(estadoVisitado3, data[2] || "");
    } else {
      setEstadoText(estadoVisitado1, "Nenhum dado");
      setEstadoText(estadoVisitado2, "disponível");
      setEstadoText(estadoVisitado3, "");
    }
  } catch (error) {
    console.error("Erro ao carregar KPI Top Estados Sazonalidade:", error);
    clearEstados();
    setEstadoText(estadoVisitado1, "Erro ao");
    setEstadoText(estadoVisitado2, "carregar");
    setEstadoText(estadoVisitado3, "");
  }
}
async function carregarMapaEstadosVisitados() {
  console.log("carregarMapaEstadosVisitados(): Iniciado.");
  const { mes, ano, pais } = getFiltros();
  let apiUrl = `/grafico/visitas-por-estado`;
  const queryParams = [];

  if (mes) queryParams.push(`mes=${mes}`);
  if (ano) queryParams.push(`ano=${ano}`);
  if (pais) queryParams.push(`pais=${pais}`);
  if (queryParams.length > 0) apiUrl += `?${queryParams.join("&")}`;
  console.log("carregarMapaEstadosVisitados(): API URL:", apiUrl);

  try {
    const chartDom = document.getElementById("mapaBrasil");
    console.log(
      "carregarMapaEstadosVisitados(): Elemento 'mapaBrasil' encontrado?",
      !!chartDom
    );

    // Limpa conteúdo e mostra carregamento
    if (myMapaChart) {
      myMapaChart.showLoading("Carregando mapa...");
    } else if (chartDom) {
      chartDom.innerHTML = "";
      const loadingText = document.createElement("div");
      loadingText.textContent = "Carregando mapa...";
      loadingText.style.textAlign = "center";
      loadingText.style.padding = "20px";
      chartDom.appendChild(loadingText);
    }

    const response = await fetch(apiUrl);
    console.log(
      "carregarMapaEstadosVisitados(): Resposta do fetch:",
      response.status,
      response.statusText
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const dadosRawDoBackend = await response.json();
    console.log(
      "carregarMapaEstadosVisitados(): Dados brutos recebidos:",
      dadosRawDoBackend
    );

    // Remove o texto de carregamento
    if (chartDom && chartDom.querySelector('div[style*="Carregando mapa"]')) {
      chartDom.querySelector('div[style*="Carregando mapa"]').remove();
    }

    // Verificar estrutura dos dados e processar corretamente
    if (!dadosRawDoBackend || dadosRawDoBackend.length === 0) {
      console.log(
        "carregarMapaEstadosVisitados(): Nenhum dado retornado da API"
      );
      mostrarMensagemSemDados(chartDom);
      return;
    }

    // Mapeamento dos nomes dos estados para os códigos do Highcharts
    const estadosParaCodigo = {
      Acre: "br-ac",
      Alagoas: "br-al",
      Amapá: "br-ap",
      Amazonas: "br-am",
      Bahia: "br-ba",
      Ceará: "br-ce",
      "Distrito Federal": "br-df",
      "Espírito Santo": "br-es",
      Goiás: "br-go",
      Maranhão: "br-ma",
      "Mato Grosso": "br-mt",
      "Mato Grosso do Sul": "br-ms",
      "Minas Gerais": "br-mg",
      Pará: "br-pa",
      Paraíba: "br-pb",
      Paraná: "br-pr",
      Pernambuco: "br-pe",
      Piauí: "br-pi",
      "Rio de Janeiro": "br-rj",
      "Rio Grande do Norte": "br-rn",
      "Rio Grande do Sul": "br-rs",
      Rondônia: "br-ro",
      Roraima: "br-rr",
      "Santa Catarina": "br-sc",
      "São Paulo": "br-sp",
      Sergipe: "br-se",
      Tocantins: "br-to",
    };

    // Processar os dados corretamente
    const dadosProcessados = dadosRawDoBackend
      .map((item) => {
        let totalTuristas = 0;

        if (item.total_turistas) {
          const turistasString = item.total_turistas
            .toString()
            .replace(/,/g, "");
          totalTuristas = parseInt(turistasString, 10) || 0;
        }

        const codigoEstado = estadosParaCodigo[item.estado];

        if (!codigoEstado) {
          console.warn(`Estado não encontrado no mapeamento: ${item.estado}`);
        }

        return {
          "hc-key": codigoEstado,
          name: item.estado,
          value: totalTuristas,
          originalData: item,
        };
      })
      .filter((item) => item["hc-key"]);

    console.log(
      "carregarMapaEstadosVisitados(): Dados processados:",
      dadosProcessados
    );

    // Verificar se há dados válidos após processamento
    const dadosComValor = dadosProcessados.filter((item) => item.value > 0);

    if (dadosComValor.length === 0) {
      console.log(
        "carregarMapaEstadosVisitados(): Todos os valores são zero ou inválidos"
      );
      mostrarMensagemSemDados(chartDom);
      return;
    }

    // Calcular o valor máximo corretamente
    const maxValor = Math.max(...dadosProcessados.map((d) => d.value));
    console.log(
      "carregarMapaEstadosVisitados(): Valor máximo calculado:",
      maxValor
    );

    // Verificar se maxValor é válido
    if (isNaN(maxValor) || maxValor <= 0) {
      console.error(
        "carregarMapaEstadosVisitados(): Valor máximo inválido:",
        maxValor
      );
      mostrarMensagemSemDados(chartDom);
      return;
    }

    // Atualizar ou criar o mapa
    if (myMapaChart) {
      console.log("carregarMapaEstadosVisitados(): Atualizando mapa existente");
      myMapaChart.series[0].setData(dadosProcessados);
      myMapaChart.colorAxis[0].update({ max: maxValor });
      myMapaChart.hideLoading();
    } else {
      console.log("carregarMapaEstadosVisitados(): Criando novo mapa");

      if (
        typeof Highcharts === "undefined" ||
        typeof Highcharts.mapChart === "undefined"
      ) {
        console.error(
          "Highcharts não está carregado. Verifique a inclusão dos scripts Highcharts no HTML."
        );
        if (chartDom) chartDom.textContent = "Erro: Highcharts não carregado.";
        return;
      }

      myMapaChart = Highcharts.mapChart("mapaBrasil", {
        chart: { map: "countries/br/br-all" },
        title: { text: "" },
        colorAxis: {
          min: 0,
          max: maxValor,
          stops: [
            [0.1, coresUsadas.amareloClaro],
            [0.5, coresUsadas.amarelo],
            [0.9, coresUsadas.marrom],
          ],
        },
        series: [
          {
            data: dadosProcessados,
            name: "Turistas estrangeiros",
            tooltip: {
              pointFormat:
                "<b>{point.name}</b><br>Turistas: {point.value:,.0f}",
            },
          },
        ],
      });
    }

    console.log("carregarMapaEstadosVisitados(): Mapa carregado com sucesso");
  } catch (error) {
    console.error(
      "Erro ao carregar o mapa de calor de estados mais visitados:",
      error
    );
    const chartDom = document.getElementById("mapaBrasil");

    if (myMapaChart) {
      myMapaChart.series[0].setData([]);
      myMapaChart.hideLoading();
      myMapaChart.showLoading("Erro ao carregar mapa.");
    } else if (chartDom) {
      chartDom.innerHTML = "";
      const errorText = document.createElement("div");
      errorText.textContent =
        "Erro ao carregar o mapa. Verifique os logs do console.";
      errorText.style.textAlign = "center";
      errorText.style.padding = "20px";
      errorText.style.color = "red";
      chartDom.appendChild(errorText);
    }
  }
}
// Função auxiliar para mostrar mensagem de "sem dados"
function mostrarMensagemSemDados(chartDom) {
  if (myMapaChart) {
    myMapaChart.destroy();
    myMapaChart = null;
  }

  if (chartDom) {
    chartDom.innerHTML = "";
    const noDataText = document.createElement("div");
    noDataText.textContent =
      "Nenhum dado de visita disponível para o mapa com os filtros selecionados.";
    noDataText.style.textAlign = "center";
    noDataText.style.padding = "20px";
    noDataText.style.color = "#666";
    noDataText.style.fontSize = "14px";
    chartDom.appendChild(noDataText);
  }
}

async function carregarPicoVisitasSazonalidadeChart() {
  console.log("carregarPicoVisitasSazonalidadeChart(): Iniciado.");
  const chartCtxElement = picoVisitasChartCanvas;
  const container = picoVisitasChartContainer;
  const noDataMessageDiv = picoVisitasNoDataMessage;

  // Verifica se todos os elementos necessários foram encontrados
  if (!chartCtxElement || !container || !noDataMessageDiv) {
    console.error(
      "Um ou mais elementos de gráfico/mensagem não encontrados no DOM para o gráfico de pico de visitas. Não pode ser inicializado."
    );
    return;
  }

  const { ano, mes, pais } = getFiltros();
  console.log("carregarPicoVisitasSazonalidadeChart(): Filtros para API:", {
    ano,
    mes,
    pais,
  });

  // --- Lógica de Carregamento e Estado Inicial ---
  // Sempre mostrar o canvas, mas exibir mensagem de "carregando"
  noDataMessageDiv.style.display = "flex";
  noDataMessageDiv.textContent = "Carregando dados de pico de visitas...";
  chartCtxElement.style.display = "block";

  // Temporariamente limpa o gráfico existente enquanto carrega
  if (myPicoVisitasSazonalidadeChart) {
    myPicoVisitasSazonalidadeChart.data.datasets[0].data = [];
    myPicoVisitasSazonalidadeChart.update();
  }

  try {
    // Constrói a URL da API com base nos filtros
    let apiUrl = `/grafico/sazonalidade/pico-visitas-unica-linha`;
    const queryParams = [];
    if (ano) {
      queryParams.push(`ano=${ano}`);
    }
    if (pais) {
      queryParams.push(`pais=${pais}`);
    }

    if (queryParams.length > 0) {
      apiUrl += `?${queryParams.join("&")}`;
    }
    console.log("carregarPicoVisitasSazonalidadeChart(): API URL:", apiUrl);

    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Erro HTTP! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(
      "carregarPicoVisitasSazonalidadeChart(): Dados recebidos da API:",
      data
    );

    // Esconde a mensagem de carregamento agora que temos a resposta
    noDataMessageDiv.style.display = "none";

    let labels = [];
    let valores = [];

    // --- Lógica de "Nenhum Dado" ou "Dados Disponíveis" ---
    if (
      !data ||
      data.length === 0 ||
      data.every((item) => item.chegadas === 0)
    ) {
      labels = [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro",
      ];
      valores = Array(12).fill(0);
    } else {
      labels = data.map((item) => item.mes_nome);
      valores = data.map((item) => item.chegadas);
    }

    // --- Atualização ou Criação do Gráfico ---
    if (myPicoVisitasSazonalidadeChart) {
      console.log(
        "carregarPicoVisitasSazonalidadeChart(): Atualizando gráfico existente."
      );
      myPicoVisitasSazonalidadeChart.data.labels = labels;
      myPicoVisitasSazonalidadeChart.data.datasets[0].data = valores;
      myPicoVisitasSazonalidadeChart.update();
    } else {
      if (typeof Chart === "undefined") {
        console.error(
          "Chart.js não está carregado. Verifique a inclusão dos scripts Chart.js no HTML."
        );
        noDataMessageDiv.style.display = "flex";
        noDataMessageDiv.textContent = "Erro: Chart.js não carregado.";
        chartCtxElement.style.display = "none";
        return;
      }
      console.log(
        "carregarPicoVisitasSazonalidadeChart(): Criando novo gráfico."
      );
      myPicoVisitasSazonalidadeChart = new Chart(chartCtxElement, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Pico de Chegadas de Turistas",
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
              callbacks: {
                label: function (context) {
                  if (
                    context.parsed.y === 0 &&
                    valores.every((val) => val === 0)
                  ) {
                    return ` Chegadas: Nenhum dado`;
                  }
                  return ` Chegadas: ${formatNumber(context.parsed.y)}`;
                },
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { ...estiloDoTextoDoGrafico },
              grid: { color: "rgb(0, 0, 0, 0.1)" },
            },
            x: {
              ticks: { ...estiloDoTextoDoGrafico },
              grid: { color: "rgb(0, 0, 0, 0.1)" },
            },
          },
        },
      });
    }
  } catch (error) {
    console.error(
      "Erro ao carregar gráfico de pico de visitas - sazonalidade:",
      error
    );
    // Em caso de erro, exibe a mensagem de erro e garante que o canvas está visível
    noDataMessageDiv.textContent =
      "Erro ao carregar gráfico de pico de visitas.";
    noDataMessageDiv.style.display = "flex";
    chartCtxElement.style.display = "block";

    if (myPicoVisitasSazonalidadeChart) {
      myPicoVisitasSazonalidadeChart.data.labels = [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro",
      ];
      myPicoVisitasSazonalidadeChart.data.datasets[0].data = Array(12).fill(0);
      myPicoVisitasSazonalidadeChart.update();
    }
  }
}

// Funções para controlar o loading
function mostrarLoading() {
  const loadingContainer = document.querySelector(".loading-container");
  const mainGrafico = document.querySelector(".main-grafico");

  if (loadingContainer) {
    loadingContainer.style.display = "flex";
  }

  if (mainGrafico) {
    mainGrafico.style.display = "none";
  }

  console.log("Loading: Exibindo tela de carregamento");
}

function esconderLoading() {
  const loadingContainer = document.querySelector(".loading-container");
  const mainGrafico = document.querySelector(".main-grafico");

  if (loadingContainer) {
    loadingContainer.style.display = "none";
  }

  if (mainGrafico) {
    mainGrafico.style.display = "flex";
  }

  console.log("Loading: Exibindo dashboard com dados carregados");
}

// Função modificada para incluir controle de loading
async function carregarTodosOsDadosDoDashboard(usarCache = false) {
  console.log(
    "carregarTodosOsDadosDoDashboard(): Iniciado.",
    usarCache ? "Usando cache." : "Usando API."
  );

  // Mostra o loading no início
  mostrarLoading();

  try {
    if (usarCache) {
      await carregarDadosDoCache();
    } else {
      // Executa todas as funções de carregamento
      await Promise.all([
        carregarKPITotalTuristas(),
        carregarKPIVariacaoTuristas(),
        carregarKPITopEstados(),
        carregarMapaEstadosVisitados(),
        carregarPicoVisitasSazonalidadeChart(),
      ]);
    }

    console.log("carregarTodosOsDadosDoDashboard(): Concluído com sucesso.");
  } catch (error) {
    console.error("Erro ao carregar dados do dashboard:", error);
  } finally {
    setTimeout(() => {
      esconderLoading();
    }, 3000);
  }
}

function aplicarPreferenciasDoUsuario() {
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
      el.style.display = "block";
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
  const idElementoAdmin = "btnAdmin";
  const el = document.getElementById(idElementoAdmin);

  if (el) {
    el.classList.remove("ativado");
    el.style.display = "none";

    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (usuario && usuario.permissao === "admin") {
      el.style.display = "block";
      el.classList.add("ativado");
    }
  }
}
document.getElementById("funil").addEventListener("click", () => {
  carregarTodosOsDadosDoDashboard(false);
});

document.addEventListener("DOMContentLoaded", () => {
  aplicarPreferenciasDoUsuario();

  carregarTodosOsDadosDoDashboard(true);
});
