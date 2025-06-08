document.addEventListener("DOMContentLoaded", () => {
  const botoesCabecalho = document.querySelectorAll(".cabecalho button");
  const containers = document.querySelectorAll(".left_container_container");
  const botoesEditar = document.querySelectorAll(".btn_editar");
  const botoesSalvar = document.querySelectorAll(".btn_salvar");
  const inputs = document.querySelectorAll("input");

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
    container.style.display = index === 0 ? "grid" : "none";
  });

  let usuario = JSON.parse(localStorage.getItem("usuario"));

  if (usuario) {
    fetch(`/usuario/${usuario.id_usuario}`)
      .then((response) => {
        if (!response.ok) throw new Error("Erro ao buscar usuário");
        return response.json();
      })
      .then((data) => {
        localStorage.setItem("usuario", JSON.stringify(data));

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
  }

  // === CONFIGURAÇÃO INICIAL ===
  function desabilitarInputs(inputsList) {
    inputsList.forEach((input) => {
      input.disabled = true;
      input.style.opacity = "0.5";
    });
  }

  function desabilitarBotoesSalvar() {
    botoesSalvar.forEach((btn) => {
      btn.disabled = true;
      btn.style.cursor = "default";
      btn.style.opacity = "0.5";
    });
  }

  function atualizarTextoEditarPadrao() {
    botoesEditar.forEach((btn) => {
      btn.innerHTML = '<i class="fa-solid fa-pen"></i>Alterar';
    });
  }

  desabilitarInputs(inputs);
  desabilitarBotoesSalvar();

  // === CARREGAMENTO DAS PREFERÊNCIAS DO USUÁRIO ===
  if (usuario?.id_usuario) {
    // Preferências de visualização de dashboard
    fetch(
      `/preferenciaVisualizacaoDashboard/usuario/preferencias-visualizacao-dashboard?id_usuario=${usuario.id_usuario}`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar preferências do usuário");
        return res.json();
      })
      .then((preferencias) => {
        sessionStorage.setItem(
          "preferenciaUsuario",
          JSON.stringify(preferencias)
        );
        preferencias.forEach((pref) => {
          console.log(pref);
          if (pref.ativo === "sim") {
            const inputId = pref.tela_dashboard.tela
              .replace(/([A-Z])/g, "_$1")
              .toLowerCase();
            const checkbox = document.getElementById(inputId);
            console.log(inputId);
            if (checkbox) checkbox.checked = true;
          }
        });
      })
      .catch((err) => {
        console.error("Erro:", err);
        alert("Não foi possível carregar as preferências do usuário");
      });

    // Configuração do Slack
    fetch(
      `/configuracaoSlackRoutes/usuario/configuracaoSlack/tiposNotificacoes?id_usuario=${usuario.id_usuario}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar configuração do Slack");
        return res.json();
      })
      .then((dados) => {
        sessionStorage.setItem("configuracaoSlack", JSON.stringify(dados));
        const config = dados[0];

        document.getElementById("ativar-slack").checked =
          config.ativo === "sim";
        document.getElementById("canal_padrao").value =
          config.webhook_canal_padrao || "";

        const etapas = [
          "inicializacao",
          "extracao",
          "tratamento",
          "transformacao",
          "carregamento",
          "finalizacao",
        ];
        etapas.forEach((etapa) => {
          const checkbox = document.getElementById(etapa);
          if (checkbox) checkbox.checked = false;
        });

        config.tipo_notificacao_dados.forEach(({ etapa }) => {
          if (etapa.etapa !== "s3_conexao") {
            const checkbox = document.getElementById(etapa.etapa);
            if (checkbox) checkbox.checked = true;
          }
        });
      })
      .catch((err) => {
        console.error("Erro:", err);
        alert("Não foi possível carregar a configuração do Slack");
      });
  }

  // === NAVEGAÇÃO ENTRE SEÇÕES DO CABEÇALHO ===
  containers.forEach((container, index) => {
    container.style.display = index === 0 ? "grid" : "none";
  });

  botoesCabecalho.forEach((botao, index) => {
    botao.addEventListener("click", () => {
      botoesCabecalho.forEach((btn) => btn.classList.remove("active"));
      botao.classList.add("active");

      containers.forEach((container, idx) => {
        container.style.display = idx === index ? "grid" : "none";
      });

      desabilitarInputs(inputs);
      desabilitarBotoesSalvar();
      atualizarTextoEditarPadrao();
    });
  });

  // === EDIÇÃO DOS INPUTS ===
  botoesEditar.forEach((btnEditar) => {
    btnEditar.addEventListener("click", () => {
      const container = btnEditar.closest(".left_container_container");
      const inputsContainer = container.querySelectorAll("input");
      const btnSalvar = container.querySelector(".btn_salvar");

      const isDesativado = inputsContainer[0].disabled;

      inputsContainer.forEach((input) => {
        input.disabled = !isDesativado;
        input.style.opacity = isDesativado ? "1" : "0.5";
      });

      btnSalvar.disabled = !isDesativado;
      btnSalvar.style.cursor = isDesativado ? "pointer" : "default";
      btnSalvar.style.opacity = isDesativado ? "1" : "0.5";

      btnEditar.innerHTML = isDesativado
        ? '<i class="fa-solid fa-x"></i>Cancelar'
        : '<i class="fa-solid fa-pen"></i>Alterar';
    });
  });

  // === SALVAR PREFERÊNCIAS ===
  botoesSalvar.forEach((btnSalvar) => {
    btnSalvar.addEventListener("click", () => {
      const container = btnSalvar.closest(".left_container_container");
      const inputsContainer = container.querySelectorAll("input");

      desabilitarInputs(inputsContainer);
      desabilitarBotoesSalvar();
      atualizarTextoEditarPadrao();

      // Salvar visualização dashboard
      if (btnSalvar.id === "btn_salvar_visualizacao_dashboard") {
        const preferenciasAtualizadas = [];

        inputsContainer.forEach((input) => {
          const ativo = input.checked ? "sim" : "nao";
          const telaMap = {
            panorama_geral: 1,
            perfil_turista: 2,
            sazonalidade: 3,
          };

          const fk_tela_dashboard = telaMap[input.id];

          if (fk_tela_dashboard) {
            preferenciasAtualizadas.push({
              fk_tela_dashboard,
              fk_usuario: usuario.id_usuario,
              ativo,
            });
          }
        });

        fetch(
          `/preferenciaVisualizacaoDashboard/usuario/preferencias-visualizacao-dashboard`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(preferenciasAtualizadas),
          }
        )
          .then((res) => {
            if (!res.ok) throw new Error("Erro ao salvar preferências");
            return res.json();
          })
          .then(() => alert("Preferências salvas com sucesso!"))
          .catch((err) => {
            console.error("Erro ao salvar preferências:", err);
            alert("Erro ao salvar preferências");
          });
      }

      // Salvar notificações Slack
      if (btnSalvar.id === "btn_salvar_notificacao_slack") {
        const configuracaoSlack = JSON.parse(
          sessionStorage.getItem("configuracaoSlack")
        )[0];
        const tiposNotificacoes = [];
        const ativo = document.getElementById("ativar-slack").checked
          ? "sim"
          : "nao";
        const canalPadrao = document.getElementById("canal_padrao").value;

        const configuracaoSlackAtualizada = {
          id_configuracao_slack: configuracaoSlack.id_configuracao_slack,
          fk_usuario: usuario.id_usuario,
          canal_padrao: canalPadrao,
          ativo,
        };

        if (ativo === "sim") {
          const etapaMap = {
            inicializacao: 1,
            extracao: 3,
            tratamento: 4,
            transformacao: 5,
            carregamento: 6,
            finalizacao: 7,
          };

          inputsContainer.forEach((input) => {
            if (input.id !== "ativar-slack" && input.checked) {
              const fk_etapa = etapaMap[input.id];
              if (fk_etapa) {
                tiposNotificacoes.push({
                  fk_etapa,
                  fk_configuracao_slack:
                    configuracaoSlack.id_configuracao_slack,
                  fk_usuario: usuario.id_usuario,
                });
              }
            }
          });
        }

        fetch(
          `/configuracaoSlackRoutes/usuario/configuracaoSlack/tiposNotificacoes`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              configuracao_slack: configuracaoSlackAtualizada,
              tipos_notificacoes: tiposNotificacoes,
            }),
          }
        )
          .then((res) => {
            if (!res.ok) throw new Error("Erro ao salvar configurações");
            return res.json();
          })
          .then(() => {
            alert("Configurações salvas com sucesso!");
            if (ativo === "nao") {
              inputsContainer.forEach((input) => {
                input.checked = false;
              });
            }
          })
          .catch((err) => {
            console.error("Erro ao salvar configurações:", err);
            alert("Erro ao salvar configurações");
          });
      }
    });
  });
});
