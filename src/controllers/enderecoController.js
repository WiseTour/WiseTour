const { Empresa, Endereco } = require('../models');

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
},
  async editarEndereco(req, res) {
  try {
    const {
      cnpjServer,
      cepServer,
      tipoLogradouroServer,
      nomeLogradouroServer,
      numeroServer,
      complementoServer,
      bairroServer,
      cidadeServer,
      siglaUfServer
    } = req.body;

    console.log("BODY ENDEREÇO RECEBIDO:", req.body);
    // Pegando a empresa para descobrir qual o id do endereço
    const empresa = await Empresa.findByPk(cnpjServer, {
      include: Endereco
    });

    if (!empresa || !empresa.fk_endereco) {
      return res.status(404).json({ error: 'Endereço da empresa não encontrado.' });
    }

    const endereco = await Endereco.findByPk(empresa.fk_endereco);

    if (!endereco) {
      return res.status(404).json({ error: 'Endereço não encontrado.' });
    }

    await endereco.update({
      cep: cepServer,
      tipo_logradouro: tipoLogradouroServer,
      nome_logradouro: nomeLogradouroServer,
      numero: numeroServer,
      complemento: complementoServer,
      bairro: bairroServer,
      cidade: cidadeServer,
      fk_uf_sigla: siglaUfServer
    });

    return res.status(200).json({ message: 'Endereço atualizado com sucesso.' });
  } catch (error) {
    console.error('Erro ao editar endereço:', error);
    return res.status(500).json({ error: 'Erro ao editar endereço.' });
  }
}

};

module.exports = EnderecoController;
