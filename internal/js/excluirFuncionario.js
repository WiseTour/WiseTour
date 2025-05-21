function excluirFuncionario() {

  var idFuncionarioVar = excluir_funcionario_id_input.value;
  var cnpjEmpresaVar = excluir_funcionario_cnpj_empresa_input.value;

  // Verificando se há algum campo em branco
  if (
    idFuncionarioVar == "" ||
    cnpjEmpresaVar == ""
  ) {
    alert("Mensagem de erro para todos os campos em branco");
    return false;
  }

  fetch("/internalRoutes/excluirFuncionario", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      idServer: idFuncionarioVar,
      cnpjEmpresaServer: cnpjEmpresaVar,
    }),
  })
    .then(function (resposta) {
      console.log("resposta: ", resposta);

      if (resposta.ok) {
        alert ("Funcionário excluído com sucesso!!!")

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
