// src/controllers/graficoController.js

const { Op, fn, col, literal } = require('sequelize');
const PerfilEstimadoTurista = require('../models/graficoModel');
const Pais = require('../models/paisModel');
const UnidadeFederativaBrasil = require('../models/unidadeFederativaBrasilModel');
const Destinos = require('../models/destinoModel');
const sequelize = require('../database/sequelize');


// --- Associações (CRUCIAL para os JOINs funcionarem corretamente) ---

PerfilEstimadoTurista.belongsTo(Pais, { foreignKey: 'fk_pais_origem', targetKey: 'id_pais' });
Pais.hasMany(PerfilEstimadoTurista, { foreignKey: 'fk_pais_origem', sourceKey: 'id_pais' });

PerfilEstimadoTurista.belongsTo(UnidadeFederativaBrasil, { foreignKey: 'fk_uf_entrada', targetKey: 'sigla' });
UnidadeFederativaBrasil.hasMany(PerfilEstimadoTurista, { foreignKey: 'fk_uf_entrada', sourceKey: 'sigla' });


// --- ASSOCIAÇÕES AJUSTADAS PARA CHAVES PRIMÁRIAS COMPOSTAS ---

// ESTAS SÃO AS LINHAS QUE ESTÃO DANDO ERRO. COMENTE-AS/REMVOA-AS.
// Destinos.belongsTo(PerfilEstimadoTurista, {
//     foreignKey: ['fk_perfil_estimado_turistas', 'fk_pais_origem', 'fk_uf_entrada'],
//     targetKey: ['id_perfil_estimado_turistas', 'fk_pais_origem', 'fk_uf_entrada']
// });

// PerfilEstimadoTurista.hasMany(Destinos, {
//     foreignKey: ['fk_perfil_estimado_turistas', 'fk_pais_origem', 'fk_uf_entrada'],
//     sourceKey: ['id_perfil_estimado_turistas', 'fk_pais_origem', 'fk_uf_entrada']
// });

Destinos.belongsTo(UnidadeFederativaBrasil, {
    foreignKey: 'fk_uf_destino',
    targetKey: 'sigla'
});

//modificações

const construirWhereClause = (req) => {
    const { mes, ano, pais } = req.query;
    const where = {};

    if (mes) {
        where.mes = parseInt(mes, 10);
    }
    if (ano) {
        where.ano = parseInt(ano, 10);
    }
    // Se 'pais' for o ID do país, usar como fk_pais_origem
    if (pais) {
        where.fk_pais_origem = parseInt(pais, 10);
    }
    return where;
};

// Mapeamento de números de mês para nomes
const nomesDosMeses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];


// --- FUNÇÕES DE KPI PARA SAZONALIDADE ---

exports.buscarDadosParaDashboard = async (req, res) => {
    try {
        const querySQL = `
            SELECT
                p.id_perfil_estimado_turistas,
                p.ano,
                p.mes,
                p.quantidade_turistas,
                d.permanencia_media,
                uf_destino.nome AS nome_uf_destino,
                uf_origem.nome AS nome_uf_origem_entrada,
                pais.nome AS nome_pais_origem
            FROM
                perfil_estimado_turistas AS p
            JOIN
                destinos AS d ON p.id_perfil_estimado_turistas = d.fk_perfil_estimado_turistas
                             AND p.fk_pais_origem = d.fk_pais_origem
                             AND p.fk_uf_entrada = d.fk_uf_entrada
            JOIN
                unidade_federativa_brasil AS uf_destino ON d.fk_uf_destino = uf_destino.sigla
            JOIN
                unidade_federativa_brasil AS uf_origem ON p.fk_uf_entrada = uf_origem.sigla
            JOIN
                pais AS pais ON p.fk_pais_origem = pais.id_pais
            WHERE
                p.ano = 2023 -- Exemplo de filtro: adapte ou remova
            ORDER BY p.ano, p.mes
            LIMIT 100; -- Limite para não sobrecarregar em testes
        `;

        const [results, metadata] = await sequelize.query(querySQL);
        console.log("Dados do dashboard (JOIN manual):", results);
        return results;

    } catch (error) {
        console.error("Erro ao buscar dados do dashboard com JOIN manual:", error);
        throw error;
    }
}

