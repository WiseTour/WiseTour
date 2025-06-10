// public/js/sazonalidade.js

// --- Replicando definições de estilo do index.js para consistência ---
const coresUsadas = {
    amarelo: '#F8CA26',
    marrom: '#735900',
    marromBeige: '#C49F1B',
    amareloClaro: '#FFE483',
    avermelhado: '#A66D44',
    cimento: '#87826E',
    acinzentado: '#DDD8C5',
    cinza: '#E0E0E0',
    marromForte: '#A98400',
    esverdeado: '#6B8E23',
    begeMedio: '#D9C7A7'
};

const opcoesPadrao = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
        padding: {
            top: 10,
            bottom: 10,
            left: 10,
            right: 10
        }
    }
};

const estiloDoTextoDoGrafico = {
    color: '#000000',
    font: {
        weight: '500',
        family: "'Anybody', sans-serif",
        size: 12
    }
};
// --- Fim das definições replicadas ---


// Variável global para a instância do Highcharts MapChart.
let myMapaChart;
// Variável global para a instância do gráfico de "Pico de Visitas - Sazonalidade" (linha única).
let myPicoVisitasSazonalidadeChart;

// Referências dos elementos de filtro
const selectMes = document.getElementById('mes');
const selectAno = document.getElementById('ano');
const selectPais = document.getElementById('pais');

// Referências dos elementos de KPI (SPANs para os estados TOP 3).
const variacaoTuristasKPI = document.getElementById('variacaoTuristasKPI');
const variacaoDescKPI = document.getElementById('variacaoDescKPI');
const estadoVisitado1 = document.getElementById('estadoVisitado1');
const estadoVisitado2 = document.getElementById('estadoVisitado2');
const estadoVisitado3 = document.getElementById('estadoVisitado3');
const totalTuristasKPI = document.getElementById('totalTuristasSazonalidade');

// NOVAS REFERÊNCIAS PARA O GRÁFICO DE PICO DE VISITAS (adicionadas ou confirmadas aqui)
const picoVisitasChartContainer = document.getElementById('picoVisitasChartContainer');
const picoVisitasChartCanvas = document.getElementById('picoVisitasChart');
const picoVisitasNoDataMessage = document.getElementById('picoVisitasNoDataMessage');


// --- Adicionando LOGS de inicialização para depuração ---
console.log("sazonalidade.js: Script carregado.");
console.log("sazonalidade.js: selectMes (id='mes') encontrado?", !!selectMes);
console.log("sazonalidade.js: selectAno (id='ano') encontrado?", !!selectAno);
console.log("sazonalidade.js: selectPais (id='pais') encontrado?", !!selectPais);
console.log("sazonalidade.js: picoVisitasChartContainer encontrado?", !!picoVisitasChartContainer);
console.log("sazonalidade.js: picoVisitasChartCanvas encontrado?", !!picoVisitasChartCanvas);
console.log("sazonalidade.js: picoVisitasNoDataMessage encontrado?", !!picoVisitasNoDataMessage);


/**
 * Obtém os valores selecionados nos filtros.
 */
function getFiltros() {
    const filtros = {
        mes: selectMes ? selectMes.value : '',
        ano: selectAno ? selectAno.value : '',
        pais: selectPais ? selectPais.value : ''
    };
    console.log("getFiltros(): Filtros atuais:", filtros); // LOG
    return filtros;
}


