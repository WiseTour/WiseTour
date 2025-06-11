async function cadastrarEmpresaCompleta() {
  try {
    await cadastrarEmpresa();              // Espera cadastrar empresa
    alert("Empresa e endereço cadastrados com sucesso!");
  } catch (erro) {
    console.error("Erro no cadastro:", erro);
    alert("Houve um erro ao cadastrar.");
  }
}