exports.listarTopEstadosVisitadosSazonalidade = async (req, res) => {
    try {
        const { mes, ano, pais } = req.query; // Pega os filtros do frontend

        // Construindo a cláusula WHERE dinamicamente para o SQL
        let whereConditions = `WHERE 1=1`; // Começa com uma condição sempre verdadeira
        const replacements = {}; // Objeto para armazenar os valores para substituição segura

        if (mes) {
            whereConditions += ` AND P.mes = :mes`;
            replacements.mes = parseInt(mes, 10);
        }
        if (ano) {
            whereConditions += ` AND P.ano = :ano`;
            replacements.ano = parseInt(ano, 10);
        }
        if (pais) {
            whereConditions += ` AND P.fk_pais_origem = :pais`;
            replacements.pais = parseInt(pais, 10);
        }

        const querySQL = `
            SELECT
                UF.unidade_federativa AS unidade_federativa,
                SUM(P.quantidade_turistas) AS total_turistas_uf
            FROM
                perfil_estimado_turistas AS P
            JOIN
                destinos AS D ON P.id_perfil_estimado_turistas = D.fk_perfil_estimado_turistas
                             AND P.fk_pais_origem = D.fk_pais_origem
                             AND P.fk_uf_entrada = D.fk_uf_entrada
            JOIN
                unidade_federativa_brasil AS UF ON D.fk_uf_destino = UF.sigla
            ${whereConditions} -- Inclui as condições dinâmicas do WHERE
            GROUP BY
                UF.unidade_federativa
            ORDER BY
                total_turistas_uf DESC
            LIMIT 3;
        `;

        const resultados = await sequelize.query(querySQL, {
            replacements: replacements,
            type: sequelize.QueryTypes.SELECT
        });

        // Mapeia os resultados para extrair APENAS o nome da UF
        const topEstadosNomes = resultados.map(item => item.unidade_federativa);

        // Envia apenas o array de strings
        res.json(topEstadosNomes); // Isso enviaria ["São Paulo", "Rio de Janeiro", "Minas Gerais"]

    } catch (error) {
        console.error("Erro ao buscar top estados visitados para sazonalidade:", error);
        res.status(500).json({ erro: "Erro interno ao buscar top estados visitados." });
    }
};


// ====================================================================================
// Funções para a dashboard do Perfil do Turista (perfilturista.js)
// ====================================================================================

exports.listarMotivos = async (req, res) => {
    try {
        const where = construirWhereClause(req);
        const resultados = await PerfilEstimadoTurista.findAll({
            attributes: [
                'motivo_viagem',
                [fn('SUM', col('quantidade_turistas')), 'total_turistas']
            ],
            where,
            group: ['motivo_viagem'],
            order: [[literal('total_turistas'), 'DESC']]
        });

        const totalGeral = resultados.reduce((sum, item) => sum + parseFloat(item.dataValues.total_turistas), 0);
        const dadosFormatados = resultados.map(item => ({
            motivo: item.motivo_viagem,
            percentual: totalGeral > 0 ? (parseFloat(item.dataValues.total_turistas) / totalGeral * 100).toFixed(2) : "0.00"
        }));

        res.json(dadosFormatados);
    } catch (error) {
        console.error("Erro ao buscar motivos de viagem:", error);
        res.status(500).json({ erro: "Erro interno ao buscar motivos de viagem." });
    }
};

