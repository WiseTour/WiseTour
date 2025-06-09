  const Funcionario = require('../models/Funcionario');
  const Usuario = require('../models/Usuario');

  const getFuncionarioByFkUsuario = async (req, res) => {
    try {
      const { fkUsuario } = req.params;

      const funcionario = await Funcionario.findOne({
        where: { fk_usuario: fkUsuario },
        include: {
          model: Usuario,
          as: 'usuario', // mesma alias usada no belongsTo
          attributes: ['id_usuario', 'email', 'permissao'] // ajuste os campos que quiser trazer do usuário
        }
      });

      if (!funcionario) {
        return res.status(404).json({ message: 'Funcionário não encontrado para o usuário informado.' });
      }

      res.json(funcionario);
    } catch (error) {
      console.error('Erro ao buscar funcionário por fkUsuario:', error);
      res.status(500).json({ message: 'Erro no servidor.' });
    }
  };

  const criarFuncionario = async (req, res) => {
    try {
      const {
        nome,
        cargo,
        telefone,
        fk_cnpj,
        fk_informacao_contato_cadastro,
        fk_uf_sigla,
        fk_endereco,
        fk_usuario
      } = req.body;

      console.log("BODY FUNCIONÁRIO RECEBIDO:", req.body)

      const novoFuncionario = await Funcionario.create({
        nome,
        cargo,
        telefone,
        fk_cnpj,
        fk_informacao_contato_cadastro,
        fk_uf_sigla,
        fk_endereco,
        fk_usuario
      });

      res.status(201).json(novoFuncionario);
    } catch (error) {
      console.error('Erro ao criar funcionário:', error);
      res.status(500).json({ message: 'Erro no servidor.' });
    }
  };

const atualizarFuncionario = async (req, res) => {
    try {
      const { id_funcionario } = req.params;

      const [linhasAfetadas] = await Funcionario.update(req.body, {
        where: { id_funcionario }
    });

    if (linhasAfetadas === 0) {
      return res.status(404).json({ message: 'Funcionário não encontrado.' });
    }

    console.log("BODY FUNCIONARIO RECEBIDO:", req.body)

    res.status(200).json({ message: 'Funcionário atualizado com sucesso.' });
  } catch (error) {
    console.error('Erro ao atualizar funcionário:', error);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

const excluirFuncionario = async (req, res) => {
  try {
    const { nomeFuncionarioServer, cnpjEmpresaServer } = req.body;

    // Verificação se os campos foram enviados
    if (!nomeFuncionarioServer || !cnpjEmpresaServer) {
      return res.status(400).json({ message: 'Nome do funcionário e CNPJ da empresa são obrigatórios.' });
    }

    const funcionarioExcluido = await Funcionario.destroy({
      where: {
        nome: nomeFuncionarioServer,
        fk_cnpj: cnpjEmpresaServer
      }
    });

    if (funcionarioExcluido === 0) {
      return res.status(404).json({ message: 'Funcionário não encontrado com os dados informados.' });
    }

    console.log("BODY FUNCIONARIO RECEBIDO:", req.body)

    res.status(200).json({ message: 'Funcionário excluído com sucesso.' });
  } catch (error) {
    console.error('Erro ao excluir funcionário:', error);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};


module.exports = {  
  getFuncionarioByFkUsuario,
  criarFuncionario,
  atualizarFuncionario,
  excluirFuncionario
};
