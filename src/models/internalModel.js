var database = require("../database/config")

function cadastrarEmpresa(cnpj, idInformacaoCadastro, idEndereco, siglaUf) {
    console.log("ACESSEI O MODEL - cadastrarEmpresa");

    const instrucaoSql = `
        INSERT INTO empresa (
            cnpj, fk_informacao_contato_cadastro, fk_endereco, fk_uf_sigla
        ) VALUES (
            '${cnpj}', '${idInformacaoCadastro}', '${idEndereco}', '${siglaUf}'
        );
    `;

    console.log("Executando a instrução SQL (empresa):\n" + instrucaoSql);
    return database.executar(instrucaoSql);
}


function cadastrarEmpresaEndereco(nomeFantasia, razaoSocial, cep, tipoLogradouro, nomeLogradouro, numero, complemento, bairro, cidade, siglaUf) {
    console.log("ACESSEI O MODEL - cadastrarEmpresaEndereco");

    const instrucaoSql = `
        INSERT INTO endereco (
            nome_fantasia, razao_social, cep, tipo_logradouro,
            nome_logradouro, numero, complemento, bairro, cidade, fk_uf_sigla
        ) VALUES (
            '${nomeFantasia}', '${razaoSocial}', '${cep}', '${tipoLogradouro}',
            '${nomeLogradouro}', '${numero}', '${complemento}', '${bairro}', '${cidade}', '${siglaUf}'
        );
    `;
    
    console.log("Executando a instrução SQL (endereço):\n" + instrucaoSql);
    return database.executar(instrucaoSql); // Retorna um objeto com insertId
}

function excluirEmpresa(cnpj) {
    console.log("ACESSEI O RESPONSÁVEL MODEL");

    var instrucaoSql = `
        DELETE FROM empresa WHERE cnpj = '${cnpj}';
    `;

    console.log("Executando a instrução SQL:\n" + instrucaoSql);
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
        UPDATE endereco SET
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

function editarInformacoesEmpresariaisEmpresa(
    cnpj,
    cnpjNovo,
    nomeFantasia,
    razaoSocial
) {
    console.log("ACESSEI O EMPRESA MODEL - editarEmpresa");

    var instrucaoSql = `
        UPDATE empresa 
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

function editarFuncionario(nomeFuncionario,nomeNovoFuncionario, cargo, telefone, cnpj, idInformacao, sigla)
{
    console.log("ACESSEI O MODEL para editar o funcionário!");

    const instrucaoSql = `
        UPDATE funcionario SET
            nome = '${nomeNovoFuncionario}',
            cargo = '${cargo}',
            telefone = '${telefone}',
            fk_cnpj = '${cnpj}',
            fk_informacao_contato_cadastro = ${idInformacao},
            fk_uf_sigla = '${sigla}'
        WHERE nome = '${nomeFuncionario}' AND fk_cnpj = '${cnpj}';
    `;
    console.log("Executando SQL:\n", instrucaoSql);
    return database.executar(instrucaoSql);
}

function editarUsuario(emailUsuario, emailNovoUsuario, idFuncionario, senha, permissao)
{
    console.log("ACESSEI O MODEL para editar endereço do usuário!");

    const instrucaoSql = `
        UPDATE usuario SET
            email = '${emailNovoUsuario}',
            fk_funcionario = ${idFuncionario},
            senha = '${senha}',
            permissao = '${permissao}'
        WHERE email = '${emailUsuario}';
    `;
    console.log("Executando SQL:\n", instrucaoSql);
    return database.executar(instrucaoSql);
}

function excluirFuncionario(nomeFuncionario, cnpj)
{
    console.log("ACESSEI O RESPONSÁVEL MODEL");

    var instrucaoSql = `
        DELETE FROM funcionario WHERE nome = '${nomeFuncionario}' AND fk_cnpj = '${cnpj}';
    `;

    console.log("Executando a instrução SQL:\n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function excluirUsuario(email)
{
    console.log("ACESSEI O RESPONSÁVEL MODEL");

    var instrucaoSql = `
        DELETE FROM usuario WHERE email = '${email}';
    `;
    console.log("Executando a instrução SQL:\n" + instrucaoSql);
    return database.executar(instrucaoSql);
}


module.exports = {
    cadastrarEmpresa,
    cadastrarEmpresaEndereco,
    excluirEmpresa,
    editarInformacoesEmpresariaisEmpresa,
    editarEnderecoEmpresa,
    cadastrarFuncionario,
    cadastrarUsuario,
    editarFuncionario,
    editarUsuario,
    excluirFuncionario,
    excluirUsuario
};