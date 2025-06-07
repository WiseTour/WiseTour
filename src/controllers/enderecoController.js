const { Endereco } = require('../models');

const EnderecoController = {
  async cadastrarEnderecoEmpresa(req, res) {
  try {
    const {
      cepServer,
      tipoLogradouroServer,
      nomeLogradouroServer,
      numeroServer,
      complementoServer,
      bairroServer,
      cidadeServer,
      siglaUfServer,
    } = req.body;

    console.log("BODY ENDEREÇO RECEBIDO:", req.body); 
    const novoEndereco = await Endereco.create({
      cep: cepServer,
      tipo_logradouro: tipoLogradouroServer,
      nome_logradouro: nomeLogradouroServer,
      numero: numeroServer,
      complemento: complementoServer,
      bairro: bairroServer,
      cidade: cidadeServer,
      fk_uf_sigla: siglaUfServer,
    });

    res.status(201).json(novoEndereco);
  } catch (error) {
    console.error('Erro ao cadastrar endereço:', error);
    res.status(500).json({ error: 'Erro ao cadastrar endereço.' });
  }
}
};

module.exports = EnderecoController;
