document.addEventListener('DOMContentLoaded', () => {
  if (estadoDesatualizado()) {
    fetch('/estado')
      .then(response => response.json())
      .then(data => {
        if (data.estado) {
          salvarEstado(data.estado);
          console.log("Estado atualizado e salvo:", data.estado);
        } else {
          console.warn("Estado inválido na resposta:", data.estado);
        }
      })
      .catch(error => console.error('Erro ao buscar estado:', error));
  } else {
    const { valor } = JSON.parse(localStorage.getItem("estado"));
    console.log("Estado carregado do localStorage:", valor);
  }

  const estadoElement = document.getElementById("estado");
  if(estadoElement){
    estadoElement.textContent = JSON.parse(localStorage.getItem("estado")).valor || "Brasil";
  }

});

function salvarEstado(estado) {
  localStorage.setItem("estado", JSON.stringify({
    valor: estado,
    data: new Date().toISOString()
  }));
}

function estadoDesatualizado() {
  const estadoData = localStorage.getItem("estado");
  if (!estadoData) return true;

  const { data } = JSON.parse(estadoData);
  const agora = new Date();
  const dataEstado = new Date(data);
  const diffHoras = (agora - dataEstado) / (1000 * 60 * 60);
  return diffHoras > 24;
}
