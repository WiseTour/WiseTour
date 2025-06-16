const { configuracaoSlack, tipoNotificacaoDados, etapa, usuario } = require("../models"); // ✅ Adicionado 'usuario' na importação

const buscarConfiguracaoUsuario = async (req, res) => {
  try {
    const usuarioId = req.query.id_usuario;
    
    if (!usuarioId) {
      return res.status(400).json({ 
        message: 'ID do usuário é obrigatório' 
      });
    }

    const configuracao = await configuracaoSlack.findAll({
      include: [
        {
          model: tipoNotificacaoDados,
          as: 'tipos_notificacao',
          include: [
            {
              model: etapa,
              as: 'etapa'
            }
          ]
        },
        {
          model: usuario,
          as: 'usuario'
        }
      ],
      where: { fk_usuario: usuarioId }
    });

    if (!configuracao || configuracao.length === 0) {
      return res.status(404).json({ 
        message: 'Configuração do Slack não encontrada para este usuário' 
      });
    }

    res.status(200).json(configuracao);
  } catch (error) {
    console.error('Erro ao buscar configuração do slack do usuário:', error);
    res.status(500).json({ 
      message: 'Erro interno do servidor',
      error: error.message 
    });
  }
};

async function atualizarConfiguracaoSlack(req, res) {
  const { configuracao_slack, tipos_notificacoes } = req.body;

  if (!configuracao_slack || !Array.isArray(tipos_notificacoes)) {
    return res.status(400).json({
      erro: "Requisição inválida. Esperado configuracao_slack e array de tipos_notificacoes.",
    });
  }

  try {
    await configuracaoSlack.update(
      {
        webhook_canal_padrao: configuracao_slack.canal_padrao,
        ativo: configuracao_slack.ativo,
      },
      {
        where: {
          id_configuracao_slack: configuracao_slack.id_configuracao_slack,
        },
      }
    );

    await tipoNotificacaoDados.destroy({
      where: {
        fk_configuracao_slack: configuracao_slack.id_configuracao_slack,
      },
    });

    for (const notificacao of tipos_notificacoes) {
      const { fk_etapa, fk_configuracao_slack, fk_usuario } = notificacao;

      await tipoNotificacaoDados.create({
        fk_etapa,
        fk_configuracao_slack,
        fk_usuario,
      });
    }

    return res
      .status(200)
      .json({ mensagem: "Configuração do Slack atualizada com sucesso." });

  } catch (erro) {
    console.error("Erro ao atualizar configuração do Slack:", erro);
    return res
      .status(500)
      .json({ erro: "Erro interno ao atualizar configuração do Slack." });
  }
}

module.exports = {
  buscarConfiguracaoUsuario,
  atualizarConfiguracaoSlack,
};