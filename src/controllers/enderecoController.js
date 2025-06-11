const { Model } = require('sequelize');
const { empresa, endereco: EnderecoModel   } = require('../models');

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
    const novoEndereco = await EnderecoModel.create({
      cep: cepServer,
      tipo_logradouro: tipoLogradouroServer,
      nome_logradouro: nomeLogradouroServer,
      numero: numeroServer,
      complemento: complementoServer,
      bairro: bairroServer,
      cidade: cidadeServer,
      fk_uf_sigla: siglaUfServer,
    });

    console.log("BODY NOVO ENDEREÇO RECEBIDO:", novoEndereco);

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
    const buscarEmpresa = await empresa.findByPk(cnpjServer, {
      include:{
        model: EnderecoModel,
        as: 'endereco'
      } 
    });

    if (!buscarEmpresa || !buscarEmpresa.fk_endereco) {
      return res.status(404).json({ error: 'Endereço da empresa não encontrado.' });
    }

    const enderecoEncontrado = buscarEmpresa.endereco;

    if (!enderecoEncontrado) {
      return res.status(404).json({ error: 'Endereço não encontrado.' });
    }

    await enderecoEncontrado.update({
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