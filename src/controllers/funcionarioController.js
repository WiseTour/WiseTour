// src/controllers/funcionario.js
const Funcionario = require('../models/funcionario');
const Usuario = require('../models/usuario');

const getFuncionarioByFkUsuario = async (req, res) => {
  try {
    const { fkUsuario } = req.params;
    console.log('Buscando funcionário para fkUsuario:', fkUsuario);

    const funcionario = await Funcionario.findOne({
      where: { fk_usuario: fkUsuario },
      include: [{
        model: Usuario,
        as: 'usuario',
        attributes: ['id_usuario', 'email', 'permissao']
      }]
    });

    if (!funcionario) {
      console.log('Nenhum funcionário encontrado para fkUsuario:', fkUsuario);
      return res.status(404).json({ 
        success: false,
        message: 'Funcionário não encontrado.' 
      });
    }

    console.log('Funcionário encontrado:', JSON.stringify(funcionario, null, 2));
    res.json({
      success: true,
      data: funcionario
    });
  } catch (error) {
    console.error('Erro ao buscar funcionário:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erro no servidor.',
      error: error.message 
    });
  }
};

module.exports = {
  getFuncionarioByFkUsuario
};
