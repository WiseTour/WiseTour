function aplicarPreferenciasDoUsuario() {
  // IDs dos elementos relacionados às preferências
  const mapeamentoIds = {
    panoramaGeral: "btnPanoramaGeral",
    perfilTurista: "btnPerfilTurista",
    sazonalidade: "btnSazonalidade",
  };

  const menuContainer = document.querySelector(".menu_container_middle");

  let botoesVisiveis = 0;

  // Recuperar preferências do localStorage
  const preferencias = JSON.parse(
    localStorage.getItem("preferenciaUsuario") || "[]"
  );

  // Mapeia preferências por tela
  const telasAtivas = {};
  preferencias.forEach((pref) => {
    const tela = pref.tela_dashboard?.tela;
    const ativo = pref.ativo;
    if (tela) telasAtivas[tela] = ativo;
  });

  // Aplica visibilidade e conta os visíveis
  Object.entries(mapeamentoIds).forEach(([tela, idElemento]) => {
    const el = document.getElementById(idElemento);
    if (!el) return;

    const ativo = telasAtivas[tela];
    if (ativo === "nao" || ativo === undefined) {
      el.style.display = "none";
    } else {
      el.style.display = "block"; // ou "flex" se preferir
      botoesVisiveis++;
    }
  });

  // Ajusta as colunas conforme a quantidade de botões visíveis
  if (menuContainer) {
    if (botoesVisiveis === 0) {
      menuContainer.style.gridTemplateColumns = "1fr";
    } else {
      menuContainer.style.gridTemplateColumns = `repeat(${botoesVisiveis}, 1fr)`;
    }
  }
}

function aplicarPermissaoUsuario() {
  const idElementoAdmin = "btnAdmin"; // Altere conforme o ID real no HTML
  const el = document.getElementById(idElementoAdmin);

  if (el) {
    // Remove classe e garante que o botão não esteja visível por padrão
    el.classList.remove("ativado");
    el.style.display = "none";

    // Recupera o usuário do localStorage
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    // Se for admin, mostra e aplica a classe ativado
    if (usuario && usuario.permissao === "admin") {
      el.style.display = "block"; // ou "flex", conforme necessário
      el.classList.add("ativado");
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  aplicarPreferenciasDoUsuario();
  aplicarPermissaoUsuario();
  const btnNovoUsuario = document.getElementById("btn-novo-usuario");
  const formCadastro = document.getElementById("form-cadastro");
  const btnCancelar = document.getElementById("btn-cancelar");
  const formUsuario = document.getElementById("form-usuario");
  const corpoTabela = document.getElementById("corpo-tabela");

  let usuarios = [];
  let editandoIndex = null;

  btnNovoUsuario.addEventListener("click", () => {
    formCadastro.style.display = "block";
    formUsuario.reset();
    editandoIndex = null;
  });

  btnCancelar.addEventListener("click", () => {
    formCadastro.style.display = "none";
    formUsuario.reset();
    editandoIndex = null;
  });

  formUsuario.addEventListener("submit", (e) => {
    e.preventDefault();

    const nome = formUsuario.nome.value;
    const cargo = formUsuario.cargo.value;
    const telefone = formUsuario.telefone.value;
    const email = formUsuario.email.value;

    const usuario = { nome, cargo, telefone, email };

    if (editandoIndex !== null) {
      usuarios[editandoIndex] = usuario;
    } else {
      usuarios.push(usuario);
    }

    atualizarTabela();
    cadastrarFuncionario(cadastrarInfoContato(usuario));
    formUsuario.reset();
    formCadastro.style.display = "none";
    editandoIndex = null;
  });

  function cadastrarInfoContato(usuario) {
    fetch("/usuario/cadastrar_info_contato", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nomeServer: usuario.nome,
        emailServer: usuario.email,
        numeroUsuarioServer: usuario.telefone,
      }),
    })
      .then(function (resposta) {
        console.log("resposta: ", resposta);

        if (resposta.ok) {
          return resposta.json();
        } else {
          throw "Houve um erro ao tentar realizar o cadastro!";
        }
      })
      .catch(function (resposta) {
        console.log(`#ERRO: ${resposta}`);
      });
    return false;
  }

  function atualizarTabela() {
    corpoTabela.innerHTML = "";
    usuarios.forEach((u, index) => {
      const linha = document.createElement("tr");

      linha.innerHTML = `
                <td>${u.nome}</td>
                <td>${u.cargo}</td>
                <td>${u.telefone}</td>
                <td>${u.email}</td>
                <td>
                    <button onclick="editarUsuario(${index})">✏️</button>
                    <button onclick="removerUsuario(${index})">🗑️</button>
                </td>
            `;

      corpoTabela.appendChild(linha);
    });
  }

  window.editarUsuario = function (index) {
    const u = usuarios[index];
    formUsuario.nome.value = u.nome;
    formUsuario.cargo.value = u.cargo;
    formUsuario.telefone.value = u.telefone;
    formUsuario.email.value = u.email;
    formCadastro.style.display = "block";
    editandoIndex = index;
  };

  window.removerUsuario = function (index) {
    if (confirm("Tem certeza que deseja remover este usuário?")) {
      usuarios.splice(index, 1);
      atualizarTabela();
    }
  };
});
