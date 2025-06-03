const TelaDashboard = require('../models/TelaDashboard');

module.exports = {
  async buscarTelasPorUsuario(req, res) {
    try {
      const { id_usuario } = req.params;

      const telas = await TelaDashboard.findAll({
        where: {
          fk_usuario: id_usuario
        },
        attributes: ['tela', 'ativo'],
      });

      return res.json(telas);
    } catch (error) {
      console.error('Erro ao buscar telas do usuário:', error);
      return res.status(500).json({ error: error.message });
    }
  },

  async atualizarPreferencias(req, res) {
    try {
      const { id_usuario } = req.params;
      const { telas } = req.body; // Recebe um array de objetos: { tela: "panoramaGeral", ativo: true }

      if (!Array.isArray(telas)) {
        return res.status(400).json({ error: 'Formato inválido para telas.' });
      }

      // Para cada item do array, atualiza a tela correspondente
      for (const telaItem of telas) {
        const { tela, ativo } = telaItem;

        const [updated] = await TelaDashboard.update(
          { ativo: ativo ? 'sim' : 'nao' },
          {
            where: {
              fk_usuario: id_usuario,
              tela: tela,
            },
          }
        );

        if (updated === 0) {
          console.warn(`Nenhuma tela atualizada para ${tela} e usuário ${id_usuario}`);
        }
      }

      res.json({ message: 'Preferências atualizadas com sucesso.' });
    } catch (error) {
      console.error('Erro ao atualizar preferências:', error);
      res.status(500).json({ error: error.message });
    }
  }
};
