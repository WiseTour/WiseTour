const { sequelize } = require('../database/sequelizeConfig');

const unidadeFederativaBrasil = require('./unidadeFederativaBrasil');
const etapa = require('./etapa');
const logCategoria = require('./logCategoria');
const log = require('./log');
const usuario = require('./usuario');
const configuracaoSlack = require('./configuracaoSlack');
const tipoNotificacaoDados = require('./tipoNotificacaoDados');
const preferenciaVisualizacaoDashboard = require('./preferenciaVisualizacaoDashboard');
const telaDashboard = require('./telaDashboard');
const informacaoContatoCadastro = require('./informacaoContatoCadastro');
const historicoContato = require('./historicoContato');
const endereco = require('./endereco');
const empresa = require('./empresa');
const funcionario = require('./funcionario');
const pais = require("./pais");
const perfilEstimadoTuristas = require("./perfilEstimadoTuristas");
const destino = require("./destino");

// RELACIONAMENTOS

// endereco -> unidadeFederativaBrasil
endereco.belongsTo(unidadeFederativaBrasil, { 
  foreignKey: 'fk_uf_sigla',
  as: 'unidade_federativa_brasil'
});
unidadeFederativaBrasil.hasMany(endereco, { 
  foreignKey: 'fk_uf_sigla',
  as: 'endereco'
});

// historicoContato -> informacaoContatoCadastro
historicoContato.belongsTo(informacaoContatoCadastro, { 
  foreignKey: 'fk_informacao_contato_cadastro',
  as: 'informacao_contato_cadastro'
});
informacaoContatoCadastro.hasMany(historicoContato, { 
  foreignKey: 'fk_informacao_contato_cadastro',
  as: 'historico_contato'
});

// empresa -> historicoContato
empresa.belongsTo(historicoContato, { 
  foreignKey: 'fk_informacao_contato_cadastro',
  as: 'historico_contato'
});
historicoContato.hasMany(empresa, { 
  foreignKey: 'fk_informacao_contato_cadastro',
  as: 'empresa'
});

// empresa -> endereco
empresa.belongsTo(endereco, { 
  foreignKey: 'fk_endereco',
  as: 'endereco'
});
empresa.belongsTo(endereco, { 
  foreignKey: 'fk_uf_sigla',
  as: 'endereco_uf'
});
endereco.hasMany(empresa, { 
  foreignKey: 'fk_endereco',
  as: 'empresa'
});
endereco.hasMany(empresa, { 
  foreignKey: 'fk_uf_sigla',
  as: 'empresas_uf'
});

// funcionario -> empresa
funcionario.belongsTo(empresa, { 
  foreignKey: 'fk_cnpj',
  as: 'empresa_cnpj'
});
funcionario.belongsTo(empresa, { 
  foreignKey: 'fk_informacao_contato_cadastro',
  as: 'empresa_contato'
});
funcionario.belongsTo(empresa, { 
  foreignKey: 'fk_endereco',
  as: 'empresa_endereco'
});
funcionario.belongsTo(empresa, { 
  foreignKey: 'fk_uf_sigla',
  as: 'empresa_uf'
});

empresa.hasMany(funcionario, { 
  foreignKey: 'fk_cnpj',
  as: 'funcionarios_cnpj'
});
empresa.hasMany(funcionario, { 
  foreignKey: 'fk_informacao_contato_cadastro',
  as: 'funcionarios_contato'
});
empresa.hasMany(funcionario, { 
  foreignKey: 'fk_endereco',
  as: 'funcionarios_endereco'
});
empresa.hasMany(funcionario, { 
  foreignKey: 'fk_uf_sigla',
  as: 'funcionarios_uf'
});

// funcionario -> usuario
funcionario.belongsTo(usuario, { 
  foreignKey: 'fk_usuario',
  as: 'usuario'
});
usuario.hasOne(funcionario, { 
  foreignKey: 'fk_usuario',
  as: 'funcionario'
});

// preferenciaVisualizacaoDashboard -> usuario
preferenciaVisualizacaoDashboard.belongsTo(usuario, {
  foreignKey: 'fk_usuario',
  targetKey: 'id_usuario',
  as: 'usuario'
});

usuario.hasMany(preferenciaVisualizacaoDashboard, { 
  foreignKey: 'fk_usuario',
  as: 'preferencias_visualizacao_dashboard'
});

// telaDashboard -> preferenciaVisualizacaoDashboard
preferenciaVisualizacaoDashboard.belongsTo(telaDashboard, {
  foreignKey: 'fk_tela_dashboard',
  targetKey: 'id_tela_dashboard',
  as: 'tela_dashboard'
});

telaDashboard.hasMany(preferenciaVisualizacaoDashboard, {
  foreignKey: 'fk_tela_dashboard',
  as: 'preferencias_visualizacao_dashboard'
});

// etapa -> tipoNotificacaoDados
tipoNotificacaoDados.belongsTo(etapa, {
  foreignKey: 'fk_etapa',
  targetKey: 'id_etapa',
  as: 'etapa'
});
etapa.hasMany(tipoNotificacaoDados, {
  foreignKey: 'fk_etapa',
  as: 'tipos_notificacao'
});

// configuracaoSlack -> tipoNotificacaoDados
tipoNotificacaoDados.belongsTo(configuracaoSlack, {
  foreignKey: 'fk_configuracao_slack',
  targetKey: 'id_configuracao_slack',
  as: 'configuracao_slack'
});
configuracaoSlack.hasMany(tipoNotificacaoDados, {
  foreignKey: 'fk_configuracao_slack',
  as: 'tipos_notificacao'
});

// usuario -> configuracaoSlack
configuracaoSlack.belongsTo(usuario, {
  foreignKey: 'fk_usuario',
  targetKey: 'id_usuario',
  as: 'usuario'
});
usuario.hasOne(configuracaoSlack, {
  foreignKey: 'fk_usuario',
  as: 'configuracao_slack'
});

// perfilEstimadoTuristas -> pais
perfilEstimadoTuristas.belongsTo(pais, {
  foreignKey: "fk_pais_origem",
  targetKey: "id_pais",
  as: "pais"
});
pais.hasMany(perfilEstimadoTuristas, {
  foreignKey: "fk_pais_origem",
  sourceKey: "id_pais",
  as: "perfil_estimado_turistas"
});

// perfilEstimadoTuristas -> unidadeFederativaBrasil
perfilEstimadoTuristas.belongsTo(unidadeFederativaBrasil, {
  foreignKey: "fk_uf_entrada",
  targetKey: "sigla",
  as: "unidade_federativa_brasil"
});
unidadeFederativaBrasil.hasMany(perfilEstimadoTuristas, {
  foreignKey: "fk_uf_entrada",
  sourceKey: "sigla",
  as: "perfil_estimado_turistas"
});

// destino -> unidadeFederativaBrasil
destino.belongsTo(unidadeFederativaBrasil, {
  foreignKey: "fk_uf_destino",
  targetKey: "sigla",
  as: "unidade_federativa_brasil"
});
unidadeFederativaBrasil.hasMany(destino, {
  foreignKey: "fk_uf_destino",
  sourceKey: "sigla",
  as: "destino"
});

// EXPORTAÇÃO

module.exports = {
  sequelize,
  unidadeFederativaBrasil,
  etapa,
  logCategoria,
  log,
  usuario,
  configuracaoSlack,
  tipoNotificacaoDados,
  preferenciaVisualizacaoDashboard,
  telaDashboard,
  informacaoContatoCadastro,
  historicoContato,
  empresa,
  funcionario,
  perfilEstimadoTuristas,
  destino,
  pais
}