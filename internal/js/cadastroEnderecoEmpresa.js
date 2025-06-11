async function cadastrarEnderecoEmpresa() {
  const cepVar = empresa_cep_input.value;
  const tipoLogradouroVar = empresa_tipo_logradouro_input.value;
  const nomeLogradouroVar = empresa_nome_logradouro_input.value;
  const numeroVar = empresa_numero_input.value;
  const complementoVar = empresa_complemento_input.value;
  const bairroVar = empresa_bairro_input.value;
  const cidadeVar = empresa_cidade_input.value;
  const siglaUfVar = empresa_sigla_uf_input.value;

  // Verificando se os campos de endereço estão preenchidos
  if (
    cepVar === "" ||
    tipoLogradouroVar === "" ||
    nomeLogradouroVar === "" ||
    numeroVar === "" ||
    bairroVar === "" ||
    cidadeVar === "" ||
    siglaUfVar === ""
  ) {
    alert("Preencha todos os campos de endereço!");
    return null;
  }

  try {
    const resposta = await fetch("/endereco", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cepServer: cepVar,
        tipoLogradouroServer: tipoLogradouroVar,
        nomeLogradouroServer: nomeLogradouroVar,
        numeroServer: numeroVar,
        complementoServer: complementoVar,
        bairroServer: bairroVar,
        cidadeServer: cidadeVar,
        siglaUfServer: siglaUfVar
      }),
    });

    const data = await resposta.json();

    if (resposta.ok) {
        return {
        id_endereco: data.id_endereco,
        siglaUf: siglaUfVar
      };
      
    } else {
      alert("Erro ao cadastrar endereço!");
      return null;
    }
  } catch (erro) {
    console.error("#ERRO ao cadastrar endereço: ", erro);
    return null;
  }
}