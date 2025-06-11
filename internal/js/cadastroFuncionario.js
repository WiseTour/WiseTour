function cadastrarFuncionario() {
  var nomeFuncionarioVar = cadastro_funcionario_nome_input.value;
  var cargoVar = cadastro_funcionario_cargo_input.value;
  var telefoneVar = cadastro_funcionario_telefone_input.value;
  var cnpjEmpresaVar = cadastro_funcionario_cnpj_empresa_input.value;
  var idInformacaoVar = cadastro_funcionario_id_informacao_input.value;
  var siglaUfVar = cadastro_funcionario_sigla_uf_input.value;

  // Verificando se há algum campo em branco
  if (
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

  fetch("/funcionario", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nome: nomeFuncionarioVar,
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
        alert ("Cadastro do funcionário realizado!!!")

        limparFormulario();
      } else {
        alert("Erro ao realizar cadastro do funcionário! Verifique as informações passadas!")
        throw "Houve um erro ao tentar realizar o cadastro do funcionário!";
      }
    })
    .catch(function (resposta) {
      console.log(`#ERRO: ${resposta}`);
    });

  return false;
}