const { Op } = require("sequelize");

const { Usuario, Funcionario } = require("../models");

async function autenticar(req, res) {
  const { emailServer, senhaServer } = req.body;

  if (!emailServer || !senhaServer) {
    return res.status(400).send("Email ou senha não fornecidos");
  }

  try {
    const usuario = await Usuario.findOne({
      where: {
        email: emailServer,
        senha: senhaServer,
      },
    });

    if (usuario) {
      const usuarioPlain = usuario.get({ plain: true });
      delete usuarioPlain.senha;
      res.json(usuarioPlain);
    } else {
      res.status(403).send("Email e/ou senha inválido(s)");
    }
  } catch (erro) {
    console.error("Erro ao autenticar:", erro); // veja o erro detalhado
    res.status(500).send("Erro no servidor ao tentar autenticar.");
  }
}

async function buscarUsuarioPorId(req, res) {
  const { id_usuario } = req.params;

  try {
    const usuario = await Usuario.findByPk(id_usuario, {
      include: [
        {
          model: Funcionario,
        },
      ],
    });

    if (usuario) {
      const usuarioPlain = usuario.get({ plain: true });
      delete usuarioPlain.senha;
      res.json(usuarioPlain);
    } else {
      res.status(403).send("Usuário não encontrado.");
    }
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    res.status(500).json({ mensagem: "Erro interno no servidor" });
  }
}

async function buscarSenhaUsuarioPorId(req, res) {
  const { id_usuario } = req.params;

  try {
    const usuario = await Usuario.findByPk(id_usuario, {
      attributes: ['senha'],
    });

    if (!usuario) {
      return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }

    res.json({ senha: usuario.senha });
  } catch (error) {
    console.error("Erro ao buscar senha do usuário:", error);
    res.status(500).json({ mensagem: "Erro interno no servidor" });
  }
}


// Alterar informações do usuário e funcionário vinculado
const alterarInformacoesUsuario = async (req, res) => {
  const { id_usuario, id_funcionario, nome, cargo, telefone, email } = req.body;

  try {
    // Verifica se o usuário existe
    const usuario = await Usuario.findOne({
      where: { id_usuario },
      include: [
        {
          model: Funcionario,
        },
      ],
    });

    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    // Verifica se o email já está cadastrado por outro usuário
    if (email) {
      const emailExistente = await Usuario.findOne({
        where: {
          email,
          id_usuario: { [Op.ne]: id_usuario }, // outro usuário com mesmo email?
        },
      });

      if (emailExistente) {
        return res
          .status(400)
          .json({
            message: "Este email já está cadastrado para outro usuário.",
          });
      }
    }

    // Atualiza os dados do usuário
    await Usuario.update({ email }, { where: { id_usuario } });

    // Atualiza os dados do funcionário vinculado
    // Considerando que usuário pode ter mais de um funcionário, atualizamos o primeiro encontrado
    if (usuario.funcionario) {
       console.log("Atualizando dados do funcionário.");
      const funcionarioId = usuario.funcionario.id_funcionario;
      await Funcionario.update(
        { nome, cargo, telefone },
        { where: { id_funcionario: funcionarioId } }
      );
    } else {
      // Se não tem funcionário vinculado, opcional: criar ou informar
      console.log("Usuário não tem funcionário vinculado para atualizar.");
    }

    res.json({ message: "Dados atualizados com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    res.status(500).json({ message: "Erro ao atualizar os dados do usuário" });
  }
};

async function alterarSenhaUsuario(req, res) {
  const { id_usuario, senha } = req.body;

  if (!id_usuario || !senha) {
    return res.status(400).json({ mensagem: "ID do usuário e senha são obrigatórios" });
  }

  try {
    const usuario = await Usuario.findByPk(id_usuario);

    if (!usuario) {
      return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }

    // Atualiza a senha
    usuario.senha = senha;
    await usuario.save();

    res.json({ mensagem: "Senha atualizada com sucesso" });
  } catch (error) {
    console.error("Erro ao atualizar senha:", error);
    res.status(500).json({ mensagem: "Erro interno no servidor" });
  }
}


module.exports = {
  buscarUsuarioPorId,
  buscarSenhaUsuarioPorId,
  autenticar,
  alterarInformacoesUsuario,
  alterarSenhaUsuario,
};
