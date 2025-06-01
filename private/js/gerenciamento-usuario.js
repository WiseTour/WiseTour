// eventosUsuario.js
import {
  alterarInformacoesUsuario,
  preencherCamposUsuario,
  preencherCamposGerenciamentoSenha,
  alterarSenhaUsuario,
} from "./gerenciamento/gerenciamentoUsuario.js";

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
    fetch(`/usuario/${usuario.id}`)
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
    fetch(`/usuario/${usuario.id}/senha`)
      .then((response) => {
        if (!response.ok) throw new Error("Erro ao buscar dados de senha");
        return response.json();
      })
      .then((data) => {
        // Preenche os campos do formulário de senha
        preencherCamposGerenciamentoSenha(JSON.parse(sessionStorage.getItem("usuario")), data.senha);
      })
      .catch((error) => {
        console.error("Erro:", error);
        alert("Não foi possível carregar os dados de senha");
      });
  }
});
