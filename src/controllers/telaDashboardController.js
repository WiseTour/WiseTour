const { 
  preferenciaVisualizacaoDashboard, 
  telaDashboard 
} = require("../models");

async function buscarTelasUsuario(req, res) {
  const { id_usuario } = req.params;

  try {
    // Busca as preferências do usuário incluindo as telas relacionadas
    const preferencias = await preferenciaVisualizacaoDashboard.findAll({
      where: { fk_usuario: id_usuario },
      include: [
        {
          model: telaDashboard,
          as: 'tela_dashboard',
          required: false
        }
      ]
    });

    if (!preferencias || preferencias.length === 0) {
      return res.status(404).json({ mensagem: "Preferências do usuário não encontradas" });
    }

    // Extrai apenas as telas das preferências
    const telas = preferencias
      .map(pref => pref.tela_dashboard)
      .filter(tela => tela !== null);

    res.json(telas);
  } catch (error) {
    console.error("Erro ao buscar telas do usuário:", error);
    res.status(500).json({ mensagem: "Erro interno no servidor" });
  }
}

// Função alternativa para buscar todas as telas disponíveis
async function buscarTodasTelas(req, res) {
  try {
    const telas = await telaDashboard.findAll({
      include: [
        {
          model: preferenciaVisualizacaoDashboard,
          as: 'preferencias_visualizacao_dashboard',
          required: false
        }
      ]
    });

    res.json(telas);
  } catch (error) {
    console.error("Erro ao buscar todas as telas:", error);
    res.status(500).json({ mensagem: "Erro interno no servidor" });
  }
}

// Função para buscar telas específicas de um usuário com mais detalhes
async function buscarPreferenciasTelaUsuario(req, res) {
  const { id_usuario } = req.params;

  try {
    const preferencias = await preferenciaVisualizacaoDashboard.findAll({
      where: { fk_usuario: id_usuario },
      include: [
        {
          model: telaDashboard,
          as: 'tela_dashboard',
          required: true
        }
      ],
      order: [['id_preferencia_visualizacao_dashboard', 'ASC']]
    });

    if (!preferencias || preferencias.length === 0) {
      return res.status(404).json({ 
        mensagem: "Nenhuma preferência de tela encontrada para este usuário" 
      });
    }

    // Retorna as preferências completas com as telas
    res.json(preferencias);
  } catch (error) {
    console.error("Erro ao buscar preferências de tela do usuário:", error);
    res.status(500).json({ mensagem: "Erro interno no servidor" });
  }
}

// Função para criar uma nova preferência de tela para o usuário
async function criarPreferenciaTela(req, res) {
  const { id_usuario, id_tela_dashboard, ordem_visualizacao, ativo } = req.body;

  if (!id_usuario || !id_tela_dashboard) {
    return res.status(400).json({
      mensagem: "ID do usuário e ID da tela são obrigatórios"
    });
  }

  try {
    const telaExiste = await telaDashboard.findByPk(id_tela_dashboard);
    if (!telaExiste) {
      return res.status(404).json({ mensagem: "Tela não encontrada" });
    }

    const preferenciaExistente = await preferenciaVisualizacaoDashboard.findOne({
      where: {
        fk_usuario: id_usuario,
        fk_tela_dashboard: id_tela_dashboard
      }
    });

    if (preferenciaExistente) {
      return res.status(400).json({
        mensagem: "Preferência já existe para esta tela e usuário"
      });
    }

    const novaPreferencia = await preferenciaVisualizacaoDashboard.create({
      fk_usuario: id_usuario,
      fk_tela_dashboard: id_tela_dashboard,
      ordem_visualizacao: ordem_visualizacao || 1,
      ativo: ativo !== undefined ? ativo : true
    });

    const preferenciaCompleta = await preferenciaVisualizacaoDashboard.findByPk(
      novaPreferencia.id_preferencia_visualizacao_dashboard,
      {
        include: [
          {
            model: telaDashboard,
            as: 'tela_dashboard'
          }
        ]
      }
    );

    res.status(201).json(preferenciaCompleta);
  } catch (error) {
    console.error("Erro ao criar preferência de tela:", error);
    res.status(500).json({ mensagem: "Erro interno no servidor" });
  }
}

module.exports = {
  buscarTelasUsuario,
  buscarTodasTelas,
  buscarPreferenciasTelaUsuario,
  criarPreferenciaTela
};