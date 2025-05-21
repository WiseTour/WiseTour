function cadastrarUsuario() {

    //Recupere o valor da nova input pelo nome do id
    // Agora vá para o método fetch logo abaixo
    var emailUsuarioVar = usuario_email_input.value;
    var senhaUsuarioVar = usuario_senha_input.value;
    var permissaoUsuarioVar = usuario_permissao_input.value;
     
  
    // Verificando se há algum campo em branco
    if (
      emailUsuarioVar == "" ||
      senhaUsuarioVar == "" ||
      permissaoUsuarioVar == ""
    ){
      alert("Mensagem de erro para todos os campos em branco")
  
      return false;
    }
  
    fetch("/internal/cadastrarUsuario", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // crie um atributo que recebe o valor recuperado aqui
        // Agora vá para o arquivo routes/usuario.js
        emailUsuarioServer: emailUsuarioVar,
        senhaUsuarioServer: senhaUsuarioVar,
        permissaoUsuarioServer: permissaoUsuarioVar
      }),
    })
      .then(function (resposta) {
        console.log("resposta: ", resposta);
  
        if (resposta.ok) {
          cardErro.style.display = "block";
  
          mensagem_erro.innerHTML =
            "Cadastro realizado com sucesso! Redirecionando para tela de Login...";
  
          setTimeout(() => {
            window.location = "login.html";
          }, "2000");
  
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