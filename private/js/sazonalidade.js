// public/js/sazonalidade.js

// Variável global para a instância do Highcharts MapChart.
let myMapaChart;

// Inicialização do gráfico de linha (Chart.js) com dados estáticos.
const picoCtx = document.getElementById('picoVisitasChart');
new Chart(picoCtx, {
    type: 'line',
    data: {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        datasets: [{
            labels: false,
            data: [35000, 25000, 50000, 50000, 0, 80000, 35000, 70000, 51000, 20000, 20000, 53000],
            borderColor: '#F8CA26',
            fill: true,
            backgroundColor: '#CA9E00'
        }]
    },
    options: {
        plugins: {
            legend: { display: false },
            tooltip: {
                bodyFont: { family: "'Anybody', sans-serif", size: 12, weight: '400' },
                titleFont: { family: "'Anybody', sans-serif", size: 12, weight: '400' }
            }
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                ticks: { color: '#000000', font: { family: "'Anybody', sans-serif", size: 12, weight: '400' } },
                grid: { color: 'rgb(0, 0, 0)' }
            },
            x: {
                ticks: { color: '#000000', font: { family: "'Anybody', sans-serif", size: 12, weight: '400' } },
                grid: { color: 'rgb(0, 0, 0)' }
            }
        }
    }
});


// Referências dos elementos de filtro (usados pelo mapa e KPI Top 3).
const selectMes = document.getElementById('filtroMesSazonalidade');
const selectAno = document.getElementById('filtroAnoSazonalidade');
const selectPais = document.getElementById('filtroPaisSazonalidade');

// Referências dos elementos de KPI (SPANs para os estados TOP 3).
const estadoVisitado1 = document.getElementById('estadoVisitado1');
const estadoVisitado2 = document.getElementById('estadoVisitado2');
const estadoVisitado3 = document.getElementById('estadoVisitado3');


/**
 * Obtém os valores selecionados nos filtros.
 */
function getFiltros() {
    return {
        mes: selectMes ? selectMes.value : '',
        ano: selectAno ? selectAno.value : '',
        pais: selectPais ? selectPais.value : ''
    };
}


/**
 * Carrega e atualiza a KPI "TOP 3 Estados Mais Visitados" via API.
 */
async function carregarKPITopEstados() {
    const { mes, ano, pais } = getFiltros();
    const params = new URLSearchParams();
    if (mes) params.append('mes', mes);
    if (ano) params.append('ano', ano);
    if (pais) params.append('pais', pais);
    const queryString = params.toString();

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
 * Carrega e atualiza o mapa de calor dos estados visitados (Highcharts) via API.
 * Modificada para ser dinâmica com filtros.
 */
async function carregarMapaEstadosVisitados() {
    const { mes, ano, pais } = getFiltros();
    let apiUrl = `/grafico/visitas-por-estado`; // Rota da API para dados do mapa.
    const queryParams = [];

    if (mes) queryParams.push(`mes=${mes}`);
    if (ano) queryParams.push(`ano=${ano}`);
    if (pais) queryParams.push(`pais=${pais}`);
    if (queryParams.length > 0) apiUrl += `?${queryParams.join('&')}`;

    try {
        const chartDom = document.getElementById('mapaBrasil');

        if (myMapaChart) {
            myMapaChart.showLoading('Carregando mapa...');
        } else if (chartDom) {
            chartDom.textContent = 'Carregando mapa...';
        }

        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const dadosDoBackend = await response.json();

        const maxValor = dadosDoBackend.length > 0 ? Math.max(...dadosDoBackend.map(d => d.value)) : 1;

        if (myMapaChart) {
            myMapaChart.series[0].setData(dadosDoBackend);
            myMapaChart.colorAxis[0].update({ max: maxValor });
            myMapaChart.hideLoading();
        } else {
            myMapaChart = Highcharts.mapChart('mapaBrasil', {
                chart: { map: 'countries/br/br-all' },
                title: { text: '' },
                colorAxis: {
                    min: 0,
                    max: maxValor,
                    stops: [
                        [0.1, '#FFD645'],
                        [0.5, '#F8CA26'],
                        [0.9, '#BA9100']
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
        if (myMapaChart) {
            myMapaChart.series[0].setData([]);
            myMapaChart.hideLoading();
            myMapaChart.showLoading('Erro ao carregar mapa.');
        } else {
            const chartDom = document.getElementById('mapaBrasil');
            if (chartDom) chartDom.textContent = "Erro ao carregar o mapa.";
        }
    }
}


/**
 * Carrega todos os dados do dashboard que dependem dos filtros (KPIs e Mapa).
 */
async function carregarTodosOsDadosDoDashboard() {
    await carregarKPITopEstados();
    await carregarMapaEstadosVisitados();
}


// Adiciona Event Listeners aos filtros para recarregar dados do dashboard.
if (selectMes) selectMes.addEventListener('change', carregarTodosOsDadosDoDashboard);
if (selectAno) selectAno.addEventListener('change', carregarTodosOsDadosDoDashboard);
if (selectPais) selectPais.addEventListener('change', carregarTodosOsDadosDoDashboard);


// Chamada inicial ao carregar a página para popular os dados.
document.addEventListener('DOMContentLoaded', carregarTodosOsDadosDoDashboard);