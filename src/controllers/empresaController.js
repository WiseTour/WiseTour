const { Empresa } = require('../models');

const EmpresaController = {
  async cadastrarEmpresa(req, res) {
  try {
    const {
      enderecoServer,
      cnpjServer,
      idInformacaoCadastroServer,
      nomeFantasiaServer,
      razaoSocialServer,
      siglaUfServer,
    } = req.body;

    console.log("BODY EMPRESA RECEBIDO:", req.body); 
    const novaEmpresa = await Empresa.create({
      fk_endereco: enderecoServer,
      cnpj: cnpjServer,
      fk_informacao_contato_cadastro: idInformacaoCadastroServer,
      nome_fantasia: nomeFantasiaServer,
      razao_social: razaoSocialServer,
      fk_uf_sigla: siglaUfServer,
    });

    res.status(201).json(novaEmpresa);
  } catch (error) {
    console.error('Erro ao cadastrar empresa:', error);
    res.status(500).json({ error: 'Erro ao cadastrar empresa.' });
  }
}
};

module.exports = EmpresaController;