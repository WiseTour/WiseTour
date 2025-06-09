const coresUsadas = {
    amarelo: '#F8CA26',
    marrom: '#735900',
    marromBege: '#C49F1B',
    amareloClaro: '#FFE483',
    avermelhado: '#A66D44',
    cimento: '#87826E',
    acinzentado: '#DDD8C5',
    cinza: '#E0E0E0',
    marromForte: '#A98400',
    esverdeado: '#6B8E23' // Adicionado 'esverdeado' para consistência
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

// Referências aos elementos de filtro (certifique-se de que esses IDs existem no seu HTML)
const selectMes = document.getElementById('mes');
const selectAno = document.getElementById('ano');
const selectPais = document.getElementById('pais');

// Variáveis para armazenar as instâncias dos gráficos (importante para atualização)
let graficoMotivosInstance;
let graficoFontesInstance;
let graficoComposicaoInstance;
let graficoViasInstance;

// Função para ordenar os dados de gráficos de barra
function sortChartData(chartId, order) {
    let chartInstance;
    switch (chartId) {
        case 'graficoMotivos':
            chartInstance = graficoMotivosInstance;
            break;
        case 'graficoFontes':
            chartInstance = graficoFontesInstance;
            break;
        default:
            return;
    }

    if (!chartInstance) return;

    const labels = [...chartInstance.data.labels];
    const dataValues = [...chartInstance.data.datasets[0].data];
    
    // Combinar labels e dados
    const combined = labels.map((label, index) => ({
        label: label,
        data: dataValues[index]
    }));

    // Ordenar
    if (order === 'asc') {
        combined.sort((a, b) => a.data - b.data);
    } else {
        combined.sort((a, b) => b.data - a.data);
    }

    // Atualizar gráfico
    chartInstance.data.labels = combined.map(item => item.label);
    chartInstance.data.datasets[0].data = combined.map(item => item.data);
    chartInstance.update();
}

// Event listeners para botões de ordenação
document.addEventListener('click', function (e) {
    if (e.target && e.target.classList.contains('sort-btn')) {
        const chartId = e.target.dataset.chart;
        const order = e.target.dataset.order;
        sortChartData(chartId, order);
    }
});

// Função assíncrona para carregar e atualizar todos os dados da dashboard
async function carregarDadosDashboard() {
    console.log('carregarDadosDashboard: Função iniciada.');
    const mes = selectMes ? selectMes.value : ''; // Verifica se o elemento existe
    const ano = selectAno ? selectAno.value : '';
    const pais = selectPais ? selectPais.value : '';

    // Constrói a string de query com os filtros presentes
    const queryParams = new URLSearchParams();
    if (mes) queryParams.append('mes', mes);
    if (ano) queryParams.append('ano', ano);
    if (pais) queryParams.append('pais', pais);

    const queryString = queryParams.toString();
    const basePath = '/grafico'; // Base path para suas APIs

    // ----------------------------------------------------
    // KPI: Gênero Mais Recorrente
    // ----------------------------------------------------
    try {
        const res = await fetch(`${basePath}/genero?${queryString}`);
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.erro || `Erro HTTP: ${res.status}`);
        }
        const data = await res.json();
        const kpiGeneroElement = document.getElementById('kpiGenero');
        kpiGeneroElement.textContent = data.genero || 'N/A';
    } catch (err) {
        console.error('Erro ao buscar o gênero mais recorrente:', err);
        document.getElementById('kpiGenero').textContent = 'Erro';
    }

    // ----------------------------------------------------
    // KPI: Gasto Médio
    // ----------------------------------------------------
    try {
        const res = await fetch(`${basePath}/gasto-medio?${queryString}`);
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.erro || `Erro HTTP: ${res.status}`);
        }
        const data = await res.json();
        const kpiGastoMedioElement = document.getElementById('kpiGastoMedio');
        kpiGastoMedioElement.textContent = data.gastoMedio || 'N/A';
    } catch (err) {
        console.error('Erro ao buscar o gasto médio:', err);
        document.getElementById('kpiGastoMedio').textContent = 'Erro';
    }

    // ----------------------------------------------------
    // KPI: Faixa Etária Mais Recorrente
    // ----------------------------------------------------
    try {
        const res = await fetch(`${basePath}/faixa_etaria?${queryString}`);
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.mensagem || `Erro HTTP: ${res.status}`);
        }
        const data = await res.json();
        const kpiFaixaEtariaElement = document.getElementById('kpiFaixaEtaria'); // Certifique-se de ter um elemento com este ID
        kpiFaixaEtariaElement.textContent = data.faixa_etaria || 'N/A';
    } catch (err) {
        console.error('Erro ao buscar a faixa etária mais recorrente:', err);
        document.getElementById('kpiFaixaEtaria').textContent = 'Erro';
    }

    // ----------------------------------------------------
    // Gráfico: Motivos das Viagens Realizadas
    // ----------------------------------------------------
    try {
        const res = await fetch(`${basePath}/motivo?${queryString}`);
        const data = await res.json();

        // Ordenar inicialmente de forma decrescente
        const sortedData = [...data].sort((a, b) => b.percentual - a.percentual);
        const labels = sortedData.map(item => item.motivo);
        const valores = sortedData.map(item => item.percentual);
        const ctxMotivos = document.getElementById('graficoMotivos');

        if (graficoMotivosInstance) {
            // Se o gráfico já existe, apenas atualiza os dados
            graficoMotivosInstance.data.labels = labels;
            graficoMotivosInstance.data.datasets[0].data = valores;
            graficoMotivosInstance.update();
        } else {
            // Se o gráfico não existe, cria uma nova instância
            graficoMotivosInstance = new Chart(ctxMotivos, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Motivos',
                        data: valores,
                        backgroundColor: [coresUsadas.amarelo, coresUsadas.marrom, coresUsadas.marromBege],
                        borderWidth: 0
                    }]
                },
                options: {
                    ...opcoesPadrao,
                    indexAxis: 'y',
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return `${context.parsed.x}%`;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            beginAtZero: true,
                            grid: { display: false },
                            ticks: { 
                                ...estiloDoTextoDoGrafico, 
                                font: { 
                                    ...estiloDoTextoDoGrafico.font, 
                                    size: 15 
                                },
                                callback: function(value) {
                                    return value + '%';
                                }
                            }
                        },
                        y: {
                            grid: { display: false },
                            ticks: { 
                                ...estiloDoTextoDoGrafico, 
                                font: { 
                                    ...estiloDoTextoDoGrafico.font, 
                                    size: 15 
                                } 
                            }
                        }
                    }
                }
            });
        }
    } catch (err) {
        console.error('Erro ao buscar dados dos motivos de viagem:', err);
    }

    // ----------------------------------------------------
    // Gráfico: Fontes de Informação
    // ----------------------------------------------------
    try {
        const res = await fetch(`${basePath}/fontes?${queryString}`);
        const data = await res.json();

        // Ordenar inicialmente de forma decrescente
        const sortedData = [...data].sort((a, b) => b.percentual - a.percentual);
        const labels = sortedData.map(item => item.fonte);
        const valores = sortedData.map(item => item.percentual);
        const ctxFontes = document.getElementById('graficoFontes');

        if (graficoFontesInstance) {
            graficoFontesInstance.data.labels = labels;
            graficoFontesInstance.data.datasets[0].data = valores;
            graficoFontesInstance.update();
        } else {
            graficoFontesInstance = new Chart(ctxFontes, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Fontes',
                        data: valores,
                        backgroundColor: [
                            coresUsadas.amarelo, coresUsadas.marrom, coresUsadas.marromBege,
                            coresUsadas.amareloClaro, coresUsadas.marromForte, coresUsadas.esverdeado,
                            coresUsadas.acinzentado, coresUsadas.cinza, '#D9C7A7'
                        ],
                        borderWidth: 0
                    }]
                },
                options: {
                    ...opcoesPadrao,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return `${context.parsed.y}%`;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: { display: false },
                            ticks: { 
                                ...estiloDoTextoDoGrafico, 
                                callback: function (value) { 
                                    return value + '%'; 
                                } 
                            }
                        },
                        x: {
                            grid: { display: false },
                            ticks: { 
                                ...estiloDoTextoDoGrafico, 
                                font: { 
                                    ...estiloDoTextoDoGrafico.font, 
                                    size: 9 
                                }, 
                                maxRotation: 0, 
                                minRotation: 0 
                            }
                        }
                    }
                }
            });
        }
    } catch (err) {
        console.error('Erro ao buscar dados das fontes de informação:', err);
    }

    // ----------------------------------------------------
    // Gráfico: Composição do Grupo Turístico
    // ----------------------------------------------------
    try {
        const res = await fetch(`${basePath}/composicao?${queryString}`);
        const data = await res.json();

        const labels = data.map(item => item.composicao);
        const valores = data.map(item => item.percentual);
        const ctxComposicao = document.getElementById('graficoComposicao');

        if (graficoComposicaoInstance) {
            graficoComposicaoInstance.data.labels = labels;
            graficoComposicaoInstance.data.datasets[0].data = valores;
            graficoComposicaoInstance.update();
        } else {
            graficoComposicaoInstance = new Chart(ctxComposicao, {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [{
                        data: valores,
                        backgroundColor: [
                            coresUsadas.amarelo, coresUsadas.marrom, coresUsadas.marromBege,
                            coresUsadas.amareloClaro
                        ],
                        borderWidth: 0
                    }]
                },
                options: {
                    ...opcoesPadrao,
                    plugins: {
                        legend: {
                            position: 'right',
                            labels: {
                                ...estiloDoTextoDoGrafico,
                                boxWidth: 35, boxHeight: 14, borderRadius: 50, padding: 5,
                                font: { ...estiloDoTextoDoGrafico.font, size: 14 }
                            }
                        }
                    }
                }
            });
        }
    } catch (err) {
        console.error('Erro ao buscar dados da composição:', err);
    }

    // ----------------------------------------------------
    // Gráfico: Vias de Acesso
    // ----------------------------------------------------
    try {
        const res = await fetch(`${basePath}/vias?${queryString}`);
        const data = await res.json();

        const labels = data.map(item => item.vias);
        const valores = data.map(item => item.percentual);
        const ctxVias = document.getElementById('graficoVias');

        if (graficoViasInstance) {
            graficoViasInstance.data.labels = labels;
            graficoViasInstance.data.datasets[0].data = valores;
            graficoViasInstance.update();
        } else {
            graficoViasInstance = new Chart(ctxVias, {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [{
                        data: valores,
                        backgroundColor: [
                            coresUsadas.avermelhado, coresUsadas.cimento, coresUsadas.acinzentado,
                            coresUsadas.cinza
                        ],
                        borderWidth: 0
                    }]
                },
                options: {
                    ...opcoesPadrao,
                    plugins: {
                        legend: {
                            position: 'right',
                            labels: {
                                ...estiloDoTextoDoGrafico,
                                boxWidth: 35, boxHeight: 14, borderRadius: 50, padding: 5,
                                font: { ...estiloDoTextoDoGrafico.font, size: 14 }
                            }
                        }
                    }
                }
            });
        }
    } catch (err) {
        console.error('Erro ao buscar dados das vias:', err);
    }
}

// Adiciona os event listeners aos selects para chamar a função de carregamento quando o filtro mudar
// Verifica se os elementos existem antes de adicionar o listener
if (selectMes) selectMes.addEventListener('change', carregarDadosDashboard);
if (selectAno) selectAno.addEventListener('change', carregarDadosDashboard);
if (selectPais) selectPais.addEventListener('change', carregarDadosDashboard);

// Chama a função uma vez ao carregar a página para exibir os dados iniciais
document.addEventListener('DOMContentLoaded', carregarDadosDashboard);
console.log('perfilturista.js: Script carregado e listener DOMContentLoaded adicionado.');

function atualizarDataHora() {
    const agora = new Date();

    const data = agora.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    const hora = agora.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    document.getElementById('dataHora').textContent = `${data} - ${hora}`;
}

atualizarDataHora();
setInterval(atualizarDataHora, 1000);