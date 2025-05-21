function cadastrar() {
  // Recupera os valores dos inputs
  var nomeCompletoVar = nome_completo_input.value;
  var emailVar = email_input.value;
  var numeroUsuarioVar = numero_usuario_input.value;

  // Verificando se há algum campo em branco
  if (
    nomeCompletoVar == "" ||
    emailVar == "" ||
    numeroUsuarioVar == ""
  ) {
    cardErro.style.display = "block";
    mensagem.innerHTML =
      "<b>[Atenção]</b> <br><br> Existem campos de cadastro <br> em branco.";
    setTimeout(sumirMensagem, 3000);
    return false;
  } else if (!emailVar.includes("@") || !emailVar.includes(".com")) {
    cardErro.style.display = "block";
    mensagem.innerHTML =
      "<b>[Atenção]</b> <br><br> O campo e-mail <br> não é válido.";
    setTimeout(sumirMensagem, 3000);
    return false;
  } else if (nomeCompletoVar.length < 8) {
    cardErro.style.display = "block";
    mensagem.innerHTML =
      "<b>[Atenção]</b> <br><br> O campo nome <br> deve conter ao mínimo 8 caracteres.";
    setTimeout(sumirMensagem, 3000);
    return false;
  } else if (numeroUsuarioVar.length < 11) {
    cardErro.style.display = "block";
    mensagem.innerHTML =
      "<b>[Atenção]</b> <br><br> O campo número <br> deve conter ao mínimo 11 caracteres.";
    setTimeout(sumirMensagem, 3000);
    return false;
  } else {
    setInterval(sumirMensagem, 5000);
  }

  // Envia os dados para o servidor
  fetch("/usuarios/cadastrar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nomeServer: nomeCompletoVar,
      emailServer: emailVar,
      numeroUsuarioServer: numeroUsuarioVar,
    }),
  })
    .then(function (resposta) {
      console.log("resposta: ", resposta);

      if (resposta.ok) {
        const popup = document.getElementById("popUpCadastro");
        const overlay = document.getElementById("overlay");

        document.body.classList.add('popup-active');

        popup.style.display = "block";
        overlay.style.display = "block";

        setTimeout(() => {
          popup.style.display = "none";
          overlay.style.display = "none";
          document.body.classList.remove('popup-active');
          window.location.href = "login.html";
        }, 3000);

        limparFormulario();
      } else {
        throw "Houve um erro ao tentar realizar o cadastro!";
      }
    })
    .catch(function (resposta) {
      console.log(`#ERRO: ${resposta}`);
    });

  return false;
}

function sumirMensagem() {
  cardErro.style.display = "none";
}
