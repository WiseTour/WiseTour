async function editarEnderecoEmpresa() {
    var cnpjVar = editar_endereco_cnpj_input.value;
    var cepVar = editar_endereco_cep_input.value;
    var tipoLogradouroVar = editar_endereco_tipo_logradouro_input.value;
    var nomeLogradouroVar = editar_endereco_nome_logradouro_input.value;
    var numeroVar = editar_endereco_numero_input.value;
    var complementoVar = editar_endereco_complemento_input.value;
    var bairroVar = editar_endereco_bairro_input.value;
    var cidadeVar = editar_endereco_cidade_input.value;
    var siglaUfVar = editar_endereco_sigla_uf_input.value;  
  
    // Verificando se há algum campo em branco
    if (
      cnpjVar == "" ||
      cepVar == "" ||
      tipoLogradouroVar == "" ||
      nomeLogradouroVar == "" ||
      numeroVar == "" ||
      complementoVar == "" ||
      bairroVar == "" ||
      cidadeVar == "" ||
      siglaUfVar == ""
    ) {
      alert("Preencha todos os campos em branco")
  
      return false;
    }
  
    try
    {
        const resposta = await fetch("/endereco", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                cnpjServer: cnpjVar,
                cepServer: cepVar,
                tipoLogradouroServer: tipoLogradouroVar,
                nomeLogradouroServer: nomeLogradouroVar,
                numeroServer: numeroVar,
                complementoServer: complementoVar,
                bairroServer: bairroVar,
                cidadeServer: cidadeVar,
                siglaUfServer: siglaUfVar
            })
        });
    const data = await resposta.json();
    if (resposta.ok)
    {
        alert("Endereço da empresa alterado com sucesso");
        limparFormulario();
    } else
    {
        alert("#ERRO ao atualizar endereço da empresa")
    }

    } catch (erro)
    {
        console.error("Erro ao atualizar endereço da empresa");
    }
}