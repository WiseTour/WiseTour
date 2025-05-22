const graficoModel = require('../models/graficoModel');

function listarDados(req, res) {
    graficoModel.listarDados()
        .then(resultado => res.json(resultado))
        .catch(erro => {
            console.error("Erro no controller:", erro);
            res.status(500).json(erro);
        });
}

module.exports = {
    listarDados
};
