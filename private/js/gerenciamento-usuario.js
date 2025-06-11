import { aplicarMascaraCelular, removerMascara } from "./utils/mascara.js";

document.addEventListener("DOMContentLoaded", () => {
  const botoesCabecalho = document.querySelectorAll(".cabecalho button");
  const containers = document.querySelectorAll(".left_container_container");
  const inputs = document.querySelectorAll("input");
  const botoesSalvar = document.querySelectorAll(".btn_salvar");

  inputs.forEach((input) => {
    input.disabled = true;
    input.style.opacity = "0.5";
  });
  botoesSalvar.forEach((btn) => {
    btn.disabled = true;
    btn.style.cursor = "default";
    btn.style.opacity = "0.5";
  });

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

  aplicarPreferenciasDoUsuario();
  aplicarPermissaoUsuario();

  containers.forEach((container, index) => {
    container.style.display = index === 0 ? "flex" : "none";
  });

  function toggleVisibilidadeSenha(idInput, idOlho) {
    const inputSenha = document.getElementById(idInput);
    const olho = document.getElementById(idOlho);

    olho.addEventListener("click", () => {
      const tipoAtual = inputSenha.getAttribute("type");
      inputSenha.setAttribute(
        "type",
        tipoAtual === "password" ? "text" : "password"
      );
      olho.classList.toggle("fa-eye-slash");
      olho.classList.toggle("fa-eye");
    });
  }

  toggleVisibilidadeSenha("senha_gerenciamento_senha", "olho_senha");
  toggleVisibilidadeSenha("nova_senha_gerenciamento_senha", "olho_nova_senha");

  botoesCabecalho.forEach((botao, index) => {
    botao.addEventListener("click", () => {
      botoesCabecalho.forEach((btn) => btn.classList.remove("active"));
      botao.classList.add("active");

      inputs.forEach((input) => {
        input.disabled = true;
        input.style.opacity = "0.5";
      });
      botoesSalvar.forEach((btn) => {
        btn.disabled = true;
        btn.style.cursor = "default";
        btn.style.opacity = "0.5";
      });

      containers.forEach((container, i) => {
        container.style.display = i === index ? "flex" : "none";
      });
    });
  });

  const botoesEdicao = [
    {
      botaoEditar: "btn_editar_informacoes_pessoais",
      classeInputs: ".input_gerenciamento_usuario",
      botaoSalvar: "btn_salvar_informacoes_pessoais",
    },
    {
      botaoEditar: "btn_editar_senha",
      classeInputs: ".input_gerenciamento_senha",
      botaoSalvar: "btn_salvar_senha",
    },
  ];

  botoesEdicao.forEach((item) => {
    const botaoEditar = document.getElementById(item.botaoEditar);
    if (botaoEditar) {
      botaoEditar.addEventListener("click", () => {
        const inputsAlvo = document.querySelectorAll(item.classeInputs);
        const botaoSalvar = document.getElementById(item.botaoSalvar);

        inputsAlvo.forEach((input) => {
          input.disabled = !input.disabled;
          input.style.opacity = input.disabled ? "0.5" : "1";
          input.style.cursor = input.disabled ? "not-allowed" : "text";
        });

        if (botaoSalvar) {
          botaoSalvar.disabled = !botaoSalvar.disabled;
          botaoSalvar.style.opacity = botaoSalvar.disabled ? "0.5" : "1";
          botaoSalvar.style.cursor = botaoSalvar.disabled
            ? "not-allowed"
            : "pointer";
        }
      });
    }
  });

  const btnSalvar = document.getElementById("btn_salvar_informacoes_pessoais");
  if (btnSalvar) {
    btnSalvar.addEventListener("click", alterarInformacoesUsuario);
  }

  const btnSalvarSenha = document.getElementById("btn_salvar_senha");
  if (btnSalvarSenha) {
    btnSalvarSenha.addEventListener("click", alterarSenhaUsuario);
  }

  // Buscar e preencher dados do usuário
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  if (usuario) {
    fetch(`/usuario/${usuario.id_usuario}`)
      .then((response) => {
        if (!response.ok) throw new Error("Erro ao buscar usuário");
        return response.json();
      })
      .then((data) => {
        sessionStorage.setItem("usuario", JSON.stringify(data));
        preencherCamposUsuario(data);
      })
      .catch((error) => {
        console.error("Erro:", error);
        alert("Não foi possível carregar os dados do usuário");
      });
  }

  // Buscar e preencher dados de senha do usuário
  if (usuario) {
    fetch(`/usuario/${usuario.id_usuario}/senha`)
      .then((response) => {
        if (!response.ok) throw new Error("Erro ao buscar dados de senha");
        return response.json();
      })
      .then((data) => {
        // Preenche os campos do formulário de senha
        preencherCamposGerenciamentoSenha(
          JSON.parse(sessionStorage.getItem("usuario")),
          data.senha
        );
      })
      .catch((error) => {
        console.error("Erro:", error);
        alert("Não foi possível carregar os dados de senha");
      });
  }
});

