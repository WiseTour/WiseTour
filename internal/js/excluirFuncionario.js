function excluirFuncionario() {
  var nomeFuncionarioVar = excluir_funcionario_nome_input.value;
  var cnpjEmpresaVar = excluir_funcionario_cnpj_empresa_input.value;

  // Verificando se há algum campo em branco
  if (
    nomeFuncionarioVar == "" ||
    cnpjEmpresaVar == ""
  ) {
    alert("Mensagem de erro para todos os campos em branco");
    return false;
  }

  fetch("/funcionario", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nomeFuncionarioServer: nomeFuncionarioVar,
      cnpjEmpresaServer: cnpjEmpresaVar,
    }),
  })
    .then(function (resposta) {
      console.log("resposta: ", resposta);

      if (resposta.ok) {
        alert ("Funcionário excluído com sucesso!!!")

        limparFormulario();
      } else {
        alert("Erro ao excluir o funcionário! Verifique as informações passadas!")
        throw "Houve um erro ao tentar excluir o funcionario!";
      }
    })
    .catch(function (resposta) {
      console.log(`#ERRO: ${resposta}`);
    });

  return false;
}