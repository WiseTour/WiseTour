document.addEventListener("DOMContentLoaded", () => {
    const botoesCabecalho = document.querySelectorAll(".cabecalho button");
    const containers = document.querySelectorAll(".left_container_container");
    const botoesEditar = document.querySelectorAll(".btn_editar");
    const botoesSalvar = document.querySelectorAll(".btn_salvar");
    const botoesApagar = document.querySelectorAll(".btn_apagar");
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

            // Aqui você pode incluir o código para enviar os dados para o servidor, se necessário.
            console.log("Preferências salvas!");
        });
    });

    // Apagar: desmarcar todos os checkboxes e limpar os textos
    botoesApagar.forEach((btnApagar) => {
        btnApagar.addEventListener("click", () => {
            const container = btnApagar.closest(".left_container_container");
            const inputsContainer = container.querySelectorAll("input");

            inputsContainer.forEach((input) => {
                if (input.type === "checkbox") {
                    input.checked = false;
                } else if (input.type === "text") {
                    input.value = "";
                }
            });

            console.log("Preferências apagadas!");
        });
    });
});
