const { ConfiguracaoSlack, TipoNotificacao, Etapa } = require("../models");

async function buscarConfiguracaoUsuario(req, res) {
  const { id_usuario } = req.query;

  try {
    const configuracao = await ConfiguracaoSlack.findAll({
      where: { fk_usuario: id_usuario },
      include: [
        {
          model: TipoNotificacao,
          attributes: ["fk_etapa"],
          include: [
            {
              model: Etapa,
              attributes: ["etapa"],
            },
          ],
        },
      ],
    });

    if (configuracao.length === 0) {
      return res
        .status(404)
        .json({ mensagem: "Configuração do Slack do usuário não encontrada" });
    }

    res.json(configuracao);
  } catch (error) {
    console.error("Erro ao buscar configuração do slack do usuário:", error);
    res.status(500).json({ mensagem: "Erro interno no servidor" });
  }
}

async function atualizarConfiguracaoSlack(req, res) {
  const { configuracao_slack, tipos_notificacoes } = req.body;

  if (!configuracao_slack || !Array.isArray(tipos_notificacoes)) {
    return res.status(400).json({
      erro: "Requisição inválida. Esperado configuracao_slack e array de tipos_notificacoes.",
    });
  }

  try {

    await ConfiguracaoSlack.update(
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

    await TipoNotificacao.destroy({
      where: {
        fk_configuracao_slack: configuracao_slack.id_configuracao_slack,
      },
    });

    // Cria os novos tipos de notificação
    for (const notificacao of tipos_notificacoes) {
      const { fk_etapa, fk_configuracao_slack, fk_usuario } = notificacao;

      await TipoNotificacao.create({
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
