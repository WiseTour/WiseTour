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

  containers.forEach((container, i) => {
    container.style.display = i === 0 ? "flex" : "none";
  });
});


document.addEventListener("DOMContentLoaded", function () {
  const usuario = JSON.parse(localStorage.getItem("USUARIO_COMPLETO"));

  if (usuario) {
    fetch(`/usuario/${usuario.id_usuario}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao buscar usuário');
        }
        return response.json();
      })
      .then(data => {
        console.log('Usuário com funcionário:', data);

        // Armazenar no sessionStorage
        sessionStorage.setItem('usuario', JSON.stringify(data));
        if (data.funcionario) {
          sessionStorage.setItem('funcionario', JSON.stringify(data.funcionario));
        }

        // Preencher os inputs
        document.getElementById('nome').value = data.funcionario.nome || '';
        document.getElementById('email').value = data.email || '';
        if (data.funcionario) {
          document.getElementById('funcao').value = data.funcionario.cargo || '';
          document.getElementById('telefone').value = data.funcionario.telefone || '';
        }

        // Preencher os spans com IDs
        document.getElementById('span-passaporte').innerText = data.id_usuario;
        document.getElementById('span-nome').innerText = data.funcionario.nome || '';
        document.getElementById('span-funcao').innerText = data.funcionario?.cargo || '';
        
      })
      .catch(error => {
        console.error('Erro:', error);
        alert('Não foi possível carregar os dados do usuário');
      });
  } else {
    console.log("Usuário não encontrado no localStorage.");
  }
});
