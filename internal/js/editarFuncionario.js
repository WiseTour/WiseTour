function editarFuncionario() {
  var id_funcionario = editar_id_funcionario_input.value;
  var nomeNovoFuncionarioVar = editar_funcionario_nome_novo_input.value;
  var cargoVar = editar_funcionario_cargo_input.value;
  var telefoneVar = editar_funcionario_telefone_input.value;
  var cnpjEmpresaVar = editar_funcionario_cnpj__novo_empresa_input.value;
  var idInformacaoVar = editar_funcionario_id_informacao_input.value;
  var siglaUfVar = editar_funcionario_sigla_uf_input.value;

  // Verificando se há algum campo em branco
  if (
    id_funcionario == "" ||
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

  fetch(`/funcionario/${id_funcionario}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nome: nomeNovoFuncionarioVar,
      cargo: cargoVar,
      telefone: telefoneVar,
      fk_cnpj: cnpjEmpresaVar,
      fk_informacao_contato_cadastro: idInformacaoVar,
      fk_uf_sigla: siglaUfVar,
      fk_endereco: 1,
      fk_usuario: 1
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