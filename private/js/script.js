// === GERENCIAMENTO DE USUÁRIO ===

document.addEventListener("DOMContentLoaded", () => {
  // Elementos principais
  const botoesCabecalho = document.querySelectorAll(".cabecalho button");
  const containers = document.querySelectorAll(".left_container_container");
  const inputs = document.querySelectorAll("input");
  const botoesSalvar = document.querySelectorAll(".btn_salvar");

  // Inicializar: Desabilitar inputs e botões de salvar
  inputs.forEach((input) => {
    input.disabled = true;
    input.style.opacity = "0.5";
  });
  botoesSalvar.forEach((btn) => {
    btn.disabled = true;
    btn.style.cursor = "default";
    btn.style.opacity = "0.5";
  });

  // Exibir o primeiro container por padrão
  containers.forEach((container, index) => {
    container.style.display = index === 0 ? "flex" : "none";
  });

  // Altera a visibilidada das senhas
  function toggleVisibilidadeSenha(idInput, idOlho) {
    const inputSenha = document.getElementById(idInput);
    const olho = document.getElementById(idOlho);

    olho.addEventListener("click", () => {
      const tipoAtual = inputSenha.getAttribute("type");
      if (tipoAtual === "password") {
        inputSenha.setAttribute("type", "text");
        olho.classList.remove("fa-eye-slash");
        olho.classList.add("fa-eye");
      } else {
        inputSenha.setAttribute("type", "password");
        olho.classList.remove("fa-eye");
        olho.classList.add("fa-eye-slash");
      }
    });
  }

  // Ativando para seus inputs e olhos correspondentes
  toggleVisibilidadeSenha("senha_gerenciamento_senha", "olho_senha");
  toggleVisibilidadeSenha("nova_senha_gerenciamento_senha", "olho_nova_senha");

  // Alternar abas do cabeçalho
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

  // === Funções de Alternar Campos ===

  // Alternar informações pessoais
  function alternarCampos(classeInputs, botaoSalvar) {
    const inputsAlvo = document.querySelectorAll(classeInputs);
    const botao = document.getElementById(botaoSalvar);

    inputsAlvo.forEach((input) => {
      input.disabled = !input.disabled;
      input.style.opacity = input.disabled ? "0.5" : "1";
      input.style.cursor = input.disabled ? "not-allowed" : "text";
    });

    if (botao) {
      botao.disabled = !botao.disabled;
      botao.style.opacity = botao.disabled ? "0.5" : "1";
      botao.style.cursor = botao.disabled ? "not-allowed" : "pointer";
    }
  }

  // Configurar botões de edição
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
      botaoEditar.addEventListener("click", () =>
        alternarCampos(item.classeInputs, item.botaoSalvar)
      );
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  if (usuario) {
    fetch(`/usuario/${usuario.id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao buscar usuário");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Usuário encontrado:", data);

        // Armazenar no sessionStorage
        sessionStorage.setItem("usuario", JSON.stringify(data));

        // Preencher os inputs (ajuste conforme os nomes dos campos do usuário)
        document.getElementById("nome").value = data.funcionario.nome || "";
        document.getElementById("funcao").value = data.funcionario.cargo || "";
        document.getElementById("telefone").value =
          data.funcionario.telefone || "";
        document.getElementById("email").value = data.email || "";

        // Preencher os spans com IDs
        document.getElementById("span-passaporte").innerText =
          data.id_usuario || "";
        document.getElementById("span-nome").innerText =
          data.funcionario.nome || "";
        document.getElementById("span-funcao").innerText =
          data.funcionario.cargo || "";
      })
      .catch((error) => {
        console.error("Erro:", error);
        alert("Não foi possível carregar os dados do usuário");
      });
  } else {
    console.log("Usuário não encontrado no localStorage.");
  }
});

function alterarInformacoesUsuario() {
  const usuario = JSON.parse(sessionStorage.getItem("usuario"));

  if (!usuario || !usuario.id_usuario) {
    alert("Usuário não encontrado.");
    return;
  }

  if (!usuario.funcionario.id_funcionario) {
    alert("Usuário não faz parte de um funcionároio.");
    return;
  }

  const informacoes = {
    id_usuario: usuario.id_usuario,
    id_funcionario: usuario.funcionario.id_funcionario,
    nome: document.getElementById("nome").value,
    cargo: document.getElementById("funcao").value,
    telefone: document.getElementById("telefone").value,
    email: document.getElementById("email").value,
  };

  fetch(`/usuario/alterar_informacoes`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(informacoes),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erro ao atualizar informações");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Informações atualizadas com sucesso:", data);
      alert("Informações atualizadas com sucesso!");
      window.location.reload();

    })
    .catch((error) => {
      console.log("Erro:", error);
      alert("Não foi possível atualizar os dados do funcionário");
    });
}

// Correção no evento de carregamento
window.addEventListener("DOMContentLoaded", () => {
  const btnSalvarInformacoesUsuario = document.getElementById(
    "btn_salvar_informacoes_pessoais"
  );

  if (btnSalvarInformacoesUsuario) {
    btnSalvarInformacoesUsuario.addEventListener(
      "click",
      alterarInformacoesUsuario
    );
  }
});

// /GERENCIAMENTO DE USUÁRIO

// CONFIGURAÇÕES

// document.addEventListener("DOMContentLoaded", () => {
//   const usuario = JSON.parse(localStorage.getItem("USUARIO_COMPLETO"));
//   if (!usuario) {
//     alert("Usuário não encontrado.");
//     return;
//   }

//   fetch(`/telaDashboardRoutes/${usuario.id_usuario}`)
//     .then((response) => response.json())
//     .then((data) => {
//       console.log("Telas ativas:", data);

//       data.forEach((tela) => {
//         const { tela: nomeTela, ativo } = tela;

//         let idCheckbox = "";
//         switch (nomeTela) {
//           case "sazonalidade":
//             idCheckbox = "sazonalidade";
//             break;
//           case "perfilTurista":
//             idCheckbox = "perfil_turista";
//             break;
//           case "panoramaGeral":
//             idCheckbox = "panorama_geral";
//             break;
//           default:
//             console.warn(`Tela não reconhecida: ${nomeTela}`);
//             break;
//         }

//         if (idCheckbox) {
//           const checkbox = document.getElementById(idCheckbox);
//           if (checkbox) {
//             checkbox.checked = ativo === "sim";
//           }
//         }
//       });
//     })
//     .catch((error) => {
//       console.error("Erro ao buscar telas ativas:", error);
//     });

//   // Quando clicar no botão salvar:
//   const btnSalvar = document.getElementById("btn_alterar_preferencias");
//   btnSalvar.addEventListener("click", (e) => {
//     e.preventDefault(); // Evita o submit do form

//     const telas = [
//       {
//         tela: "panoramaGeral",
//         ativo: document.getElementById("panorama_geral").checked,
//       },
//       {
//         tela: "perfilTurista",
//         ativo: document.getElementById("perfil_turista").checked,
//       },
//       {
//         tela: "sazonalidade",
//         ativo: document.getElementById("sazonalidade").checked,
//       },
//     ];

//     fetch(`/telaDashboardRoutes/${usuario.id_usuario}`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ telas }),
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         console.log(data);
//         alert("Preferências atualizadas!");
//       })
//       .catch((err) => {
//         console.error("Erro ao atualizar preferências:", err);
//         alert("Erro ao atualizar preferências.");
//       });
//   });
// });

// /CONFIGURAÇÕES
