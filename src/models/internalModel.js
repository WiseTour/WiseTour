var database = require("../database/config")

function cadastrarEmpresa(
    cnpj,
    nomeFantasia,
    razaoSocial,
    idInformacaoCadastro,
    cep,
    tipoLogradouro,
    nomeLogradouro,
    numero,
    complemento,
    bairro,
    cidade,
    siglaUf
) {
    console.log("ACESSEI O EMPRESA MODEL");

    var instrucaoSql = `
        INSERT INTO empresa (
            cnpj, nome_fantasia, razao_social, fk_informacao_contato_cadastro, cep, tipo_logradouro,
            nome_logradouro, numero, complemento, bairro, cidade, fk_uf_sigla
        ) VALUES (
            '${cnpj}', '${nomeFantasia}', '${razaoSocial}', '${idInformacaoCadastro}', '${cep}', '${tipoLogradouro}',
            '${nomeLogradouro}', '${numero}', '${complemento}', '${bairro}', '${cidade}', '${siglaUf}'
        );
    `;
    console.log("Executando a instrução SQL:\n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function excluirEmpresa(cnpj) {
    console.log("ACESSEI O RESPONSÁVEL MODEL");

    var instrucaoSql = `
        DELETE FROM Empresa WHERE cnpj = '${cnpj}';
    `;

    console.log("Executando a instrução SQL:\n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function editarInformacoesEmpresariaisEmpresa(
    cnpj,
    cnpjNovo,
    nomeFantasia,
    razaoSocial
) {
    console.log("ACESSEI O EMPRESA MODEL - editarEmpresa");

    var instrucaoSql = `
        UPDATE Empresa 
        SET 
            cnpj = '${cnpjNovo}',
            nome_fantasia = '${nomeFantasia}',
            razao_social = '${razaoSocial}'
        WHERE 
            cnpj = '${cnpj}';
    `;

    console.log("Executando a instrução SQL:\n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function editarEnderecoEmpresa(
    cnpj,
    cep,
    tipoLogradouro,
    nomeLogradouro,
    numero,
    complemento,
    bairro,
    cidade,
    siglaUf
) {
    console.log("ACESSEI O MODEL para editar endereço da empresa!");

    const instrucaoSql = `
        UPDATE Empresa SET
            cep = '${cep}',
            tipo_logradouro = '${tipoLogradouro}',
            nome_logradouro = '${nomeLogradouro}',
            numero = ${numero},
            complemento = ${complemento ? `'${complemento}'` : 'NULL'},
            bairro = '${bairro}',
            cidade = '${cidade}',
            fk_uf_sigla = '${siglaUf}'
        WHERE cnpj = '${cnpj}';
    `;

    console.log("Executando SQL:\n", instrucaoSql);
    return database.executar(instrucaoSql);
}


function cadastrarFuncionario(
    nome,
    cargo,
    telefone,
    cnpjEmpresa,
    idInformacao,
    siglaUf
) {
    console.log("ACESSEI O RESPONSÁVEL MODEL");

    var instrucaoSql = `
        INSERT INTO funcionario (
            nome, cargo, telefone, fk_cnpj, fk_informacao_contato_cadastro, fk_uf_sigla
        ) VALUES (
            '${nome}', '${cargo}', '${telefone}', '${cnpjEmpresa}', '${idInformacao}', '${siglaUf}'
        );
    `;
    console.log("Executando a instrução SQL:\n" + instrucaoSql);
    return database.executar(instrucaoSql);
}


function cadastrarUsuario(email, senha, permissao) {
    console.log("ACESSEI O USUÁRIO MODEL");

    var instrucaoSql = `
        INSERT INTO usuario (
            email, senha, permissao
        ) VALUES (
            '${email}', '${senha}', '${permissao}'
        );
    `;
    console.log("Executando a instrução SQL:\n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    cadastrarEmpresa,
    excluirEmpresa,
    editarInformacoesEmpresariaisEmpresa,
    editarEnderecoEmpresa,
    cadastrarFuncionario,
    cadastrarUsuario
};