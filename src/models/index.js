const { sequelize } = require('../database/sequelizeConfig');

const UnidadeFederativaBrasil = require('../models/UnidadeFederativaBrasil');
const Etapa = require('../models/Etapa');
const LogCategoria = require('../models/LogCategoria');
const Log = require('../models/Log');
const Usuario = require('../models/Usuario');
const ConfiguracaoSlack = require('../models/ConfiguracaoSlack');
const TipoNotificacao = require('../models/TipoNotificacao');
const PreferenciasVisualizacaoDashboard = require('../models/PreferenciasVisualizacaoDashboard');
const TelaDashboard = require('../models/TelaDashboard');
const InformacaoContatoCadastro = require('../models/InformacaoContatoCadastro');
const HistoricoContato = require('../models/HistoricoContato');
const Endereco = require('../models/Endereco');
const Empresa = require('../models/Empresa');
const Funcionario = require('../models/Funcionario');

// RELACIONAMENTOS

// Endereco -> UnidadeFederativaBrasil
Endereco.belongsTo(UnidadeFederativaBrasil, { foreignKey: 'fk_uf_sigla' });
UnidadeFederativaBrasil.hasMany(Endereco, { foreignKey: 'fk_uf_sigla' });

// HistoricoContato -> InformacaoContatoCadastro
HistoricoContato.belongsTo(InformacaoContatoCadastro, { foreignKey: 'fk_informacao_contato_cadastro' });
InformacaoContatoCadastro.hasMany(HistoricoContato, { foreignKey: 'fk_informacao_contato_cadastro' });

// Empresa -> HistoricoContato
Empresa.belongsTo(HistoricoContato, { foreignKey: 'fk_informacao_contato_cadastro' });
HistoricoContato.hasMany(Empresa, { foreignKey: 'fk_informacao_contato_cadastro' });

// Empresa -> Endereco
Empresa.belongsTo(Endereco, { foreignKey: 'fk_endereco' });
Empresa.belongsTo(Endereco, { foreignKey: 'fk_uf_sigla' });
Endereco.hasMany(Empresa, { foreignKey: 'fk_endereco' });
Endereco.hasMany(Empresa, { foreignKey: 'fk_uf_sigla' });

// Funcionario -> Empresa
Funcionario.belongsTo(Empresa, { foreignKey: 'fk_cnpj' });
Funcionario.belongsTo(Empresa, { foreignKey: 'fk_informacao_contato_cadastro' });
Funcionario.belongsTo(Empresa, { foreignKey: 'fk_endereco' });
Funcionario.belongsTo(Empresa, { foreignKey: 'fk_uf_sigla' });

Empresa.hasMany(Funcionario, { foreignKey: 'fk_cnpj' });
Empresa.hasMany(Funcionario, { foreignKey: 'fk_informacao_contato_cadastro' });
Empresa.hasMany(Funcionario, { foreignKey: 'fk_endereco' });
Empresa.hasMany(Funcionario, { foreignKey: 'fk_uf_sigla' });

// Funcionario -> Usuario
Funcionario.belongsTo(Usuario, { foreignKey: 'fk_usuario' });
Usuario.hasOne(Funcionario, { foreignKey: 'fk_usuario' });


// EXPORTAÇÃO

module.exports = {
  sequelize,
  UnidadeFederativaBrasil,
  Etapa,
  LogCategoria,
  Log,
  Usuario,
  ConfiguracaoSlack,
  TipoNotificacao,
  PreferenciasVisualizacaoDashboard,
  TelaDashboard,
  InformacaoContatoCadastro,
  HistoricoContato,
  Empresa,
  Funcionario,
};
