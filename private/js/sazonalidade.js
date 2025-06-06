// gráfico de chegadas de turistas estrangeiros
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
            legend: {
                display: false 
            },
            tooltip: {
                bodyFont: {
                    family: "'Anybody', sans-serif",
                    size: 12,
                    weight: '400'
                },
                titleFont: {
                    family: "'Anybody', sans-serif",
                    size: 12,
                    weight: '400'
                }
            }
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    color: '#000000',
                    font: {
                        family: "'Anybody', sans-serif",
                        size: 12,
                        weight: '400'
                    }
                },
                grid: {
                    color: 'rgb(0, 0, 0)'
                }
            },
            x: {
                ticks: {
                    color: '#000000',
                    font: {
                        family: "'Anybody', sans-serif",
                        size: 12,
                        weight: '400'
                    }
                },
                grid: {
                    color: 'rgb(0, 0, 0)'
                }
            }
        }
    }
});


Highcharts.mapChart('mapaBrasil', {
    chart: {
        map: 'countries/br/br-all'
        
    },
    title: { 
        text: '' 
    },
    colorAxis: {  
        min: 0,
        max: 100000, 

        stops: [             
            [0.1, '#FFD645'],
            [0.5, '#F8CA26'],
            [0.9, '#BA9100']
        ]
    },
    series: [{
        data: [
            ['br-sp', 85000],  // São Paulo 
            ['br-rj', 75000],  // Rio de Janeiro
            ['br-sc', 70000],  // Santa Catarina
            ['br-ba', 65000],  // Bahia
            ['br-mg', 60000],  // Minas Gerais
            ['br-pr', 58000],  // Paraná
            ['br-rs', 55000],  // Rio Grande do Sul
            ['br-pe', 30000],  // Pernambuco
            ['br-ce', 28000],  // Ceará
            ['br-df', 25000],  // Distrito Federal
            ['br-es', 22000],  // Espírito Santo
            ['br-go', 20000],  // Goiás
            ['br-pa', 18000],  // Pará
            ['br-ma', 15000],  // Maranhão
            ['br-rn', 12000],  // Rio Grande do Norte
            ['br-pb', 10000],  // Paraíba
            ['br-se', 9000],   // Sergipe
            ['br-al', 8000],   // Alagoas
            ['br-pi', 7000],   // Piauí
            ['br-mt', 6000],   // Mato Grosso
            ['br-ms', 5000],   // Mato Grosso do Sul
            ['br-to', 4000],   // Tocantins
            ['br-ro', 3000],   // Rondônia
            ['br-am', 2000],   // Amazonas
            ['br-ap', 1500],   // Amapá
            ['br-ac', 1000],   // Acre
            ['br-rr', 800]     // Roraima 
        ],
        name: 'Turistas estrangeiros',
        tooltip: {
            pointFormat: '<b>{point.name}</b><br>Turistas: {point.value}'
        }
    }]
});

// public/js/sazonalidade.js

// --- 1. Referências aos elementos de filtro no HTML ---
const selectMes = document.getElementById('filtroMesSazonalidade');
const selectAno = document.getElementById('filtroAnoSazonalidade');
const selectPais = document.getElementById('filtroPaisSazonalidade');

// --- 2. Referências aos elementos de KPI (os SPANs para os estados) ---
const estadoVisitado1 = document.getElementById('estadoVisitado1');
const estadoVisitado2 = document.getElementById('estadoVisitado2');
const estadoVisitado3 = document.getElementById('estadoVisitado3');


/**
 * Função principal para carregar os dados da KPI "TOP 3 Estados Mais Visitados".
 * É chamada ao carregar a página e sempre que um filtro é alterado.
 */
async function carregarKPITopEstados() {
    // Obter os valores selecionados nos filtros
    // Se o select não existir ou o valor for vazio, ele será tratado como "nenhum filtro"
    const mes = selectMes ? selectMes.value : '';
    const ano = selectAno ? selectAno.value : '';
    const pais = selectPais ? selectPais.value : '';

    // Construir a string de parâmetros da URL para a requisição ao backend
    const params = new URLSearchParams();
    if (mes) params.append('mes', mes);
    if (ano) params.append('ano', ano);
    if (pais) params.append('pais', pais);
    const queryString = params.toString(); // Ex: "mes=6&ano=2023&pais=1" ou "" se nenhum filtro


    // --- Funções auxiliares para manipular os SPANs dos estados ---
    const setEstadoText = (element, text) => {
        if (element) element.textContent = text;
    };

    const clearEstados = () => {
        setEstadoText(estadoVisitado1, '');
        setEstadoText(estadoVisitado2, '');
        setEstadoText(estadoVisitado3, '');
    };

    try {
        // Limpa os spans com um indicador de carregamento
        setEstadoText(estadoVisitado1, 'Carregando...');
        setEstadoText(estadoVisitado2, '');
        setEstadoText(estadoVisitado3, '');


        // --- 3. Fazer a requisição ao backend ---
        // A rota `/grafico/sazonalidade/top-estados` é a que configuramos no graficoRoute.js
        const response = await fetch(`/grafico/sazonalidade/top-estados?${queryString}`);

        // Verificar se a resposta foi bem-sucedida (status 200-299)
        if (!response.ok) {
            // Lança um erro se a resposta HTTP não for OK
            throw new Error(`Erro HTTP! status: ${response.status}`);
        }

        // --- 4. Processar os dados da resposta ---
        const data = await response.json(); // Espera um array de strings (nomes dos estados)

        // Limpa os spans novamente para preencher com os resultados
        clearEstados();

        // Preenche os spans com os dados retornados
        if (data && data.length > 0) {
            setEstadoText(estadoVisitado1, data[0] || ''); // Primeiro estado
            setEstadoText(estadoVisitado2, data[1] || ''); // Segundo estado
            setEstadoText(estadoVisitado3, data[2] || ''); // Terceiro estado
        } else {
            // Caso nenhum dado seja retornado (ex: nenhum turista para os filtros)
            setEstadoText(estadoVisitado1, 'Nenhum dado');
            setEstadoText(estadoVisitado2, 'disponível');
            setEstadoText(estadoVisitado3, ''); // O terceiro pode ficar vazio
        }

    } catch (error) {
        console.error('Erro ao carregar KPI Top Estados Sazonalidade:', error);
        clearEstados(); // Limpa em caso de erro
        setEstadoText(estadoVisitado1, 'Erro ao');
        setEstadoText(estadoVisitado2, 'carregar');
        setEstadoText(estadoVisitado3, ''); // O terceiro pode ficar vazio
    }
}


// --- 5. Adicionar Event Listeners aos filtros ---
// Sempre que o valor de um filtro mudar, a função carregarKPITopEstados será chamada
if (selectMes) {
    selectMes.addEventListener('change', carregarKPITopEstados);
}
if (selectAno) {
    selectAno.addEventListener('change', carregarKPITopEstados);
}
if (selectPais) {
    selectPais.addEventListener('change', carregarKPITopEstados);
}


// --- 6. Chamada inicial ao carregar a página ---
// Garante que a KPI seja carregada assim que o HTML estiver pronto
document.addEventListener('DOMContentLoaded', carregarKPITopEstados);