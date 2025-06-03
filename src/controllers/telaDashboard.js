const { PreferenciaVisualizacaoDashboard, TelaDashboard } = require("../models");

async function buscarTelasUsuario(req, res) {
  const { id_usuario } = req.params;

  try {
    // Busca as preferências do usuário incluindo as telas relacionadas
    const preferencia = await TelaDashboard.findOne({
      where: { fk_usuario: id_usuario }
    });

    if (!preferencia) {
      return res.status(404).json({ mensagem: "Preferência do usuário não encontrada" });
    }

    // Retorna só as telas (ajuste conforme sua modelagem)
    res.json(preferencia.TelaDashboards || []);
  } catch (error) {
    console.error("Erro ao buscar telas do usuário:", error);
    res.status(500).json({ mensagem: "Erro interno no servidor" });
  }
}

module.exports = {
  buscarTelasUsuario,
};
