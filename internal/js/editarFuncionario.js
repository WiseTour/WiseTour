function editarFuncionario() {
  var nomeFuncionarioVar = editar_funcionario_nome_input.value;
  var nomeNovoFuncionarioVar = editar_funcionario_nome_novo_input.value;
  var cargoVar = editar_funcionario_cargo_input.value;
  var telefoneVar = editar_funcionario_telefone_input.value;
  var cnpjEmpresaVar = editar_funcionario_cnpj__novo_empresa_input.value;
  var idInformacaoVar = editar_funcionario_id_informacao_input.value;
  var siglaUfVar = editar_funcionario_sigla_uf_input.value;

  // Verificando se há algum campo em branco
  if (
    nomeFuncionarioVar == "" ||
    nomeNovoFuncionarioVar == "" ||
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
      nomeServer: nomeFuncionarioVar,
      nomeNovoServer: nomeNovoFuncionarioVar,
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
        alert("Erro ao editar o funcionário! Verifique as informações passadas!")
        throw "Houve um erro ao tentar realizar a edição do funcionário!";
      }
    })
    .catch(function (resposta) {
      console.log(`#ERRO: ${resposta}`);
    });

  return false;
}
