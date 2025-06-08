// index.js

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

const selectMes = document.getElementById('mes');
const selectAno = document.getElementById('ano');
const selectPais = document.getElementById('pais');

// variaveis para as instancias dos graficos
let myChartInstance;
let presencaTuristaChartInstance;
let chegadasTuristasChartInstance;

// func para ordenar os dados de um grafico de barras
function sortChartData(chartId, order) {
    let chartInstance;
    switch (chartId) {
        case 'myChart':
            chartInstance = myChartInstance;
            break;
        case 'presencaTuristaChart':
            chartInstance = presencaTuristaChartInstance;
            break;
        default:
            return;
    }

    if (!chartInstance) return;

    const labels = [...chartInstance.data.labels];
    const dataValues = [...chartInstance.data.datasets[0].data];

    // combinando labels e dados
    const combined = labels.map((label, index) => ({
        label: label,
        data: dataValues[index]
    }));

    // ordena
    if (order === 'asc') {
        combined.sort((a, b) => a.data - b.data);
    } else {
        combined.sort((a, b) => b.data - a.data);
    }

    // atualiza o grafico
    chartInstance.data.labels = combined.map(item => item.label);
    chartInstance.data.datasets[0].data = combined.map(item => item.data);
    chartInstance.update();
}

// event listeners pross botoes de ordenaçao
document.addEventListener('click', function (e) {
    if (e.target && e.target.classList.contains('sort-btn')) {
        const chartId = e.target.dataset.chart;
        const order = e.target.dataset.order;
        sortChartData(chartId, order);
    }
});

async function carregarDadosDashboardPrincipal() {
    const mes = selectMes ? selectMes.value : '';
    const ano = selectAno ? selectAno.value : '';
    const pais = selectPais ? selectPais.value : '';

    const queryParams = new URLSearchParams();
    if (mes) queryParams.append('mes', mes);
    if (ano) queryParams.append('ano', ano);
    if (pais) queryParams.append('pais', pais);

    const queryString = queryParams.toString();
    const basePath = '/grafico';

    // 1. Gráfico PRINCIPAIS PAÍSES DE ORIGEM
    try {
        const res = await fetch(`${basePath}/paises-origem?${queryString}`);
        const data = await res.json();

        // Ordenar os dados em ordem decrescente por padrão
        const sortedData = [...data].sort((a, b) => b.percentual - a.percentual);
        const labels = sortedData.map(item => item.pais);
        const valores = sortedData.map(item => item.percentual);
        const ctx = document.getElementById('myChart');

        if (myChartInstance) {
            myChartInstance.data.labels = labels;
            myChartInstance.data.datasets[0].data = valores;
            myChartInstance.update();
        } else {
            myChartInstance = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        data: valores,
                        backgroundColor: [
                            coresUsadas.amarelo, coresUsadas.marromBeige, coresUsadas.marrom,
                            coresUsadas.amareloClaro, coresUsadas.begeMedio
                        ],
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
                                label: function (context) {
                                    return ` ${context.parsed.y}%`;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            ticks: {
                                ...estiloDoTextoDoGrafico,
                                autoSkip: false,
                                maxRotation: 0,
                                minRotation: 0
                            }
                        },
                        y: {
                            beginAtZero: true,
                            ticks: estiloDoTextoDoGrafico
                        }
                    }
                }
            });
        }
    } catch (err) {
        console.error('Erro ao buscar dados dos principais países de origem:', err);
    }

    // 2. Gráfico PRESENÇA DE TURISTAS POR UF
    try {
        const res = await fetch(`${basePath}/presenca-uf?${queryString}`);
        const data = await res.json();

        // Ordenar os dados em ordem decrescente por padrão
        const sortedData = [...data].sort((a, b) => b.quantidade - a.quantidade);
        const labels = sortedData.map(item => item.uf);
        const valores = sortedData.map(item => item.quantidade);
        const ctx = document.getElementById('presencaTuristaChart');

        if (presencaTuristaChartInstance) {
            presencaTuristaChartInstance.data.labels = labels;
            presencaTuristaChartInstance.data.datasets[0].data = valores;
            presencaTuristaChartInstance.update();
        } else {
            presencaTuristaChartInstance = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        data: valores,
                        backgroundColor: [
                            coresUsadas.amarelo, coresUsadas.marromBeige, coresUsadas.marrom,
                            coresUsadas.amareloClaro, coresUsadas.begeMedio
                        ],
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
                                label: function (context) {
                                    return ` ${context.parsed.y} turistas`;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            ticks: {
                                ...estiloDoTextoDoGrafico,
                                maxRotation: 0,
                                minRotation: 0
                            }
                        },
                        y: {
                            beginAtZero: true,
                            ticks: estiloDoTextoDoGrafico
                        }
                    }
                }
            });
        }
    } catch (err) {
        console.error('Erro ao buscar dados de presença de turistas por UF:', err);
    }

    // 3. Gráfico de CHEGADAS
    try {
        const res = await fetch(`${basePath}/chegadas?${queryString}`);
        const data = await res.json();

        const labels = data.map(item => item.mes_nome);
        const valores = data.map(item => item.chegadas);
        const ctx = document.getElementById('chegadasTuristasChart');

        if (chegadasTuristasChartInstance) {
            chegadasTuristasChartInstance.data.labels = labels;
            chegadasTuristasChartInstance.data.datasets[0].data = valores;
            chegadasTuristasChartInstance.update();
        } else {
            chegadasTuristasChartInstance = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
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
                            bodyFont: estiloDoTextoDoGrafico.font
                        }
                    },
                    scales: {
                        x: {
                            ticks: {
                                ...estiloDoTextoDoGrafico,
                                maxRotation: 0,
                                minRotation: 0
                            }
                        },
                        y: {
                            beginAtZero: true,
                            ticks: estiloDoTextoDoGrafico
                        }
                    }
                }
            });
        }
    } catch (err) {
        console.error('Erro ao buscar dados de chegadas de turistas:', err);
    }

    // 4. KPIs de Chegadas Comparativas
    try {
        const res = await fetch(`${basePath}/chegadas-comparativas?${queryString}`);
        if (!res.ok) {
            throw new Error(`Erro HTTP: ${res.status}`);
        }
        const data = await res.json();

        document.getElementById('kpiChegadasAnoAnterior').textContent = data.chegadasAnoAnterior;
        document.getElementById('labelAnoAnterior').textContent = `em ${data.anoAnterior}`;
        document.getElementById('kpiChegadasAnoAtual').textContent = data.chegadasAnoAtual;
        document.getElementById('labelAnoAtual').textContent = `em ${data.anoAtual}`;
        document.getElementById('kpiPorcentagemComparativa').textContent = data.porcentagemComparativa;

    } catch (err) {
        console.error('Erro ao buscar KPIs de chegadas comparativas:', err);
        document.getElementById('kpiChegadasAnoAnterior').textContent = 'N/A';
        document.getElementById('labelAnoAnterior').textContent = 'em ---';
        document.getElementById('kpiChegadasAnoAtual').textContent = 'N/A';
        document.getElementById('labelAnoAtual').textContent = 'em ---';
        document.getElementById('kpiPorcentagemComparativa').textContent = 'N/A';
    }
}

// Event listeners para os filtros
if (selectMes) selectMes.addEventListener('change', carregarDadosDashboardPrincipal);
if (selectAno) selectAno.addEventListener('change', carregarDadosDashboardPrincipal);
if (selectPais) selectPais.addEventListener('change', carregarDadosDashboardPrincipal);

// Inicialização
document.addEventListener('DOMContentLoaded', carregarDadosDashboardPrincipal);