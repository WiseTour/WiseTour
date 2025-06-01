// index.js

const coresUsadas = {
    amarelo: '#F8CA26',
    marrom: '#735900',
    marromBeige: '#C49F1B', // Renomeado para consistência
    amareloClaro: '#FFE483',
    avermelhado: '#A66D44',
    cimento: '#87826E',
    acinzentado: '#DDD8C5',
    cinza: '#E0E0E0',
    marromForte: '#A98400',
    esverdeado: '#6B8E23',
    begeMedio: '#D9C7A7' // Adicionado para consistência com o uso no gráfico
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
const selectPais = document.getElementById('pais'); // Este filtro de país afetaria os gráficos de países de origem e presença por UF

// Variáveis para armazenar as instâncias dos gráficos
let myChartInstance; // Para o gráfico de Principais Países de Origem
let presencaTuristaChartInstance; // Para o gráfico de Presença de Turistas por UF
let chegadasTuristasChartInstance; // Para o gráfico de Chegadas

// Função assíncrona para carregar e atualizar todos os dados da dashboard principal
async function carregarDadosDashboardPrincipal() {
    const mes = selectMes ? selectMes.value : '';
    const ano = selectAno ? selectAno.value : '';
    const pais = selectPais ? selectPais.value : '';

    const queryParams = new URLSearchParams();
    if (mes) queryParams.append('mes', mes);
    if (ano) queryParams.append('ano', ano);
    if (pais) queryParams.append('pais', pais);

    const queryString = queryParams.toString();
    const basePath = '/grafico'; // Base path para suas APIs

    // ----------------------------------------------------
    // 1. Gráfico PRINCIPAIS PAÍSES DE ORIGEM
    // Rota esperada no backend: /grafico/paises-origem
    // Exemplo de retorno: [{ pais: 'Argentina', percentual: 20 }, ...]
    // ----------------------------------------------------
    try {
        const res = await fetch(`${basePath}/paises-origem?${queryString}`); // Supondo esta rota
        const data = await res.json();

        const labels = data.map(item => item.pais);
        const valores = data.map(item => item.percentual);
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
        // Opcional: Mostrar uma mensagem de erro ou dados padrão
    }


    // ----------------------------------------------------
    // 2. Gráfico PRESENÇA DE TURISTAS POR UF
    // Rota esperada no backend: /grafico/presenca-uf
    // Exemplo de retorno: [{ uf: 'SP', quantidade: 5000 }, ...]
    // ----------------------------------------------------
    try {
        const res = await fetch(`${basePath}/presenca-uf?${queryString}`); // Supondo esta rota
        const data = await res.json();

        const labels = data.map(item => item.uf);
        const valores = data.map(item => item.quantidade);
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
        // Opcional: Mostrar uma mensagem de erro ou dados padrão
    }

    // ----------------------------------------------------
    // 3. Gráfico de CHEGADAS
    // Rota esperada no backend: /grafico/chegadas (anteriormente /grafico/dados)
    // Exemplo de retorno: [{ mes_nome: 'Janeiro', chegadas: 1000 }, ...]
    // ----------------------------------------------------
    try {
        const res = await fetch(`${basePath}/chegadas?${queryString}`); // Supondo esta rota
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
        // Opcional: Mostrar uma mensagem de erro ou dados padrão
    }

    try {
    const res = await fetch(`${basePath}/chegadas-comparativas?${queryString}`); // Nova rota
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.erro || `Erro HTTP: ${res.status}`);
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

// Adiciona os event listeners aos selects para chamar a função de carregamento quando o filtro mudar
if (selectMes) selectMes.addEventListener('change', carregarDadosDashboardPrincipal);
if (selectAno) selectAno.addEventListener('change', carregarDadosDashboardPrincipal);
if (selectPais) selectPais.addEventListener('change', carregarDadosDashboardPrincipal);

// Chama a função uma vez ao carregar a página para exibir os dados iniciais
document.addEventListener('DOMContentLoaded', carregarDadosDashboardPrincipal);

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
