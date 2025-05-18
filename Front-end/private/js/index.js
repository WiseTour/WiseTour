const coresUsadas = {
    amarelo: '#F8CA26',
    marrom: '#735900',
    marromBege: '#C49F1B',
    amareloClaro: '#FFE483',
    begeMedio: '#D09041'
};

const estiloDoTextoDoGrafico = {
    color: '#000000',
    font: {
        weight: '500',
        family: "'Anybody', sans-serif",
        size: 12,
        lineHeight: 1.5  
    }
};

// 1. Gráfico PRINCIPAIS PAÍSES DE ORIGEM (colorido com 5 cores)
new Chart(document.getElementById('myChart'), {
    type: 'bar',
    data: {
        labels: ['Argentina', 'Chile', 'EUA', 'Paraguai', 'Uruguai'],
        datasets: [{
            data: [20, 15, 10, 5, 1],
            backgroundColor: [
                coresUsadas.amarelo,
                coresUsadas.marromBege,
                coresUsadas.marrom,
                coresUsadas.amareloClaro,
                coresUsadas.begeMedio
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
                    label: function(context) {
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

// 2. Gráfico PRESENÇA DE TURISTAS POR UF (colorido com 5 cores)
new Chart(document.getElementById('presencaTuristaChart'), {
    type: 'bar',
    data: {
        labels: ['SP', 'RJ', 'MG', 'BA', 'RS'],
        datasets: [{
            data: [5000, 3000, 2000, 1500, 1200],
            backgroundColor: [
                coresUsadas.amarelo,
                coresUsadas.marromBege,
                coresUsadas.marrom,
                coresUsadas.amareloClaro,
                coresUsadas.begeMedio
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
                    label: function(context) {
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

// 3. Gráfico de CHEGADAS (mantido com linha amarela ondulada)
new Chart(document.getElementById('chegadasTuristasChart'), {
    type: 'line',
    data: {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        datasets: [{
            data: [35000, 25000, 50000, 50000, 0, 80000, 35000, 70000, 51000, 20000, 20000, 53000],
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