async function carregarDadosDoCache() {
    console.log("carregarDadosDoCache(): Iniciado.");
    
    try {
        const response = await fetch('/api/cache-data');
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
            totalTuristasKPI.textContent = formatNumber(cacheData.ultimoPeriodo.sazonalidadeTotalTuristas.total || 0);
        }
        
        if (cacheData.ultimoPeriodo.sazonalidadeVariacaoTuristas && variacaoTuristasKPI && variacaoDescKPI) {
            const variacao = cacheData.ultimoPeriodo.sazonalidadeVariacaoTuristas;
            if (variacao.variacao !== null && variacao.variacao !== undefined) {
                variacaoTuristasKPI.textContent = `${variacao.variacao > 0 ? '+' : ''}${formatNumber(parseFloat(variacao.variacao))}%`;
            }
            if (variacao.mesNome && variacao.anoComparado) {
                const mesNomeFormatado = variacao.mesNome.charAt(0).toUpperCase() + variacao.mesNome.slice(1);
                variacaoDescKPI.textContent = `DE VARIAÇÃO DE TURISTAS EM RELAÇÃO A ${mesNomeFormatado.toUpperCase()} DE ${variacao.anoComparado}.`;
            }
        }
        
        // Carregar Top 3 Estados com dados do cache
        if (cacheData.ultimoPeriodo.sazonalidadeTopEstados) {
            const topEstados = cacheData.ultimoPeriodo.sazonalidadeTopEstados;
            if (estadoVisitado1) estadoVisitado1.textContent = topEstados[0] || '';
            if (estadoVisitado2) estadoVisitado2.textContent = topEstados[1] || '';
            if (estadoVisitado3) estadoVisitado3.textContent = topEstados[2] || '';
        }
        
        // Carregar mapa com dados do cache
        if (cacheData.ultimoPeriodo.visitasPorEstado) {
            carregarMapaComDadosCache(cacheData.ultimoPeriodo.visitasPorEstado);
        }
        
        // Carregar gráfico de pico de visitas com dados do cache
        if (cacheData.ultimoPeriodo.sazonalidadePicoVisitas) {
            carregarPicoVisitasComDadosCache(cacheData.ultimoPeriodo.sazonalidadePicoVisitas);
        }
        
        console.log("carregarDadosDoCache(): Dados do cache carregados com sucesso.");
        
    } catch (error) {
        console.error('Erro ao carregar dados do cache:', error);
        // Se falhar ao carregar do cache, carrega normalmente via API
        console.log("Fallback: Carregando dados via API devido ao erro no cache.");
        await carregarTodosOsDadosDoDashboard();
    }
}


function carregarMapaComDadosCache(dadosDoCache) {
    console.log("carregarMapaComDadosCache(): Carregando mapa com dados do cache.");
    
    const chartDom = document.getElementById('mapaBrasil');
    if (!chartDom) return;
    
    if (!dadosDoCache || dadosDoCache.length === 0) {
        chartDom.innerHTML = '<div style="text-align: center; padding: 20px;">Nenhum dado de visita disponível.</div>';
        return;
    }
    
    const maxValor = Math.max(...dadosDoCache.map(d => d.value));
    
    if (myMapaChart) {
        myMapaChart.series[0].setData(dadosDoCache);
        myMapaChart.colorAxis[0].update({ max: maxValor });
    } else {
        if (typeof Highcharts !== 'undefined' && typeof Highcharts.mapChart !== 'undefined') {
            myMapaChart = Highcharts.mapChart('mapaBrasil', {
                chart: { map: 'countries/br/br-all' },
                title: { text: '' },
                colorAxis: {
                    min: 0,
                    max: maxValor,
                    stops: [
                        [0.1, coresUsadas.amareloClaro],
                        [0.5, coresUsadas.amarelo],
                        [0.9, coresUsadas.marrom]
                    ]
                },
                series: [{
                    data: dadosDoCache,
                    name: 'Turistas estrangeiros',
                    tooltip: { pointFormat: '<b>{point.name}</b><br>Turistas: {point.value}' }
                }]
            });
        }
    }
}


