document.addEventListener("DOMContentLoaded", function () {
  const botoes = document.querySelectorAll(".cabecalho button");
  const containers = document.querySelectorAll(".left_container_container");

  botoes.forEach((botao, index) => {
    botao.addEventListener("click", () => {
      // Remover classe 'active' de todos os botões
      botoes.forEach((btn) => btn.classList.remove("active"));
      // Adicionar classe 'active' ao botão clicado
      botao.classList.add("active");

      // Esconder todos os containers
      containers.forEach((container) => {
        container.style.display = "none";
      });

      // Mostrar apenas o container correspondente
      containers[index].style.display = "flex";
    });
  });

  // Opcional: exibir apenas o primeiro container ao carregar
  containers.forEach((container, i) => {
    container.style.display = i === 0 ? "flex" : "none";
  });
});
