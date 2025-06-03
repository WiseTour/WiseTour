const { ConfiguracaoSlack, TipoNotificacao, Etapa } = require("../models");

async function buscarConfiguracaoUsuario(req, res) {
  const { id_usuario } = req.params;

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

module.exports = {
  buscarConfiguracaoUsuario,
};
