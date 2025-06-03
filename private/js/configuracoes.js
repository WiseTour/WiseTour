document.addEventListener("DOMContentLoaded", () => {
  const botoesCabecalho = document.querySelectorAll(".cabecalho button");
  const containers = document.querySelectorAll(".left_container_container");
  const botoesEditar = document.querySelectorAll(".btn_editar");
  const botoesSalvar = document.querySelectorAll(".btn_salvar");
  const inputs = document.querySelectorAll("input");

  // Estado inicial: desativar inputs e botões salvar
  inputs.forEach((input) => {
    input.disabled = true;
    input.style.opacity = "0.5";
  });
  botoesSalvar.forEach((btn) => {
    btn.disabled = true;
    btn.style.cursor = "default";
    btn.style.opacity = "0.5";
  });

  // Alternar seções no cabeçalho
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
    });
  });

  // Ativar inputs e botão salvar ao clicar em "Editar"
  botoesEditar.forEach((btnEditar) => {
    btnEditar.addEventListener("click", () => {
      const container = btnEditar.closest(".left_container_container");
      const inputsContainer = container.querySelectorAll("input");
      const btnSalvar = container.querySelector(".btn_salvar");

      inputsContainer.forEach((input) => {
        input.disabled = false;
        input.style.opacity = "1";
      });
      btnSalvar.disabled = false;
      btnSalvar.style.cursor = "pointer";
      btnSalvar.style.opacity = "1";
    });
  });

  // Salvar: desativar inputs e botão salvar
  botoesSalvar.forEach((btnSalvar) => {
    btnSalvar.addEventListener("click", () => {
      const container = btnSalvar.closest(".left_container_container");
      const inputsContainer = container.querySelectorAll("input");

      inputsContainer.forEach((input) => {
        input.disabled = true;
        input.style.opacity = "0.5";
      });
      btnSalvar.disabled = true;
      btnSalvar.style.cursor = "default";
      btnSalvar.style.opacity = "0.5";

      const usuario = JSON.parse(localStorage.getItem("usuario"));

      const preferenciasAtualizadas = [];

      inputsContainer.forEach((input) => {
        const ativo = input.checked ? "sim" : "nao";
        let fk_tela_dashboard = null;

        // Mapeia o id do input para o id da tela_dashboard
        switch (input.id) {
          case "panorama_geral":
            fk_tela_dashboard = 1;
            break;
          case "perfil_turista":
            fk_tela_dashboard = 2;
            break;
          case "sazonalidade":
            fk_tela_dashboard = 3;
            break;
        }

        if (fk_tela_dashboard) {
          preferenciasAtualizadas.push({
            fk_tela_dashboard: fk_tela_dashboard,
            fk_usuario: usuario.id,
            ativo: ativo,
          });
        }
      });

      fetch(
        `/preferenciaVisualizacaoDashboard/usuario/${usuario.id}/preferencia`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(preferenciasAtualizadas),
        }
      )
        .then((response) => {
          if (!response.ok) throw new Error("Erro ao salvar preferências");
          return response.json();
        })
        .then(() => {
          alert("Preferências salvas com sucesso!");
        })
        .catch((error) => {
          console.error("Erro ao salvar preferências:", error);
          alert("Erro ao salvar preferências");
        });
    });
  });

  const usuario = JSON.parse(localStorage.getItem("usuario"));

  console.log("Usuário carregado do localStorage:", usuario.id);

  if (usuario && usuario.id) {
    fetch(`/preferenciaVisualizacaoDashboard/usuario/${usuario.id}/preferencia`)
      .then((response) => {
        if (!response.ok)
          throw new Error("Erro ao buscar preferências do usuário");
        return response.json();
      })
      .then((preferencias) => {
        sessionStorage.setItem(
          "preferenciaUsuario",
          JSON.stringify(preferencias)
        );

        preferencias.forEach((pref) => {
          if (pref.ativo === "sim") {
            const tela = pref.tela_dashboard.tela;

            // Converte "panoramaGeral" → "panorama_geral", etc.
            const inputId = tela.replace(/([A-Z])/g, "_$1").toLowerCase();

            const checkbox = document.getElementById(inputId);
            if (checkbox) {
              checkbox.checked = true;
            }
          }
        });
      })
      .catch((error) => {
        console.error("Erro:", error);
        alert("Não foi possível carregar as preferências do usuário");
      });

    fetch(`/configuracaoSlackRoutes/usuario/${usuario.id}/configuracaoSlack`)
      .then((response) => {
        if (!response.ok)
          throw new Error("Erro ao buscar configuração do slack do usuário");
        return response.json();
      })
      .then((configuracao) => {
        sessionStorage.setItem(
          "configuracaoSlack",
          JSON.stringify(configuracao)
        );

        // A API retorna um array, então acessamos o primeiro item
        const config = configuracao[0];

        // Ativar o checkbox de notificações Slack, se 'ativo' for 'sim'
        if (config.ativo === "sim") {
          document.getElementById("ativar").checked = true;
        }

        // Preencher o canal padrão
        document.getElementById("canal_padrao").value =
          config.canal_padrao || "";

        // Desmarcar todas as etapas antes de ativar as que vieram
        const etapas = [
          "inicializacao",
          "conexao_s3",
          "extracao",
          "tratamento",
          "transformacao",
          "carregamento",
          "finalizacao",
        ];
        etapas.forEach((etapa) => {
          const checkbox = document.getElementById(etapa);
          if (checkbox) {
            checkbox.checked = false;
          }
        });

        // Marcar apenas as etapas que vieram no tipo_notificacao_dados
        config.tipo_notificacao_dados.forEach((item) => {
          const etapaNome = item.etapa.etapa; // ex: "extracao"
          const checkbox = document.getElementById(etapaNome);
          if (checkbox) {
            checkbox.checked = true;
          }
        });
      })
      .catch((error) => {
        console.error("Erro:", error);
        alert("Não foi possível carregar a configuração do slack do usuário");
      });
  }
});
