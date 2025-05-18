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
