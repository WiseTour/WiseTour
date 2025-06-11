async function cadastrarEmpresa() {
  const enderecoVar = endereco_id_input.value;
  const cnpjVar = empresa_cnpj_input.value;
  const idInformacaoCadastroVar = informacao_cadastro_id_input.value;
  const nomeFantasiaVar = empresa_nome_fantasia_input.value;
  const razaoSocialVar = empresa_razao_social_input.value;

  if (cnpjVar === "" || idInformacaoCadastroVar === "" || nomeFantasiaVar == "" || razaoSocialVar == "") {
    alert("Preencha todos os campos da empresa!");
    return;
  }

  const enderecoCriado = await cadastrarEnderecoEmpresa();
  if (!enderecoCriado) {
    return; // Erro no cadastro de endereço
  }

  try {
    const resposta = await fetch("/empresa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        enderecoServer: enderecoVar,
        cnpjServer: cnpjVar,
        idInformacaoCadastroServer: idInformacaoCadastroVar,
        nomeFantasiaServer: nomeFantasiaVar,
        razaoSocialServer: razaoSocialVar,
        idEnderecoServer: enderecoCriado.id_endereco,
        siglaUfServer: enderecoCriado.siglaUf
      }),
    });

    if (resposta.ok) {
      alert("Cadastro da empresa realizado com sucesso!");
      limparFormulario();
    } else {
      alert("Erro ao cadastrar empresa!");
    }
  } catch (erro) {
    console.error("#ERRO ao cadastrar empresa: ", erro);
  }
}