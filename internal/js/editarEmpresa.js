function editarInformacoesEmpresariais(){

    var cnpjVar = editar_informacoes_empresariais_cnpj_input.value;
    var cnpjNovoVar = editar_informacoes_empresariais_novo_cnpj_input.value;
    var nomeFantasiaVar = editar_informacoes_empresariais_nome_fantasia_input.value;
    var razaoSocialVar = editar_informacoes_empresariais_razao_social_input.value;
    

    console.log("cnpj:", cnpjVar);
console.log("cnpjNovo:", cnpjNovoVar);
console.log("nomeFantasia:", nomeFantasiaVar);
console.log("razaoSocial:", razaoSocialVar);
  
    // Verificando se há algum campo em branco
    if (
      cnpjVar == "" ||
      cnpjNovoVar == "" ||
      nomeFantasiaVar == "" ||
      razaoSocialVar == ""
      
    ) {
      alert("Mensagem de erro para todos os campos em branco")
  
      return false;
    }
  
    fetch("/internalRoutes/editarInformacoesEmpresariaisEmpresa", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cnpjServer: cnpjVar,
        cnpjNovoServer: cnpjNovoVar,
        nomeFantasiaServer: nomeFantasiaVar,
        razaoSocialServer: razaoSocialVar
        
      }),
    })
      .then(function (resposta) {
        console.log("resposta: ", resposta);
  
        if (resposta.ok) {
          alert ("Informações empresariais alteradas com sucesso!!!")
          limparFormulario();
        } else {
          return resposta.text().then(mensagem => {
            alert("Erro: " + mensagem);
        });
        }
      })
      .catch(function (resposta) {
        console.log(`#ERRO: ${resposta}`);
      });
  
    return false;
  }

  function editarEnderecoEmpresa() {

   
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
      alert("Mensagem de erro para todos os campos em branco")
  
      return false;
    }
  
    fetch("/internalRoutes/editarEnderecoEmpresa", {
      method: "POST",
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
      }),
    })
      .then(function (resposta) {
        console.log("resposta: ", resposta);
  
        if (resposta.ok) {
          alert ("Endereco alterado com sucesso!!!")
          limparFormulario();
        } else {
          return resposta.text().then(mensagem => {
            alert("Erro: " + mensagem);
        });
        }
      })
      .catch(function (resposta) {
        console.log(`#ERRO: ${resposta}`);
      });
  
    return false;
  }