function editarFuncionario() {
 var idVar = editar_funcionario_id_input.value;
  var nomeFuncionarioVar = editar_funcionario_nome_novo_input.value;
  var cargoVar = editar_funcionario_cargo_input.value;
  var telefoneVar = editar_funcionario_telefone_input.value;
  var cnpjEmpresaVar = editar_funcionario_cnpj__novo_empresa_input.value;
  var idInformacaoVar = editar_funcionario_id_informacao_input.value;
  var siglaUfVar = editar_funcionario_sigla_uf_input.value;

  // Verificando se há algum campo em branco
  if (idVar == "" ||
    nomeFuncionarioVar == "" ||
    cargoVar == "" ||
    telefoneVar == "" ||
    cnpjEmpresaVar == "" ||
    idInformacaoVar == "" ||
    siglaUfVar == ""
  ) {
    alert("Mensagem de erro para todos os campos em branco");
    return false;
  }

  fetch("/internalRoutes/editarFuncionario", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      idServer : idVar,
      nomeServer: nomeFuncionarioVar,
      cargoServer: cargoVar,
      telefoneServer: telefoneVar,
      cnpjEmpresaServer: cnpjEmpresaVar,
      idInformacaoServer: idInformacaoVar,
      siglaUfServer: siglaUfVar
    }),
  })
    .then(function (resposta) {
      console.log("resposta: ", resposta);

      if (resposta.ok) {
        alert ("Edição do cadastro do funcionário realizado!!!")

        limparFormulario();
      } else {
        throw "Houve um erro ao tentar realizar a edição do cadastro!";
      }
    })
    .catch(function (resposta) {
      console.log(`#ERRO: ${resposta}`);
    });

  return false;
}
