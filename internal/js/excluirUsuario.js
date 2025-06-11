function excluirUsuario() {

    var emailUsuarioVar = excluir_usuario_email_input.value;
   
  
    // Verificando se há algum campo em branco
    if (
      emailUsuarioVar == ""
    ){
      alert("Mensagem de erro para todos os campos em branco")
  
      return false;
    }
  
    fetch("/usuario", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        emailUsuarioServer: emailUsuarioVar
      }),
      
    })
      .then(function (resposta) {
        console.log("resposta: ", resposta);
  
       if (resposta.ok) {
        alert ("Cadastro do usuário excluído!!!")

        limparFormulario();
      } else {
        alert("Erro ao excluir o usuário! Verifique as informações passadas!")
        throw "Houve um erro ao tentar excluir o usuário!";
      }
      })
      .catch(function (resposta) {
        console.log(`#ERRO: ${resposta}`);
      });
  
    return false;
  }