function preencherCamposUsuario(data) {
  document.getElementById("nome").value = data.funcionario.nome || "";
  document.getElementById("funcao").value = data.funcionario.cargo || "";
  document.getElementById("telefone").value =
    aplicarMascaraCelular(data.funcionario.telefone) || "";
  document.getElementById("email").value = data.email || "";

  document.getElementById("span-passaporte").innerText = data.id_usuario || "";
  document.getElementById("span-nome").innerText = data.funcionario.nome || "";
  document.getElementById("span-funcao").innerText =
    data.funcionario.cargo || "";
}

function preencherCamposGerenciamentoSenha(data, senha) {
  document.getElementById("nome_gerenciamento_senha").value =
    data.funcionario.nome || "";
  document.getElementById("email_gerenciamento_senha").value = data.email || "";
  document.getElementById("senha_gerenciamento_senha").value = senha || "";
  document.getElementById("nova_senha_gerenciamento_senha").value = "";
}

function alterarInformacoesUsuario() {
  const usuario = JSON.parse(sessionStorage.getItem("usuario"));

  if (!usuario || !usuario.id_usuario) {
    alert("Usuário não encontrado.");
    return;
  }

  const informacoes = {
    id_usuario: usuario.id_usuario,
    id_funcionario: usuario.funcionario.id_funcionario,
    nome: document.getElementById("nome").value,
    cargo: document.getElementById("funcao").value,
    telefone: removerMascara(document.getElementById("telefone").value),
    email: document.getElementById("email").value,
  };

  fetch(`/usuario/alterar_informacoes`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(informacoes),
  })
    .then((response) => {
      if (!response.ok) throw new Error("Erro ao atualizar informações");
      return response.json();
    })
    .then((data) => {
      console.log("Informações atualizadas:", data);
      alert("Informações atualizadas com sucesso!");
      window.location.reload();
    })
    .catch((error) => {
      console.error("Erro:", error);
      alert("Não foi possível atualizar os dados do funcionário");
    });
}

function alterarSenhaUsuario() {
  const usuario = JSON.parse(sessionStorage.getItem("usuario"));

  if (!usuario || !usuario.id_usuario) {
    alert("Usuário não encontrado.");
    return;
  }

  const novaSenha = document.getElementById(
    "nova_senha_gerenciamento_senha"
  ).value;

  if (!novaSenha) {
    alert("Por favor, preencha o campo de nova senha.");
    return;
  }

  const dadosSenha = {
    id_usuario: usuario.id_usuario,
    senha: novaSenha,
  };

  fetch(`/usuario/alterar_senha`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dadosSenha),
  })
    .then((response) => {
      if (!response.ok) throw new Error("Erro ao atualizar a senha");
      return response.json();
    })
    .then((data) => {
      console.log("Senha atualizada:", data);
      alert("Senha atualizada com sucesso!");
      window.location.reload();
    })
    .catch((error) => {
      console.error("Erro:", error);
      alert("Não foi possível atualizar a senha");
    });
}
