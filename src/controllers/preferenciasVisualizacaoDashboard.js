const PreferenciasVisualizacaoDashboard = require('../models/PreferenciasVisualizacaoDashboard');

module.exports = {
  async verificarPreferenciaAtiva(req, res) {
    try {
      const { id_usuario } = req.params;
      console.log('ID recebido:', id_usuario);

      const preferencia = await PreferenciasVisualizacaoDashboard.findOne({
        where: {
          fk_usuario: id_usuario,
          ativo: 'sim',
        },
      });

      if (preferencia) {
        return res.json({ ativa: true });
      } else {
        return res.json({ ativa: false });
      }
    } catch (error) {
      console.error('Erro:', error);
      return res.status(500).json({ error: error.message });
    }
  },
};