function carregarPicoVisitasComDadosCache(dadosDoCache) {
    console.log("carregarPicoVisitasComDadosCache(): Carregando gráfico com dados do cache.");
    
    const chartCtxElement = picoVisitasChartCanvas;
    const noDataMessageDiv = picoVisitasNoDataMessage;
    
    if (!chartCtxElement || !noDataMessageDiv) return;
    
    noDataMessageDiv.style.display = 'none';
    chartCtxElement.style.display = 'block';
    
    let labels = [];
    let valores = [];
    
    if (!dadosDoCache || dadosDoCache.length === 0) {
        labels = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
                  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
        valores = Array(12).fill(0);
    } else {
        labels = dadosDoCache.map(item => item.mes_nome);
        valores = dadosDoCache.map(item => item.chegadas);
    }
    
    if (myPicoVisitasSazonalidadeChart) {
        myPicoVisitasSazonalidadeChart.data.labels = labels;
        myPicoVisitasSazonalidadeChart.data.datasets[0].data = valores;
        myPicoVisitasSazonalidadeChart.update();
    } else if (typeof Chart !== 'undefined') {
        myPicoVisitasSazonalidadeChart = new Chart(chartCtxElement, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Pico de Chegadas de Turistas',
                    data: valores,
                    borderColor: coresUsadas.amarelo,
                    borderWidth: 2,
                    tension: 0.4,
                    fill: false
                }]
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
                            label: function(context) {
                                if (context.parsed.y === 0 && (valores.every(val => val === 0))) {
                                    return ` Chegadas: Nenhum dado`;
                                }
                                return ` Chegadas: ${formatNumber(context.parsed.y)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { ...estiloDoTextoDoGrafico },
                        grid: { color: 'rgb(0, 0, 0, 0.1)' }
                    },
                    x: {
                        ticks: { ...estiloDoTextoDoGrafico },
                        grid: { color: 'rgb(0, 0, 0, 0.1)' }
                    }
                }
            }
        });
    }
}

/**
 * Função para formatar números com vírgula como separador decimal e ponto como separador de milhar.
 * Ex: 6435.87 -> 6.435,87
 */
function formatNumber(num) {
    if (typeof num !== 'number') return num; // Garante que é um número
    return num.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

/**
 * Função para carregar e atualizar a KPI "Quantidade Total de Turistas" via API.
 */
async function carregarKPITotalTuristas() {
    console.log("carregarKPITotalTuristas(): Iniciado.");
    const { mes, ano, pais } = getFiltros();
    const params = new URLSearchParams();
    if (mes) params.append('mes', mes);
    if (ano) params.append('ano', ano);
    if (pais) params.append('pais', pais);
    const queryString = params.toString();
    const apiUrl = `/grafico/sazonalidade/total-turistas?${queryString}`;
    console.log("carregarKPITotalTuristas(): API URL:", apiUrl);

    try {
        // Assegura que o elemento existe e mostra 'Carregando...'
        if (totalTuristasKPI) {
            totalTuristasKPI.textContent = 'Carregando...';
        } else {
            console.error("Elemento 'totalTuristasSazonalidade' não encontrado no DOM para a KPI de Total de Turistas.");
            return; // Sai da função se o elemento não for encontrado
        }

        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Erro HTTP! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("carregarKPITotalTuristas(): Dados recebidos da API:", data);

        if (totalTuristasKPI) {
            // Verifica se 'data' e 'data.total' existem e são números
            if (data && typeof data.total === 'number') {
                totalTuristasKPI.textContent = formatNumber(data.total); // Usa sua função formatNumber
            } else {
                totalTuristasKPI.textContent = 'N/A'; // Exibe N/A se o dado não for válido
                console.error("carregarKPITotalTuristas(): Dados.total não é um número válido:", data);
            }
        }
    } catch (error) {
        console.error('Erro ao carregar KPI Total Turistas Sazonalidade:', error);
        if (totalTuristasKPI) {
            totalTuristasKPI.textContent = 'Erro'; // Exibe 'Erro' em caso de falha na requisição
        }
    }
}

/**
 * Função para carregar e atualizar a KPI "Variação de Turistas" via API.
 */
async function carregarKPIVariacaoTuristas() {
    console.log("carregarKPIVariacaoTuristas(): Iniciado.");
    const { mes, ano, pais } = getFiltros();
    const params = new URLSearchParams();
    if (mes) params.append('mes', mes);
    if (ano) params.append('ano', ano);
    if (pais) params.append('pais', pais);
    const queryString = params.toString();
    console.log("carregarKPIVariacaoTuristas(): Query String:", queryString);

    try {
        if (variacaoTuristasKPI) variacaoTuristasKPI.textContent = 'Carregando...';
        if (variacaoDescKPI) variacaoDescKPI.textContent = 'Carregando variação...';

        const response = await fetch(`/grafico/sazonalidade/variacao-turistas?${queryString}`);
        if (!response.ok) throw new Error(`Erro HTTP! status: ${response.status}`);
        const data = await response.json();
        console.log("carregarKPIVariacaoTuristas(): Dados recebidos:", data);

        if (variacaoTuristasKPI) {
            if (data.variacao !== null && data.variacao !== undefined) {
                variacaoTuristasKPI.textContent = `${data.variacao > 0 ? '+' : ''}${formatNumber(parseFloat(data.variacao))}%`;
            } else {
                variacaoTuristasKPI.textContent = 'N/A';
            }
        }
        if (variacaoDescKPI) {
            if (data.mesNome !== null && data.anoComparado !== null) {
                const mesNomeFormatado = data.mesNome ? data.mesNome.charAt(0).toUpperCase() + data.mesNome.slice(1) : 'o período';
                const anoComparadoFormatado = data.anoComparado || 'o ano anterior';
                variacaoDescKPI.textContent = `DE VARIAÇÃO DE TURISTAS EM RELAÇÃO A ${mesNomeFormatado.toUpperCase()} DE ${anoComparadoFormatado}.`;
            } else {
                variacaoDescKPI.textContent = 'SELECIONE UM ANO PARA VER A VARIAÇÃO.';
            }
        }
    } catch (error) {
        console.error('Erro ao carregar KPI Variação Turistas Sazonalidade:', error);
        if (variacaoTuristasKPI) variacaoTuristasKPI.textContent = 'Erro';
        if (variacaoDescKPI) variacaoDescKPI.textContent = 'Erro ao carregar variação.';
    }
}


/**
 * Função para carregar e atualizar a KPI "TOP 3 Estados Mais Visitados" via API.
 */
async function carregarKPITopEstados() {
    console.log("carregarKPITopEstados(): Iniciado."); // LOG
    const { mes, ano, pais } = getFiltros();
    const params = new URLSearchParams();
    if (mes) params.append('mes', mes);
    if (ano) params.append('ano', ano);
    if (pais) params.append('pais', pais);
    const queryString = params.toString();
    console.log("carregarKPITopEstados(): Query String para top-estados:", queryString);

    const setEstadoText = (element, text) => { if (element) element.textContent = text; };
    const clearEstados = () => {
        setEstadoText(estadoVisitado1, '');
        setEstadoText(estadoVisitado2, '');
        setEstadoText(estadoVisitado3, '');
    };

    try {
        setEstadoText(estadoVisitado1, 'Carregando...');
        setEstadoText(estadoVisitado2, '');
        setEstadoText(estadoVisitado3, '');

        const response = await fetch(`/grafico/sazonalidade/top-estados?${queryString}`);
        if (!response.ok) throw new Error(`Erro HTTP! status: ${response.status}`);

        const data = await response.json();
        console.log("carregarKPITopEstados(): Dados recebidos:", data);

        clearEstados();
        if (data && data.length > 0) {
            setEstadoText(estadoVisitado1, data[0] || '');
            setEstadoText(estadoVisitado2, data[1] || '');
            setEstadoText(estadoVisitado3, data[2] || '');
        } else {
            setEstadoText(estadoVisitado1, 'Nenhum dado');
            setEstadoText(estadoVisitado2, 'disponível');
            setEstadoText(estadoVisitado3, '');
        }

    } catch (error) {
        console.error('Erro ao carregar KPI Top Estados Sazonalidade:', error);
        clearEstados();
        setEstadoText(estadoVisitado1, 'Erro ao');
        setEstadoText(estadoVisitado2, 'carregar');
        setEstadoText(estadoVisitado3, '');
    }
}


/**
 * Função para carregar e atualizar o mapa de calor dos estados visitados (Highcharts) via API.
 */
async function carregarMapaEstadosVisitados() {
    console.log("carregarMapaEstadosVisitados(): Iniciado.");
    const { mes, ano, pais } = getFiltros();
    let apiUrl = `/grafico/visitas-por-estado`; // Rota da API para dados do mapa.
    const queryParams = [];

    // Esta parte já está correta e adiciona os parâmetros apenas se existirem.
    if (mes) queryParams.push(`mes=${mes}`);
    if (ano) queryParams.push(`ano=${ano}`);
    if (pais) queryParams.push(`pais=${pais}`);
    if (queryParams.length > 0) apiUrl += `?${queryParams.join('&')}`;
    console.log("carregarMapaEstadosVisitados(): API URL:", apiUrl);

    try {
        const chartDom = document.getElementById('mapaBrasil');
        console.log("carregarMapaEstadosVisitados(): Elemento 'mapaBrasil' encontrado?", !!chartDom);

        // Limpa conteúdo e mostra carregamento
        if (myMapaChart) {
            myMapaChart.showLoading('Carregando mapa...');
        } else if (chartDom) {
            chartDom.innerHTML = ''; // Limpa o conteúdo antes de mostrar o loading
            const loadingText = document.createElement('div');
            loadingText.textContent = 'Carregando mapa...';
            loadingText.style.textAlign = 'center';
            loadingText.style.padding = '20px';
            chartDom.appendChild(loadingText); // Adiciona texto de loading dentro do div do mapa
        }

        const response = await fetch(apiUrl);
        console.log("carregarMapaEstadosVisitados(): Resposta do fetch:", response.status, response.statusText);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const dadosDoBackend = await response.json();
        console.log("carregarMapaEstadosVisitados(): Dados recebidos:", dadosDoBackend);

        // Remove o texto de carregamento se ele foi adicionado por aqui
        if (chartDom && chartDom.querySelector('div[style*="Carregando mapa"]')) {
            chartDom.querySelector('div[style*="Carregando mapa"]').remove();
        }

        // --- Adição da lógica para "Nenhum dado" para o mapa ---
        if (!dadosDoBackend || dadosDoBackend.length === 0 || dadosDoBackend.every(d => d.value === 0)) {
            if (myMapaChart) {
                myMapaChart.destroy(); // Destrói o mapa existente
                myMapaChart = null; // Limpa a referência
            }
            if (chartDom) {
                chartDom.innerHTML = ''; // Limpa qualquer conteúdo antigo
                const noDataText = document.createElement('div');
                noDataText.textContent = "Nenhum dado de visita disponível para o mapa com os filtros selecionados.";
                noDataText.style.textAlign = 'center';
                noDataText.style.padding = '20px';
                chartDom.appendChild(noDataText);
            }
            console.log("carregarMapaEstadosVisitados(): Nenhum dado para exibir no mapa.");
            return; // Sai da função
        }
        // --- Fim da lógica para "Nenhum dado" ---

        const maxValor = Math.max(...dadosDoBackend.map(d => d.value)); // Não precisa de 1 se já verificou que há dados

        if (myMapaChart) {
            myMapaChart.series[0].setData(dadosDoBackend);
            myMapaChart.colorAxis[0].update({ max: maxValor });
            myMapaChart.hideLoading(); // Esconde o loading do Highcharts
        } else {
            if (typeof Highcharts === 'undefined' || typeof Highcharts.mapChart === 'undefined') {
                console.error("Highcharts não está carregado. Verifique a inclusão dos scripts Highcharts no HTML.");
                if (chartDom) chartDom.textContent = "Erro: Highcharts não carregado.";
                return;
            }
            myMapaChart = Highcharts.mapChart('mapaBrasil', {
                chart: { map: 'countries/br/br-all' },
                title: { text: '' },
                colorAxis: {
                    min: 0,
                    max: maxValor,
                    stops: [
                        [0.1, coresUsadas.amareloClaro],
                        [0.5, coresUsadas.amarelo],
                        [0.9, coresUsadas.marrom]
                    ]
                },
                series: [{
                    data: dadosDoBackend,
                    name: 'Turistas estrangeiros',
                    tooltip: { pointFormat: '<b>{point.name}</b><br>Turistas: {point.value}' }
                }]
            });
        }

    } catch (error) {
        console.error("Erro ao carregar o mapa de calor de estados mais visitados:", error);
        const chartDom = document.getElementById('mapaBrasil');
        // Esconde o loading do Highcharts e exibe erro manual
        if (myMapaChart) {
            myMapaChart.series[0].setData([]); // Limpa os dados
            myMapaChart.hideLoading();
            myMapaChart.showLoading('Erro ao carregar mapa.'); // Ou uma mensagem mais genérica
        } else if (chartDom) {
            chartDom.innerHTML = ''; // Limpa qualquer conteúdo de loading ou dados
            const errorText = document.createElement('div');
            errorText.textContent = "Erro ao carregar o mapa. Verifique os logs do console.";
            errorText.style.textAlign = 'center';
            errorText.style.padding = '20px';
            errorText.style.color = 'red';
            chartDom.appendChild(errorText);
        }
    }
}


/**
 * Função para carregar e atualizar o gráfico de "Pico de Visitas - Sazonalidade" (Chart.js).
 */
async function carregarPicoVisitasSazonalidadeChart() {
    console.log("carregarPicoVisitasSazonalidadeChart(): Iniciado.");
    const chartCtxElement = picoVisitasChartCanvas; // Esta é a referência direta ao <canvas>
    const container = picoVisitasChartContainer; // O div pai do canvas (usado para mensagens)
    const noDataMessageDiv = picoVisitasNoDataMessage; // O div para a mensagem de "carregando"

    // Verifica se todos os elementos necessários foram encontrados
    if (!chartCtxElement || !container || !noDataMessageDiv) {
        console.error("Um ou mais elementos de gráfico/mensagem não encontrados no DOM para o gráfico de pico de visitas. Não pode ser inicializado.");
        return;
    }

    const { ano, mes, pais } = getFiltros();
    console.log("carregarPicoVisitasSazonalidadeChart(): Filtros para API:", { ano, mes, pais });

    // --- Lógica de Carregamento e Estado Inicial ---
    // Sempre mostrar o canvas, mas exibir mensagem de "carregando"
    noDataMessageDiv.style.display = 'flex'; // Mostrar o div de mensagem (flex para centralizar)
    noDataMessageDiv.textContent = 'Carregando dados de pico de visitas...'; // Mensagem de carregamento
    chartCtxElement.style.display = 'block'; // Garantir que o canvas está visível

    // Temporariamente limpa o gráfico existente enquanto carrega
    if (myPicoVisitasSazonalidadeChart) {
        // Limpa os dados visuais mantendo o gráfico visível (escalas e linha base)
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
            apiUrl += `?${queryParams.join('&')}`;
        }
        console.log("carregarPicoVisitasSazonalidadeChart(): API URL:", apiUrl);

        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Erro HTTP! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("carregarPicoVisitasSazonalidadeChart(): Dados recebidos da API:", data);

        // Esconde a mensagem de carregamento agora que temos a resposta
        noDataMessageDiv.style.display = 'none';

        let labels = [];
        let valores = [];

        // --- Lógica de "Nenhum Dado" ou "Dados Disponíveis" ---
        if (!data || data.length === 0 || data.every(item => item.chegadas === 0)) {
            // Se não há dados, prepare labels para todos os meses e valores como 0
            // Isso manterá o esqueleto do gráfico visível com uma linha em 0
            labels = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
                      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
            valores = Array(12).fill(0); // Preenche com zero para manter a linha base
            // Opcional: Adicione uma mensagem temporária ou no tooltip customizado
            // noDataMessageDiv.style.display = 'flex';
            // noDataMessageDiv.textContent = "Nenhum dado disponível.";
            // Pode sumir a mensagem após alguns segundos com setTimeout
        } else {
            // Se há dados, usa os dados reais da API
            labels = data.map(item => item.mes_nome);
            valores = data.map(item => item.chegadas);
        }

        // --- Atualização ou Criação do Gráfico ---
        if (myPicoVisitasSazonalidadeChart) {
            // Se o gráfico já existe, apenas atualiza seus dados
            console.log("carregarPicoVisitasSazonalidadeChart(): Atualizando gráfico existente.");
            myPicoVisitasSazonalidadeChart.data.labels = labels;
            myPicoVisitasSazonalidadeChart.data.datasets[0].data = valores;
            myPicoVisitasSazonalidadeChart.update();
        } else {
            // Se o gráfico não existe, cria um novo
            if (typeof Chart === 'undefined') {
                console.error("Chart.js não está carregado. Verifique a inclusão dos scripts Chart.js no HTML.");
                noDataMessageDiv.style.display = 'flex'; // Mostra mensagem de erro
                noDataMessageDiv.textContent = "Erro: Chart.js não carregado.";
                chartCtxElement.style.display = 'none'; // Esconde o canvas
                return;
            }
            console.log("carregarPicoVisitasSazonalidadeChart(): Criando novo gráfico.");
            // Cria a nova instância do Chart.js no elemento canvas
            myPicoVisitasSazonalidadeChart = new Chart(chartCtxElement, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Pico de Chegadas de Turistas',
                        data: valores,
                        borderColor: coresUsadas.amarelo,
                        borderWidth: 2,
                        tension: 0.4,
                        fill: false
                    }]
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
                                label: function(context) {
                                    // Adiciona um tratamento para 0 no tooltip se preferir
                                    if (context.parsed.y === 0 && (valores.every(val => val === 0))) {
                                        return ` Chegadas: Nenhum dado`;
                                    }
                                    return ` Chegadas: ${formatNumber(context.parsed.y)}`;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: { ...estiloDoTextoDoGrafico },
                            grid: { color: 'rgb(0, 0, 0, 0.1)' }
                        },
                        x: {
                            ticks: { ...estiloDoTextoDoGrafico },
                            grid: { color: 'rgb(0, 0, 0, 0.1)' }
                        }
                    }
                }
            });
        }

    } catch (error) {
        console.error("Erro ao carregar gráfico de pico de visitas - sazonalidade:", error);
        // Em caso de erro, exibe a mensagem de erro e garante que o canvas está visível
        noDataMessageDiv.textContent = 'Erro ao carregar gráfico de pico de visitas.';
        noDataMessageDiv.style.display = 'flex'; // Mostra mensagem de erro
        chartCtxElement.style.display = 'block'; // Mantém o canvas visível

        // Se houve um erro, limpa os dados do gráfico existente para exibir "sem dados"
        if (myPicoVisitasSazonalidadeChart) {
            myPicoVisitasSazonalidadeChart.data.labels = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
                                                            "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
            myPicoVisitasSazonalidadeChart.data.datasets[0].data = Array(12).fill(0);
            myPicoVisitasSazonalidadeChart.update();
        }
    }
}


/**
 * Função para carregar TODOS os dados que dependem dos filtros.
 * Chamada na inicialização e ao mudar qualquer filtro.
 */
async function carregarTodosOsDadosDoDashboard(usarCache = false) {
    console.log("carregarTodosOsDadosDoDashboard(): Iniciado.", usarCache ? "Usando cache." : "Usando API.");
    
    if (usarCache) {
        await carregarDadosDoCache();
    } else {
        await carregarKPITotalTuristas();
        await carregarKPIVariacaoTuristas();
        await carregarKPITopEstados();
        await carregarMapaEstadosVisitados();
        await carregarPicoVisitasSazonalidadeChart();
    }
    
    console.log("carregarTodosOsDadosDoDashboard(): Concluído.");
}



// Adiciona Event Listeners aos filtros para recarregar dados do dashboard.
if (selectMes) {
    selectMes.addEventListener('change', () => {
        console.log("Evento 'change' no filtro Mês (id='mes') detectado.");
        carregarTodosOsDadosDoDashboard();
    });
}
if (selectAno) {
    selectAno.addEventListener('change', () => {
        console.log("Evento 'change' no filtro Ano (id='ano') detectado.");
        carregarTodosOsDadosDoDashboard();
    });
}
if (selectPais) {
    selectPais.addEventListener('change', () => {
        console.log("Evento 'change' no filtro País (id='pais') detectado.");
        carregarTodosOsDadosDoDashboard();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("Evento 'DOMContentLoaded' disparado. Carregando dados do cache primeiro.");
    carregarTodosOsDadosDoDashboard(true); // true = usar cache na inicialização
});