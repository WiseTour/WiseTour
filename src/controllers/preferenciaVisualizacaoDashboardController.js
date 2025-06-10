const {
  preferenciaVisualizacaoDashboard,
  telaDashboard,
} = require("../models");

async function buscarPreferenciasUsuario(req, res) {
  const { id_usuario } = req.query;

  console.log("id_usuario:" + id_usuario);
  try {
    // Usar o nome importado (minúsculo) ao invés de PascalCase
    const preferencia = await preferenciaVisualizacaoDashboard.findAll({
      where: { fk_usuario: id_usuario },
      include: [
        {
          model: telaDashboard, // Usar o nome importado (minúsculo)
          as: 'tela_dashboard', // Adicionar o alias se necessário
        },
      ],
    });

    if (!preferencia || preferencia.length === 0) {
      return res
        .status(404)
        .json({ mensagem: "Preferência do usuário não encontrada" });
    }

    res.json(preferencia);
  } catch (error) {
    console.error("Erro ao buscar telas do usuário:", error);
    res.status(500).json({ mensagem: "Erro interno no servidor" });
  }
}

async function atualizarPreferenciasUsuario(req, res) {
  const preferencias = req.body;

  if (!Array.isArray(preferencias)) {
    return res
      .status(400)
      .json({ erro: "Formato inválido. Esperado um array." });
  }

  try {
    for (const pref of preferencias) {
      const { fk_usuario, fk_tela_dashboard, ativo } = pref;

      // Usar o nome importado (minúsculo) ao invés de PascalCase
      const [registro, created] =
        await preferenciaVisualizacaoDashboard.findOrCreate({
          where: { fk_usuario, fk_tela_dashboard },
          defaults: { ativo },
        });

      if (!created) {
        await registro.update({ ativo });
      }
    }

    return res
      .status(200)
      .json({ mensagem: "Preferências atualizadas com sucesso." });
  } catch (erro) {
    console.error("Erro ao atualizar preferências:", erro);
    return res
      .status(500)
      .json({ erro: "Erro interno ao atualizar preferências." });
  }
}

module.exports = {
  buscarPreferenciasUsuario,
  atualizarPreferenciasUsuario,
};