exports.listarFontesInformacao = async (req, res) => {
    try {
        const where = construirWhereClause(req);
        const resultados = await PerfilEstimadoTurista.findAll({
            attributes: [
                'fonte_informacao_viagem',
                [fn('SUM', col('quantidade_turistas')), 'total_turistas']
            ],
            where,
            group: ['fonte_informacao_viagem'],
            order: [[literal('total_turistas'), 'DESC']]
        });

        const totalGeral = resultados.reduce((sum, item) => sum + parseFloat(item.dataValues.total_turistas), 0);
        const dadosFormatados = resultados.map(item => ({
            fonte: item.fonte_informacao_viagem,
            percentual: totalGeral > 0 ? (parseFloat(item.dataValues.total_turistas) / totalGeral * 100).toFixed(2) : "0.00"
        }));

        res.json(dadosFormatados);
    } catch (error) {
        console.error("Erro ao buscar fontes de informação:", error);
        res.status(500).json({ erro: "Erro interno ao buscar fontes de informação." });
    }
};

exports.listarComposicao = async (req, res) => {
    try {
        const where = construirWhereClause(req);
        const resultados = await PerfilEstimadoTurista.findAll({
            attributes: [
                'composicao_grupo_familiar',
                [fn('SUM', col('quantidade_turistas')), 'total_turistas']
            ],
            where,
            group: ['composicao_grupo_familiar'],
            order: [[literal('total_turistas'), 'DESC']]
        });

        const totalGeral = resultados.reduce((sum, item) => sum + parseFloat(item.dataValues.total_turistas), 0);
        const dadosFormatados = resultados.map(item => ({
            composicao: item.composicao_grupo_familiar,
            percentual: totalGeral > 0 ? (parseFloat(item.dataValues.total_turistas) / totalGeral * 100).toFixed(2) : "0.00"
        }));

        res.json(dadosFormatados);
    } catch (error) {
        console.error("Erro ao buscar composição do grupo familiar:", error);
        res.status(500).json({ erro: "Erro interno ao buscar composição do grupo familiar." });
    }
};

exports.listarVias = async (req, res) => {
    try {
        const where = construirWhereClause(req);
        const resultados = await PerfilEstimadoTurista.findAll({
            attributes: [
                'via_acesso',
                [fn('SUM', col('quantidade_turistas')), 'total_turistas']
            ],
            where,
            group: ['via_acesso'],
            order: [[literal('total_turistas'), 'DESC']]
        });

        const totalGeral = resultados.reduce((sum, item) => sum + parseFloat(item.dataValues.total_turistas), 0);
        const dadosFormatados = resultados.map(item => ({
            vias: item.via_acesso,
            percentual: totalGeral > 0 ? (parseFloat(item.dataValues.total_turistas) / totalGeral * 100).toFixed(2) : "0.00"
        }));

        res.json(dadosFormatados);
    } catch (error) {
        console.error("Erro ao buscar vias de acesso:", error);
        res.status(500).json({ erro: "Erro interno ao buscar vias de acesso." });
    }
};

exports.listarGeneroMaisRecorrente = async (req, res) => {
    try {
        const where = construirWhereClause(req);
        const resultado = await PerfilEstimadoTurista.findOne({
            attributes: [
                'genero',
                [fn('SUM', col('quantidade_turistas')), 'total_turistas']
            ],
            where: { ...where, genero: { [Op.ne]: null } },
            group: ['genero'],
            order: [[literal('total_turistas'), 'DESC']]
        });

        if (resultado) {
            res.json({ genero: resultado.genero });
        } else {
            res.status(404).json({ mensagem: "Nenhum gênero encontrado para os filtros selecionados." });
        }
    } catch (error) {
        console.error("Erro ao buscar gênero mais recorrente:", error);
        res.status(500).json({ erro: "Erro interno ao buscar gênero mais recorrente." });
    }
};

exports.listarFaixaEtariaMaisRecorrente = async (req, res) => {
    try {
        const where = construirWhereClause(req);
        const resultado = await PerfilEstimadoTurista.findOne({
            attributes: [
                'faixa_etaria',
                [fn('SUM', col('quantidade_turistas')), 'total_turistas']
            ],
            where: { ...where, faixa_etaria: { [Op.ne]: null } },
            group: ['faixa_etaria'],
            order: [[literal('total_turistas'), 'DESC']]
        });

        if (resultado) {
            res.json({ faixa_etaria: resultado.faixa_etaria });
        } else {
            res.status(404).json({ mensagem: "Nenhuma faixa etária encontrada para os filtros selecionados." });
        }
    } catch (error) {
        console.error("Erro ao buscar faixa etária mais recorrente:", error);
        res.status(500).json({ erro: "Erro interno ao buscar faixa etária mais recorrente." });
    }
};

