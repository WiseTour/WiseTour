const { Op } = require("sequelize");
const { 
  usuario,
  funcionario, 
  informacaoContatoCadastro,
  empresa,
  configuracaoSlackk,
  preferenciaVisualizacaoDashboard,
  telaDashboard
} = require("../models");

async function autenticar(req, res) {
  const { emailServer, senhaServer } = req.body;

  if (!emailServer || !senhaServer) {
    return res.status(400).send("Email ou senha não fornecidos");
  }

  try {
    const usuarioEncontrado = await usuario.findOne({
      where: {
        email: emailServer,
        senha: senhaServer,
      },
    });

    if (usuarioEncontrado) {
      const usuarioPlain = usuarioEncontrado.get({ plain: true });
      delete usuarioPlain.senha;
      res.json(usuarioPlain);
    } else {
      res.status(403).send("Email e/ou senha inválido(s)");
    }
  } catch (erro) {
    console.error("Erro ao autenticar:", erro); 
    res.status(500).send("Erro no servidor ao tentar autenticar.");
  }
}

async function cadastrarInfoContato(req, res) {
  const { nomeServer, emailServer, numerousuarioServer } = req.body;

  if (!nomeServer || !emailServer || !numerousuarioServer) {
    return res.status(400).json({
      mensagem: "Todos os campos são obrigatórios (nome, email, número)"
    });
  }

  try {
    const usuarioExistente = await informacaoContatoCadastro.findOne({
      where: { email: emailServer }
    });

    if (usuarioExistente) {
      return res.status(400).json({
        mensagem: "Este email já está cadastrado"
      });
    }

    const novousuario = await informacaoContatoCadastro.create({
      nome: nomeServer,
      email: emailServer,
      telefone: numerousuarioServer
    });

    const usuarioResponse = novousuario.get({ plain: true });
    if (usuarioResponse.senha) {
      delete usuarioResponse.senha;
    }

    res.status(201).json(usuarioResponse);

  } catch (erro) {
    console.error("Erro ao cadastrar usuário:", erro);
    res.status(500).json({
      mensagem: "Erro interno no servidor ao tentar cadastrar"
    });
  }
}

async function cadastrarFuncionario(req, res) {
  const { nomeServer, cargoServer, numerousuarioServer, cnpjServer, idInfoContato, siglaServer } = req.body;

  if (!nomeServer || !cargoServer || !numerousuarioServer) {
    return res.status(400).json({
      mensagem: "Todos os campos são obrigatórios (nome, cargo, telefone)"
    });
  }

  try {
    const funcionarioExistente = await funcionario.findOne({
      where: { telefone: numerousuarioServer }
    });

    if (funcionarioExistente) {
      return res.status(400).json({
        mensagem: "Este telefone já está cadastrado"
      });
    }

    const novofuncionario = await funcionario.create({
      nome: nomeServer,
      cargo: cargoServer,
      telefone: numerousuarioServer,
      fk_cnpj: cnpjServer,
      fk_informacao_contato_cadastro: idInfoContato,
      fk_uf_sigla: siglaServer
    });

    const funcionarioResponse = novofuncionario.get({ plain: true });
    res.status(201).json(funcionarioResponse);

  } catch (erro) {
    console.error("Erro ao cadastrar funcionário:", erro);
    res.status(500).json({
      mensagem: "Erro interno no servidor ao tentar cadastrar"
    });
  }
}

async function buscarUsuarioPorId(req, res) {
  const { id_usuario } = req.params;

  try {
    const usuarioEncontrado = await usuario.findByPk(id_usuario, {
      include: [
        {
          model: funcionario,
          as: 'funcionario',
          required: false
        },
      ],
    });
    
    if (!usuarioEncontrado) {
      return res.status(404).send("Usuário não encontrado.");
    }

    const usuarioPlain = usuarioEncontrado.get({ plain: true });
    delete usuarioPlain.senha;
    res.json(usuarioPlain);

  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    
    try {
      const usuarioSimples = await usuario.findByPk(id_usuario);
      if (usuarioSimples) {
        const usuarioPlain = usuarioSimples.get({ plain: true });
        delete usuarioPlain.senha;
        res.json(usuarioPlain);
      } else {
        res.status(404).send("Usuário não encontrado.");
      }
    } catch (fallbackError) {
      console.error("Erro no fallback:", fallbackError);
      res.status(500).json({ mensagem: "Erro interno no servidor" });
    }
  }
}

async function buscarSenhaUsuarioPorId(req, res) {
  const { id_usuario } = req.params;

  try {
    const usuarioEncontrado = await usuario.findByPk(id_usuario, {
      attributes: ['senha'],
    });

    if (!usuarioEncontrado) {
      return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }

    res.json({ senha: usuarioEncontrado.senha });
  } catch (error) {
    console.error("Erro ao buscar senha do usuário:", error);
    res.status(500).json({ mensagem: "Erro interno no servidor" });
  }
}

