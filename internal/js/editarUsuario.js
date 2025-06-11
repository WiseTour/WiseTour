function editarUsuario() {
    var id_usuario = editar_id_usuario_email_input.value;
    var emailNovo = editar_usuario_email_novo_input.value;
    var idFuncionario = editar_usuario_id_responsavel_input.value;
    var senha = editar_usuario_senha_input.value;
    var permissao = editar_usuario_permissao_input.value;
     
  
    // Verificando se há algum campo em branco
    if (
      id_usuario == "" ||
      emailNovo == "" ||
      idFuncionario == "" ||
      senha == "" ||
      permissao == ""
    ){
      alert("Mensagem de erro para todos os campos em branco")
  
      return false;
    }
  
    fetch(`/usuario/${id_usuario}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: emailNovo,
        id_usuario: id_usuario,
        idFuncionario: idFuncionario,
        senha: senha,
        permissao: permissao
      }),
      
    })
      .then(function (resposta) {
        console.log("resposta: ", resposta);
  
       if (resposta.ok) {
        alert ("Cadastro do usuário atualizado com sucesso!")

        limparFormulario();
      } else {
        alert("Erro ao editar o usuário! Verifique as informações passadas!")
        throw "Houve um erro ao tentar realizar a edição do usuário!";
      }
      })
      .catch(function (resposta) {
        console.log(`#ERRO: ${resposta}`);
      });
  
    return false;
  }