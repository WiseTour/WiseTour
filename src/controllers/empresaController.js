const { where } = require('sequelize');
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
},
  async editarEmpresa(req, res) {
  try {
    const {
      cnpjServer,
      nomeFantasiaServer,
      razaoSocialServer
    } = req.body;

    console.log("BODY EMPRESA RECEBIDO:", req.body)
    const atualizarEmpresa = await Empresa.findOne({where: {cnpj: cnpjServer}});

    if (!atualizarEmpresa) {
      return res.status(404).json({ error: 'Empresa não encontrada.' });
    }

    await atualizarEmpresa.update({
      nome_fantasia: nomeFantasiaServer,
      razao_social: razaoSocialServer
    },{
      where: {cnpj: cnpjServer}
    });

    return res.status(200).json({ message: 'Empresa atualizada com sucesso.' });
  } catch (error) {
    console.error('Erro ao editar empresa:', error);
    return res.status(500).json({ error: 'Erro ao editar empresa.' });
  }
},

  async excluirEmpresa(req, res) {
  try {
    const { cnpj } = req.params;

    const empresa = await Empresa.findByPk(cnpj);

    if (!empresa) {
      return res.status(404).json({ error: 'Empresa não encontrada.' });
    }

    await empresa.destroy();

    return res.status(200).json({ message: 'Empresa excluída com sucesso.' });
  } catch (error) {
    console.error('Erro ao excluir empresa:', error);
    return res.status(500).json({ error: 'Erro ao excluir empresa.' });
  }
}
};

module.exports = EmpresaController;