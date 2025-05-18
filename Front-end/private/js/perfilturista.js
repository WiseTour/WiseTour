
const coresUsadas = {
    amarelo: '#F8CA26',
    marrom: '#735900',
    marromBege: '#C49F1B',
    amareloClaro: '#FFE483',
    avermelhado: '#A66D44',
    cimento: '#87826E',
    acinzentado: '#DDD8C5',
    cinza: '#E0E0E0',
    marromForte: '#A98400'
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


const ctxMotivos = document.getElementById('graficoMotivos');
new Chart(ctxMotivos, {
    type: 'bar',
    data: {
        labels: ['Lazer', 'Negócios', 'Outros'],
        datasets: [{
            label: 'Motivos',
            data: [65, 25, 10],
            backgroundColor: [
                coresUsadas.amarelo,
                coresUsadas.marrom,
                coresUsadas.marromBege
            ],
            borderWidth: 0
        }]
    },
    options: {
        ...opcoesPadrao,
        indexAxis: 'y',
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            x: {
                beginAtZero: true,
                grid: {
                    display: false
                },
                ticks: {
                    ...estiloDoTextoDoGrafico,
                    font: {
                        ...estiloDoTextoDoGrafico.font,
                        size: 15
                    }
                }
            },
            y: {
                grid: {
                    display: false
                },
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


    const ctxFontes = document.getElementById('graficoFontes');
    
    new Chart(ctxFontes, {
        type: 'bar',
        data: {
            labels: ['Amigos/Parentes', 'Escritórios', 'Feiras', 'Eventos', 'Agência', 'Outros', 'Internet', 'Guias', 'Corporativo'],
            datasets: [{
                label: 'Fontes',
                data: [20, 15, 10, 8, 12, 5, 25, 3, 12],
                backgroundColor: [
                    coresUsadas.amarelo,
                    coresUsadas.marrom,
                    coresUsadas.marromBege,
                    coresUsadas.amareloClaro,
                    coresUsadas.marromForte,
                    coresUsadas.esverdeado,
                    coresUsadas.acinzentado,
                    coresUsadas.cinza,
                    '#D9C7A7' 
                ],
                borderWidth: 0
            }]
        },
        options: {
            ...opcoesPadrao,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        display: false
                    },
                    ticks: {
                        ...estiloDoTextoDoGrafico
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
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

const ctxComposicao = document.getElementById('graficoComposicao');
new Chart(ctxComposicao, {
    type: 'pie',
    data: {
        labels: ['Família', 'Amigos', 'Dupla', 'Sozinho'],
        datasets: [{
            data: [40, 30, 20, 10],
            backgroundColor: [
                coresUsadas.amarelo,
                coresUsadas.marrom,
                coresUsadas.marromBege,
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
                    boxWidth: 35,
                    boxHeight: 14,
                    borderRadius: 50,
                    padding: 5,
                    font: {
                        ...estiloDoTextoDoGrafico.font,
                        size: 14
                    }
                }
            }
        }
    }
});


const ctxVias = document.getElementById('graficoVias');
new Chart(ctxVias, {
    type: 'pie',
    data: {
        labels: ['Aérea', 'Terrestre', 'Fluvial', 'Marítima'],
        datasets: [{
            data: [60, 30, 5, 5],
            backgroundColor: [
                coresUsadas.avermelhado,
                coresUsadas.cimento,
                coresUsadas.acinzentado,
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
                    boxWidth: 35,
                    boxHeight: 14,
                    borderRadius: 50,
                    padding: 5,
                    font: {
                        ...estiloDoTextoDoGrafico.font,
                        size: 14
                    }
                }
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
