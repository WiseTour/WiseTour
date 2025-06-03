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


module.exports = {
  getFuncionarioByFkUsuario
};