exports.calcularGastoMedio = async (req, res) => {
    try {
        const where = construirWhereClause(req);
        const resultado = await PerfilEstimadoTurista.findOne({
            attributes: [
                [fn('AVG', col('gasto_media_percapita_em_reais')), 'gastoMedio']
            ],
            where,
            raw: true
        });

        if (resultado && resultado.gastoMedio !== null) {
            res.json({ gastoMedio: `R$ ${parseFloat(resultado.gastoMedio).toFixed(2).replace('.', ',')}` });
        } else {
            res.status(404).json({ erro: "Nenhum dado de gasto médio encontrado para os filtros selecionados." });
        }
    } catch (error) {
        console.error("Erro ao calcular gasto médio:", error);
        res.status(500).json({ erro: "Erro interno ao calcular gasto médio." });
    }
};

// 1. Gráfico PRINCIPAIS PAÍSES DE ORIGEM
exports.listarPrincipaisPaisesOrigem = async (req, res) => {
    try {
        const { mes, ano } = req.query
        const where = {}

        if (mes) {
            where.mes = parseInt(10)
        }

        if (ano) {
            where.ano = parseInt(10)
        }

        const resultados = await PerfilEstimadoTurista.findAll({
            attributes: [
                [fn('SUM', col('quantidade_turistas')), 'total_turistas']
            ],
            include: [{
                model: Pais,
                attributes: ['pais'], // Inclui o nome do país
                required: true // Garante que apenas perfis com país associado sejam retornados
            }],
            where,
            group: ['Pai.pais', 'Pai.id_pais'], // Agrupa pelo nome do país
            order: [[literal('total_turistas'), 'DESC']],
            limit: 5
        });

        const totalGeral = resultados.reduce((sum, item) => sum + parseFloat(item.dataValues.total_turistas), 0);

        const dadosFormatados = resultados.map(item => ({
            pais: item.Pai.pais, // Acessa o nome do país através da associação
            percentual: totalGeral > 0 ? (parseFloat(item.dataValues.total_turistas) / totalGeral * 100).toFixed(2) : "0.00"
        }));

        res.json(dadosFormatados);
    } catch (error) {
        console.error("Erro ao buscar principais países de origem:", error);
        res.status(500).json({ erro: "Erro interno ao buscar principais países de origem." });
    }
};

// 2. Gráfico PRESENÇA DE TURISTAS POR UNIDADE FEDERATIVA
exports.listarPresencaTuristasUF = async (req, res) => {
    try {
        const where = construirWhereClause(req);

        const resultados = await PerfilEstimadoTurista.findAll({
            attributes: [
                [fn('SUM', col('quantidade_turistas')), 'total_turistas']
            ],
            include: [{
                model: UnidadeFederativaBrasil,
                attributes: ['unidade_federativa'], // Inclui o nome completo da UF
                required: true
            }],
            where,
            group: ['UnidadeFederativaBrasil.unidade_federativa'], // Agrupa pelo nome da UF
            order: [[literal('total_turistas'), 'DESC']]
        });

        const dadosFormatados = resultados.map(item => ({
            uf: item.UnidadeFederativaBrasil.unidade_federativa, // Acessa o nome da UF
            quantidade: parseFloat(item.dataValues.total_turistas) // Retorna a quantidade, não percentual
        }));

        res.json(dadosFormatados);
    } catch (error) {
        console.error("Erro ao buscar presença de turistas por UF:", error);
        res.status(500).json({ erro: "Erro interno ao buscar presença de turistas por UF." });
    }
};

