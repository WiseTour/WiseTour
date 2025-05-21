function cadastrarEmpresa() {

   
    var cnpjVar = empresa_cnpj_input.value;
    var nomeFantasiaVar = empresa_nome_fantasia_input.value;
    var razaoSocialVar = empresa_razao_social_input.value;
    var idInformacaoCadastroVar = informacao_cadastro_id_input.value;
    var cepVar = empresa_cep_input.value;
    var tipoLogradouroVar = empresa_tipo_logradouro_input.value;
    var nomeLogradouroVar = empresa_nome_logradouro_input.value;
    var numeroVar = empresa_numero_input.value;
    var complementoVar = empresa_complemento_input.value;
    var bairroVar = empresa_bairro_input.value;
    var cidadeVar = empresa_cidade_input.value;
    var siglaUfVar = empresa_sigla_uf_input.value;  
  
    // Verificando se há algum campo em branco
    if (
      cnpjVar == "" ||
      nomeFantasiaVar == "" ||
      razaoSocialVar == "" ||
      idInformacaoCadastroVar == "" ||
      cepVar == "" ||
      tipoLogradouroVar == "" ||
      nomeLogradouroVar == "" ||
      numeroVar == "" ||
      complementoVar == "" ||
      bairroVar == "" ||
      cidadeVar == "" ||
      siglaUfVar == ""
    ) {
      alert("Mensagem de erro para todos os campos em branco")
  
      return false;
    }
  
    fetch("/internalRoutes/cadastrarEmpresa", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // crie um atributo que recebe o valor recuperado aqui
        // Agora vá para o arquivo routes/usuario.js
        cnpjServer: cnpjVar,
        nomeFantasiaServer: nomeFantasiaVar,
        razaoSocialServer: razaoSocialVar,
        idInformacaoCadastroServer: idInformacaoCadastroVar,
        cepServer: cepVar,
        tipoLogradouroServer: tipoLogradouroVar,
        nomeLogradouroServer: nomeLogradouroVar,
        numeroServer: numeroVar,
        complementoServer: complementoVar,
        bairroServer: bairroVar,
        cidadeServer: cidadeVar,
        siglaUfServer: siglaUfVar
      }),
    })
      .then(function (resposta) {
        console.log("resposta: ", resposta);
  
        if (resposta.ok) {
          alert ("Cadastro Empresa realizado com sucesso!!!")
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