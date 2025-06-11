// perfilturista.js

// Definição de cores padronizadas para os gráficos.
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
    esverdeado: '#6B8E23'
};

// Opções padrão para os gráficos Chart.js.
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

// Estilo de texto padrão para ticks e legendas dos gráficos.
const estiloDoTextoDoGrafico = {
    color: '#000000',
    font: {
        weight: '500',
        family: "'Anybody', sans-serif",
        size: 12
    }
};

// Referências aos elementos de filtro no HTML.
const selectMes = document.getElementById('mes');
const selectAno = document.getElementById('ano');
const selectPais = document.getElementById('pais');

// Variáveis para armazenar as instâncias dos gráficos Chart.js para atualização.
let graficoMotivosInstance;
let graficoFontesInstance;
let graficoComposicaoInstance;
let graficoViasInstance;

/**
 * Carrega e atualiza todas as KPIs e gráficos da dashboard com base nos filtros.
 */
async function carregarDadosDashboard() {
    console.log('carregarDadosDashboard: Função iniciada.');

    // Coleta os valores dos filtros.
    const mes = selectMes ? selectMes.value : '';
    const ano = selectAno ? selectAno.value : '';
    const pais = selectPais ? selectPais.value : '';

    // Constrói a query string com os filtros.
    const queryParams = new URLSearchParams();
    if (mes) queryParams.append('mes', mes);
    if (ano) queryParams.append('ano', ano);
    if (pais) queryParams.append('pais', pais);
    const queryString = queryParams.toString();
    const basePath = '/grafico'; // Caminho base para as APIs do backend.

    // KPI: Gênero Mais Recorrente
    try {
        const res = await fetch(`${basePath}/genero?${queryString}`);
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.erro || `Erro HTTP: ${res.status}`);
        }
        const data = await res.json();
        document.getElementById('kpiGenero').textContent = data.genero || 'N/A';
    } catch (err) {
        console.error('Erro ao buscar o gênero mais recorrente:', err);
        document.getElementById('kpiGenero').textContent = 'Erro';
    }

    // KPI: Gasto Médio
    try {
        const res = await fetch(`${basePath}/gasto-medio?${queryString}`);
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.erro || `Erro HTTP: ${res.status}`);
        }
        const data = await res.json();
        document.getElementById('kpiGastoMedio').textContent = data.gastoMedio || 'N/A';
    } catch (err) {
        console.error('Erro ao buscar o gasto médio:', err);
        document.getElementById('kpiGastoMedio').textContent = 'Erro';
    }

    // KPI: Faixa Etária Mais Recorrente
    try {
        const res = await fetch(`${basePath}/faixa_etaria?${queryString}`);
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.mensagem || `Erro HTTP: ${res.status}`);
        }
        const data = await res.json();
        document.getElementById('kpiFaixaEtaria').textContent = data.faixa_etaria || 'N/A';
    } catch (err) {
        console.error('Erro ao buscar a faixa etária mais recorrente:', err);
        document.getElementById('kpiFaixaEtaria').textContent = 'Erro';
    }

    // Gráfico: Motivos das Viagens Realizadas (Barra horizontal)
    try {
        const res = await fetch(`${basePath}/motivo?${queryString}`);
        const data = await res.json();

        // Ordenar inicialmente de forma decrescente
        const sortedData = [...data].sort((a, b) => b.percentual - a.percentual);
        const labels = sortedData.map(item => item.motivo);
        const valores = sortedData.map(item => item.percentual);
        const ctxMotivos = document.getElementById('graficoMotivos');

        if (graficoMotivosInstance) {
            graficoMotivosInstance.data.labels = labels;
            graficoMotivosInstance.data.datasets[0].data = valores;
            graficoMotivosInstance.update();
        } else {
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

    // Gráfico: Fontes de Informação (Barra vertical)
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

    // Gráfico: Composição do Grupo Turístico (Pizza)
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

    // Gráfico: Vias de Acesso (Pizza)
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

/**
 * Carrega e atualiza a dashboard com dados do cache (último período consultado).
 * Utiliza diretamente os dados do cache sem fazer novas consultas ao banco.
 */
async function carregarDadosDoCache() {
    console.log('carregarDadosDoCache: Função iniciada.');

    try {
        // Busca os dados do cache
        const cacheRes = await fetch('/api/cache-data'); // ou '/api/status-cache' se usar a Solução 1
        if (!cacheRes.ok) {
            throw new Error(`Erro ao buscar dados do cache: ${cacheRes.status}`);
        }
        
        const cacheData = await cacheRes.json();
        console.log('Dados do cache:', cacheData);
        
        // Verifica se há dados em cache disponíveis
        if (!cacheData.ultimoPeriodo || (!cacheData.ultimoPeriodo.mes && !cacheData.ultimoPeriodo.ano)) {
            console.warn('Nenhum dado em cache disponível. Carregando dados normalmente...');
            await carregarDadosDashboard();
            return;
        }

        const { ultimoPeriodo } = cacheData;
        console.log('Dados do último período:', ultimoPeriodo);
        
        // Atualiza os filtros com os valores do último período em cache
        if (selectMes && ultimoPeriodo.mes) {
            selectMes.value = ultimoPeriodo.mes.toString();
        }
        if (selectAno && ultimoPeriodo.ano) {
            selectAno.value = ultimoPeriodo.ano.toString();
        }

        // Carrega KPIs diretamente do cache
        if (ultimoPeriodo.genero) {
            document.getElementById('kpiGenero').textContent = ultimoPeriodo.genero.genero || 'N/A';
        } else {
            document.getElementById('kpiGenero').textContent = 'N/A';
        }

        if (ultimoPeriodo.gastoMedio) {
            document.getElementById('kpiGastoMedio').textContent = ultimoPeriodo.gastoMedio.gastoMedio || 'N/A';
        } else {
            document.getElementById('kpiGastoMedio').textContent = 'N/A';
        }

        if (ultimoPeriodo.faixaEtaria) {
            document.getElementById('kpiFaixaEtaria').textContent = ultimoPeriodo.faixaEtaria.faixa_etaria || 'N/A';
        } else {
            document.getElementById('kpiFaixaEtaria').textContent = 'N/A';
        }

        // Carrega gráfico de Motivos do cache
        if (ultimoPeriodo.motivos && Array.isArray(ultimoPeriodo.motivos)) {
            const labels = ultimoPeriodo.motivos.map(item => item.motivo);
            const valores = ultimoPeriodo.motivos.map(item => item.percentual);
            const ctxMotivos = document.getElementById('graficoMotivos');

            if (graficoMotivosInstance) {
                graficoMotivosInstance.data.labels = labels;
                graficoMotivosInstance.data.datasets[0].data = valores;
                graficoMotivosInstance.update();
            } else {
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
                        plugins: { legend: { display: false } },
                        scales: {
                            x: {
                                beginAtZero: true,
                                grid: { display: false },
                                ticks: { ...estiloDoTextoDoGrafico, font: { ...estiloDoTextoDoGrafico.font, size: 15 } }
                            },
                            y: {
                                grid: { display: false },
                                ticks: { ...estiloDoTextoDoGrafico, font: { ...estiloDoTextoDoGrafico.font, size: 15 } }
                            }
                        }
                    }
                });
            }
        }

        // Carrega gráfico de Fontes do cache
        if (ultimoPeriodo.fontes && Array.isArray(ultimoPeriodo.fontes)) {
            const labels = ultimoPeriodo.fontes.map(item => item.fonte);
            const valores = ultimoPeriodo.fontes.map(item => item.percentual);
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
                        plugins: { legend: { display: false } },
                        scales: {
                            y: {
                                beginAtZero: true,
                                grid: { display: false },
                                ticks: { ...estiloDoTextoDoGrafico, callback: function (value) { return value + '%'; } }
                            },
                            x: {
                                grid: { display: false },
                                ticks: { ...estiloDoTextoDoGrafico, font: { ...estiloDoTextoDoGrafico.font, size: 9 }, maxRotation: 0, minRotation: 0 }
                            }
                        }
                    }
                });
            }
        }

        // Carrega gráfico de Composição do cache
        if (ultimoPeriodo.composicao && Array.isArray(ultimoPeriodo.composicao)) {
            const labels = ultimoPeriodo.composicao.map(item => item.composicao);
            const valores = ultimoPeriodo.composicao.map(item => item.percentual);
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
        }

        // Carrega gráfico de Vias do cache
        if (ultimoPeriodo.vias && Array.isArray(ultimoPeriodo.vias)) {
            const labels = ultimoPeriodo.vias.map(item => item.vias);
            const valores = ultimoPeriodo.vias.map(item => item.percentual);
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
        }

        console.log('Dashboard carregada com dados do cache com sucesso.');

    } catch (err) {
        console.error('Erro ao carregar dados do cache:', err);
        console.log('Fallback: Carregando dados normalmente...');
        await carregarDadosDashboard();
    }
}

// Adiciona event listeners aos filtros para recarregar a dashboard ao mudar.
document.getElementById("funil").addEventListener("click", carregarDadosDashboard)

// Chama a função de carregamento ao carregar a página.
// Prioriza o carregamento do cache para melhor performance inicial
document.addEventListener('DOMContentLoaded', () => {
    // Verifica se deve carregar do cache ou fazer consulta normal
    const urlParams = new URLSearchParams(window.location.search);
    const forceRefresh = urlParams.get('refresh') === 'true';
    if (forceRefresh) {
        carregarDadosDashboard();
    } else {
        carregarDadosDoCache();
    }
});

console.log('perfilturista.js: Script carregado.');