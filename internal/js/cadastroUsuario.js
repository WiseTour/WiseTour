function cadastrarUsuario() {
    //Recupere o valor da nova input pelo nome do id
    // Agora vá para o método fetch logo abaixo
    var email = usuario_email_input.value;
    var senha = usuario_senha_input.value;
    var permissao = usuario_permissao_input.value;
     
  
    // Verificando se há algum campo em branco
    if (
      email == "" ||
      senha == "" ||
      permissao == ""
    ){
      alert("Mensagem de erro para todos os campos em branco")
  
      return false;
    }
  
    fetch("/usuario", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // crie um atributo que recebe o valor recuperado aqui
        // Agora vá para o arquivo routes/usuario.js
        email: email,
        senha: senha,
        permissao: permissao
      }),
    })
      .then(function (resposta) {
        console.log("resposta: ", resposta);
  
        if (resposta.ok) {
          alert("Cadastro do funcionário realizado com sucesso");
          cardErro.style.display = "block";
  
          mensagem_erro.innerHTML =
            "Cadastro realizado com sucesso! Redirecionando para tela de Login...";
  
          setTimeout(() => {
            window.location = "login.html";
          }, "2000");
  
          limparFormulario();
        } else {
          alert("Erro ao realizar cadastro do usuário! Verifique as informações passadas!")
          throw "Houve um erro ao tentar realizar o cadastro do usuário!";
        }
      })
      .catch(function (resposta) {
        console.log(`#ERRO: ${resposta}`);
      });
  
    return false;
  }