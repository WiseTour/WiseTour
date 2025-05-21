function excluirEmpresa() {

    
    var cnpjVar = excluir_empresa_cnpj_input.value;
    
  
    // Verificando se há algum campo em branco
    if (
      cnpjVar == ""
    ) {
      alert("CNPJ em branco")
  
      return false;
    }
  
    fetch("/internalRoutes/excluirEmpresa", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cnpjServer: cnpjVar
      }),
    })
      .then(function (resposta) {
        console.log("resposta: ", resposta);
  
        if (resposta.ok) {
          alert ("Empresa excluída com sucesso!!!")
          limparFormulario();
        } else {
          return resposta.text().then(mensagem => {
            alert("Erro: " + mensagem);
        });
        }
      })
      .catch(function (resposta) {
        console.log(`#ERRO: ${resposta}`);
      });
  
    return false;
  }