const Usuario = require("../models/Usuario");
const Funcionario = require("../models/Funcionario");

const getUsuarioComFuncionario = async (req, res) => {
  const idUsuario = req.params.id;

  try {
    const usuario = await Usuario.findOne({
      where: { id_usuario: idUsuario },
      include: [{ model: Funcionario, as: 'funcionario' }]
    });

    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    return res.json(usuario);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};


async function autenticar(req, res) {
  const { emailServer, senhaServer } = req.body;

  if (!emailServer || !senhaServer) {
    return res.status(400).send("Email ou senha não fornecidos");
  }

  try {
    const usuarios = await Usuario.findAll({
      where: {
        email: emailServer,
        senha: senhaServer,
      },
    });

    if (usuarios.length === 1) {
      const usuario = usuarios[0].get({ plain: true });
      delete usuario.senha;
      res.json(usuario);
    } else if (usuarios.length > 1) {
      res.status(403).send("Mais de um usuário com o mesmo login e senha!");
    } else {
      res.status(403).send("Email e/ou senha inválido(s)");
    }
  } catch (erro) {
    console.error("Erro ao autenticar:", erro);
    res.status(500).send("Erro no servidor ao tentar autenticar.");
  }
}

module.exports = {
  getUsuarioComFuncionario,
  autenticar,
};
