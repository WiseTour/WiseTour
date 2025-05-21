function editarUsuario() {

    var emailUsuarioVar = editar_usuario_email_input.value;
    var emailNovoUsuarioVar = editar_usuario_email_novo_input.value;
    var idFuncionarioVar = editar_usuario_id_funcionario_input.value;
    var senhaUsuarioVar = editar_usuario_senha_input.value;
    var permissaoUsuarioVar = editar_usuario_permissao_input.value;
     
  
    // Verificando se há algum campo em branco
    if (
      emailUsuarioVar == "" ||
      emailNovoUsuarioVar == "" ||
      idFuncionarioVar == "" ||
      senhaUsuarioVar == "" ||
      permissaoUsuarioVar == ""
    ){
      alert("Mensagem de erro para todos os campos em branco")
  
      return false;
    }
  
    fetch("/internalRoutes/editarUsuario", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        emailNovoUsuarioServer: emailNovoUsuarioVar,
        emailUsuarioServer: emailUsuarioVar,
        idFuncionarioServer : idFuncionarioVar,
        senhaUsuarioServer: senhaUsuarioVar,
        permissaoUsuarioServer: permissaoUsuarioVar
      }),
      
    })
      .then(function (resposta) {
        console.log("resposta: ", resposta);
  
       if (resposta.ok) {
        alert ("Cadastro do usuário atualizado!!!")

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