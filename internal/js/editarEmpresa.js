async function editarInformacoesEmpresariais() {
    var cnpjVar = editar_informacoes_empresariais_cnpj_input.value;
    var nomeFantasiaVar = editar_informacoes_empresariais_nome_fantasia_input.value;
    var razaoSocialVar = editar_informacoes_empresariais_razao_social_input.value;
  
    // Verificando se há algum campo em branco
    if (
      cnpjVar == "" ||
      nomeFantasiaVar == "" ||
      razaoSocialVar == ""
    ) {
      alert("Preencha todos os campos em branco")
      return false;
    }
  
  try
  {
    const resposta = await fetch("/empresa", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cnpjServer: cnpjVar,
        nomeFantasiaServer: nomeFantasiaVar,
        razaoSocialServer: razaoSocialVar
      }),
    });
    const data = await resposta.json();
    if (resposta.ok)
    {
      alert("Informações empresariais alteradas com sucesso");
      limparFormulario();
    } else
    {
      alert("Erro ao atualizar informações empresariais")
    }
  } catch (erro)
  {
    console.error("#ERRO ao atualizar informações da empresa");
  }
}