// 3. Gráfico de CHEGADAS DE TURISTAS ESTRANGEIROS (por mês)
exports.listarChegadasTuristasEstrangeiros = async (req, res) => {
    try {
        const { ano, pais } = req.query; // Para este gráfico, 'mes' não é usado na query, mas 'ano' e 'pais' são importantes.
        const where = {};
        if (ano) {
            where.ano = parseInt(ano, 10);
        }
        if (pais) {
            where.fk_pais_origem = parseInt(pais, 10);
        }

        const resultados = await PerfilEstimadoTurista.findAll({
            attributes: [
                'mes',
                [fn('SUM', col('quantidade_turistas')), 'chegadas']
            ],
            where,
            group: ['mes'],
            order: [['mes', 'ASC']] // Garante a ordem correta dos meses
        });

        // Mapear os resultados para incluir os nomes dos meses e garantir todos os meses
        const dadosCompletosPorMes = nomesDosMeses.map((nomeMes, index) => {
            const mesNumero = index + 1;
            const encontrado = resultados.find(item => item.mes === mesNumero);
            return {
                mes_nome: nomeMes,
                chegadas: encontrado ? parseFloat(encontrado.dataValues.chegadas) : 0
            };
        });

        res.json(dadosCompletosPorMes);
    } catch (error) {
        console.error("Erro ao buscar chegadas de turistas estrangeiros:", error);
        res.status(500).json({ erro: "Erro interno ao buscar chegadas de turistas estrangeiros." });
    }
};


// 4. KPIs de Chegadas Comparativas (Ano Atual vs. Ano Anterior)
exports.calcularChegadasComparativas = async (req, res) => {
    try {
        let anoAtualFiltro = parseInt(req.query.ano, 10);
        if (!anoAtualFiltro || isNaN(anoAtualFiltro)) {
            // Se nenhum ano for fornecido no filtro, use o ano atual como padrão (ex: 2024)
            anoAtualFiltro = new Date().getFullYear();
        }
        const anoAnteriorFiltro = anoAtualFiltro - 1;
        const paisFiltro = req.query.pais ? parseInt(req.query.pais, 10) : undefined;
        const mesFiltro = req.query.mes ? parseInt(req.query.mes, 10) : undefined;

        // Condição base para as consultas
        const baseWhere = {};
        if (paisFiltro) {
            baseWhere.fk_pais_origem = paisFiltro;
        }
        if (mesFiltro) {
            baseWhere.mes = mesFiltro;
        }

        // Total de chegadas para o ano atual
        const resultAnoAtual = await PerfilEstimadoTurista.findOne({
            attributes: [
                [fn('SUM', col('quantidade_turistas')), 'total_chegadas']
            ],
            where: {
                ...baseWhere,
                ano: anoAtualFiltro
            },
            raw: true
        });
        const chegadasAnoAtual = parseFloat(resultAnoAtual.total_chegadas || 0);

        // Total de chegadas para o ano anterior
        const resultAnoAnterior = await PerfilEstimadoTurista.findOne({
            attributes: [
                [fn('SUM', col('quantidade_turistas')), 'total_chegadas']
            ],
            where: {
                ...baseWhere,
                ano: anoAnteriorFiltro
            },
            raw: true
        });
        const chegadasAnoAnterior = parseFloat(resultAnoAnterior.total_chegadas || 0);

        let porcentagemComparativa = "0.00%";
        if (chegadasAnoAnterior > 0) {
            porcentagemComparativa = (((chegadasAnoAtual - chegadasAnoAnterior) / chegadasAnoAnterior) * 100).toFixed(2) + '%';
        } else if (chegadasAnoAtual > 0) {
            porcentagemComparativa = "+100.00%"; // Se o ano anterior tinha 0 e o atual tem > 0
        }

        res.json({
            anoAnterior: anoAnteriorFiltro,
            chegadasAnoAnterior: chegadasAnoAnterior.toLocaleString('pt-BR'), // Formatar para exibição
            anoAtual: anoAtualFiltro,
            chegadasAnoAtual: chegadasAnoAtual.toLocaleString('pt-BR'), // Formatar para exibição
            porcentagemComparativa: porcentagemComparativa
        });

    } catch (error) {
        console.error("Erro ao calcular chegadas comparativas:", error);
        res.status(500).json({ erro: "Erro interno ao calcular chegadas comparativas." });
    }
};