const alterarInformacoesUsuario = async (req, res) => {
  const { id_usuario, id_funcionario, nome, cargo, telefone, email } = req.body;

  try {
    const usuarioEncontrado = await usuario.findOne({
      where: { id_usuario },
      include: [
        {
          model: funcionario,
          as: 'funcionario',
          required: false
        }
      ]
    });

    if (!usuarioEncontrado) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    if (email) {
      const emailExistente = await usuario.findOne({
        where: {
          email,
          id_usuario: { [Op.ne]: id_usuario }, 
        },
      });

      if (emailExistente) {
        return res.status(400).json({
          message: "Este email já está cadastrado para outro usuário.",
        });
      }
    }

    if (email) {
      await usuario.update({ email }, { where: { id_usuario } });
    }

    if (id_funcionario && (nome || cargo || telefone)) {
      const dadosParaAtualizar = {};
      if (nome) dadosParaAtualizar.nome = nome;
      if (cargo) dadosParaAtualizar.cargo = cargo;
      if (telefone) dadosParaAtualizar.telefone = telefone;

      await funcionario.update(
        dadosParaAtualizar,
        { where: { id_funcionario } }
      );
      console.log("Dados do funcionário atualizados.");
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
    const usuarioEncontrado = await usuario.findByPk(id_usuario);

    if (!usuarioEncontrado) {
      return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }

    usuarioEncontrado.senha = senha;
    await usuarioEncontrado.save();

    res.json({ mensagem: "Senha atualizada com sucesso" });
  } catch (error) {
    console.error("Erro ao atualizar senha:", error);
    res.status(500).json({ mensagem: "Erro interno no servidor" });
  }
}

async function buscarUsuarioCompleto(req, res) {
  const { id_usuario } = req.params;

  try {
    const usuarioEncontrado = await usuario.findByPk(id_usuario, {
      include: [
        {
          model: funcionario,
          as: 'funcionario',
          required: false,
          include: [
            {
              model: empresa,
              as: 'empresa_cnpj',
              required: false
            }
          ]
        },
        {
          model: configuracaoSlackk, // Corrigido o nome da importação
          as: 'configuracao_slack',
          required: false
        },
        {
          model: preferenciaVisualizacaoDashboard,
          as: 'preferencias_visualizacao_dashboard',
          required: false,
          include: [
            {
              model: telaDashboard,
              as: 'tela_dashboard',
              required: false
            }
          ]
        }
      ]
    });

    if (!usuarioEncontrado) {
      return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }

    const usuarioPlain = usuarioEncontrado.get({ plain: true });
    delete usuarioPlain.senha;
    res.json(usuarioPlain);

  } catch (error) {
    console.error("Erro ao buscar usuário completo:", error);
    res.status(500).json({ mensagem: "Erro interno no servidor" });
  }
}

async function criarUsuario(req, res) {
  const { email, senha, permissao } = req.body;

  if (!email || !senha || !permissao) {
    return res.status(400).json({ mensagem: "Campos obrigatórios não informados." });
  }

  try {
    const usuarioExistente = await usuario.findOne({ where: { email } });

    if (usuarioExistente) {
      return res.status(400).json({ mensagem: "Email já cadastrado." });
    }

    console.log("BODY USUARIO RECEBIDO:", req.body)

    const novoUsuario = await usuario.create({ email, senha, permissao });

    res.status(201).json(novoUsuario);
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    res.status(500).json({ mensagem: "Erro interno no servidor" });
  }
}

// PUT /usuario/:id_usuario
async function atualizarUsuario(req, res) {
  const { id_usuario } = req.params;
  const { email, senha, permissao } = req.body;

  if (!email && !senha && !permissao) {
    return res.status(400).json({ mensagem: "Nenhum dado para atualizar foi enviado." });
  }

  try {
    const usuarioEncontradoId = await usuario.findByPk(id_usuario);

    if (!usuarioEncontradoId) {
      return res.status(404).json({ mensagem: "Usuário não encontrado." });
    }

    if (email) usuarioEncontradoId.email = email;
    if (senha) usuarioEncontradoId.senha = senha;
    if (permissao) usuarioEncontradoId.permissao = permissao;

    console.log("BODY USUARIO RECEBIDO:", req.body)

    await usuarioEncontradoId.save();

    res.json({ mensagem: "Usuário atualizado com sucesso!" });
  } catch (erro) {
    console.error("Erro ao atualizar usuário:", erro);
    res.status(500).json({ mensagem: "Erro interno no servidor." });
  }
}

const excluirUsuario = async (req, res) => {
  try {
    const { emailUsuarioServer} = req.body;

    // Verificação se os campos foram enviados
    if (!emailUsuarioServer) {
      return res.status(400).json({ message: 'Email é obrigatório'});
    }

    const usuarioExcluido = await usuario.destroy({
      where: {
        email: emailUsuarioServer,
      }
    });

    if (usuarioExcluido === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado com os dados informados.' });
    }

    console.log("BODY USUARIO RECEBIDO:", req.body)
    

    res.status(200).json({ message: 'Usuário excluído com sucesso.' });
  } catch (error) {
    console.error('Erro ao excluir Usuário:', error);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};


module.exports = {
  buscarUsuarioPorId,
  buscarSenhaUsuarioPorId,
  autenticar,
  alterarInformacoesUsuario,
  alterarSenhaUsuario,
  cadastrarInfoContato,
  cadastrarFuncionario,
  buscarUsuarioCompleto,
  criarUsuario,
  atualizarUsuario,
  excluirUsuario
};