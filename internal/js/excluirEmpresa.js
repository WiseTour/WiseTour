async function excluirEmpresa() {
  var cnpjVar = excluir_empresa_cnpj_input.value;

  if (cnpjVar == "") {
    alert("CNPJ em branco");
    return false;
  }

  try {
    const resposta = await fetch(`/empresa/${cnpjVar}`, {
      method: "DELETE",
    });

    const data = await resposta.json();

    if (resposta.ok) {
      alert("Empresa excluída com sucesso");
      limparFormulario();
    } else {
      alert(data.error || "Erro ao excluir empresa");
    }
  } catch (erro) {
    console.error("Erro ao excluir empresa", erro);
  }
}