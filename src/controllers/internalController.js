var internalModel = require("../models/internalModel");
async function cadastrarEnderecoEmpresa(req, res) {
    const {
        nomeFantasiaServer,
        razaoSocialServer,
        cepServer,
        tipoLogradouroServer,
        nomeLogradouroServer,
        numeroServer,
        complementoServer,
        bairroServer,
        cidadeServer,
        siglaUfServer
    } = req.body;

    if (!nomeFantasiaServer || !razaoSocialServer || !cepServer || !tipoLogradouroServer ||
        !nomeLogradouroServer || !numeroServer || complementoServer === undefined ||
        !bairroServer || !cidadeServer || !siglaUfServer) {
        return res.status(400).send("Um ou mais campos de endereço estão undefined!");
    }

    try {
        const resultado = await internalModel.cadastrarEnderecoEmpresa(
            nomeFantasiaServer,
            razaoSocialServer,
            cepServer,
            tipoLogradouroServer,
            nomeLogradouroServer,
            numeroServer,
            complementoServer,
            bairroServer,
            cidadeServer,
            siglaUfServer
        );

        const idEndereco = resultado.insertId;

        res.status(200).json({
            mensagem: "Endereço cadastrado com sucesso!",
            idEndereco,
            siglaUf: siglaUfServer
        });
    } catch (erro) {
        console.error("Erro ao cadastrar endereço:", erro);
        res.status(500).json({ erro: erro.sqlMessage || erro.message });
    }
}

async function cadastrarEmpresa(req, res) {
    const {
        cnpjServer,
        idInformacaoCadastroServer,
        idEndereco,
        siglaUfServer
    } = req.body;

    if (!cnpjServer || !idInformacaoCadastroServer || !idEndereco || !siglaUfServer) {
        return res.status(400).send("Um ou mais campos de empresa estão undefined!");
    }

    try {
        const resultado = await internalModel.cadastrarEmpresa(
            cnpjServer,
            idInformacaoCadastroServer,
            idEndereco,
            siglaUfServer
        );

        res.status(200).json({
            mensagem: "Empresa cadastrada com sucesso!",
            resultado
        });
    } catch (erro) {
        console.error("Erro ao cadastrar empresa:", erro);
        res.status(500).json({ erro: erro.sqlMessage || erro.message });
    }
}


/*function cadastrarEmpresa(req, res) {
    var cnpj = req.body.cnpjServer;
    var nomeFantasia = req.body.nomeFantasiaServer;
    var razaoSocial = req.body.razaoSocialServer;
    var idInformacaoCadastro = req.body.idInformacaoCadastroServer;
    var cep = req.body.cepServer;
    var tipoLogradouro = req.body.tipoLogradouroServer;
    var nomeLogradouro = req.body.nomeLogradouroServer;
    var numero = req.body.numeroServer;
    var complemento = req.body.complementoServer;
    var bairro = req.body.bairroServer;
    var cidade = req.body.cidadeServer;
    var siglaUf = req.body.siglaUfServer;    

    if (cnpj == undefined) {
        res.status(400).send("O CNPJ está undefined!");
    } else if (nomeFantasia == undefined) {
        res.status(400).send("O nome fantasia está undefined!");
    } else if (razaoSocial == undefined) {
        res.status(400).send("A razão social está undefined!");
    } else if (idInformacaoCadastro == undefined) {
        res.status(400).send("O ID da Informacao Cadastro está undefined!");
    } else if (cep == undefined) {
        res.status(400).send("O CEP está undefined!");
    } else if (tipoLogradouro == undefined) {
        res.status(400).send("O tipo de logradouro está undefined!");
    } else if (nomeLogradouro == undefined) {
        res.status(400).send("O nome do logradouro está undefined!");
    } else if (numero == undefined) {
        res.status(400).send("O número está undefined!");
    } else if (complemento == undefined) {
        res.status(400).send("O complemento está undefined!");
    } else if (bairro == undefined) {
        res.status(400).send("O bairro está undefined!");
    } else if (cidade == undefined) {
        res.status(400).send("A cidade está undefined!");
    } else if (siglaUf == undefined) {
        res.status(400).send("A sigla UF está undefined!");
    } else {
        internalModel.cadastrarEmpresa(
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
        )
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            console.log("\nHouve um erro ao realizar o cadastro da empresa! Erro: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
    }    
}
*/
function editarEnderecoEmpresa(req, res) {
    var cnpj = req.body.cnpjServer;
    var cep = req.body.cepServer;
    var tipoLogradouro = req.body.tipoLogradouroServer;
    var nomeLogradouro = req.body.nomeLogradouroServer;
    var numero = req.body.numeroServer;
    var complemento = req.body.complementoServer;
    var bairro = req.body.bairroServer;
    var cidade = req.body.cidadeServer;
    var siglaUf = req.body.siglaUfServer;

    if (!cnpj || !cep || !tipoLogradouro || !nomeLogradouro || !numero || !complemento || !bairro || !cidade || !siglaUf) {
        res.status(400).send("Campos obrigatórios não foram preenchidos!");
    } else {
        internalModel.editarEnderecoEmpresa(
            cnpj,
            cep,
            tipoLogradouro,
            nomeLogradouro,
            numero,
            complemento,
            bairro,
            cidade,
            siglaUf
        )
        .then(function (resultado) {
            if (resultado.affectedRows === 0) {
                res.status(404).send("Nenhuma empresa foi encontrada com o CNPJ informado.");
            } else {
                res.json({ mensagem: "Endereço atualizado com sucesso!" });
            }
        })
        .catch(function (erro) {
            console.log(erro);
            console.log("Erro ao atualizar endereço da empresa:", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
    }
}

function excluirEmpresa(req, res) {
    var cnpj = req.body.cnpjServer;

    if (cnpj == undefined) {
        res.status(400).send("O CNPJ está undefined!");
    } else {
        internalModel.excluirEmpresa(cnpj)
        .then(function (resultado) {
            if (resultado.affectedRows === 0) {
                res.status(404).send("Nenhuma empresa foi encontrada com o CNPJ informado.");
            } else {
                res.json({ mensagem: "Empresa excluída com sucesso!" });
            }
        })
        .catch(function (erro) {
            console.log(erro);
            console.log("\nHouve um erro ao realizar a exclusão da empresa! Erro: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
    }
}

function cadastrarFuncionario(req, res) {
    var nome = req.body.nomeServer;
    var cargo = req.body.cargoServer;
    var telefone = req.body.telefoneServer;
    var cnpjEmpresa = req.body.cnpjEmpresaServer;
    var idInformacao = req.body.idInformacaoServer;
    var siglaUf = req.body.siglaUfServer;

    if (nome == undefined) {
        res.status(400).send("O nome está undefined!");
    } else if (cargo == undefined) {
        res.status(400).send("O cargo está undefined!");
    } else if (telefone == undefined) {
        res.status(400).send("O telefone está undefined!");
    } else if (cnpjEmpresa == undefined) {
        res.status(400).send("O CNPJ da empresa está undefined!");
    } else if (idInformacao == undefined) {
        res.status(400).send("O ID da informação de contato está undefined!");
    } else if (siglaUf == undefined) {
        res.status(400).send("A sigla UF está undefined!");
    } else {
        internalModel.cadastrarFuncionario(
            nome,
            cargo,
            telefone,
            cnpjEmpresa,
            idInformacao,
            siglaUf
        )
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            console.log("\nHouve um erro ao realizar o cadastro do responsável! Erro: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
    }
}

function cadastrarUsuario(req, res) {
    var email = req.body.emailUsuarioServer;
    var senha = req.body.senhaUsuarioServer;
    var permissao = req.body.permissaoUsuarioServer;

    if (email == undefined) {
        res.status(400).send("O email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("A senha está undefined!");
    } else if (permissao == undefined) {
        res.status(400).send("A permissão está undefined!");
    } else {
        internalModel.cadastrarUsuario(
            email,
            senha,
            permissao
        )
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            console.log("\nHouve um erro ao realizar o cadastro do usuário! Erro: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
    }
}

function editarUsuario(req, res){
    var emailUsuario = req.body.emailUsuarioServer;
    var emailNovoUsuario = req.body.emailNovoUsuarioServer;
    var idFuncionario = req.body.idFuncionarioServer;
    var senha = req.body.senhaUsuarioServer;
    var permissao = req.body.permissaoUsuarioServer;
    
    if (!emailUsuario || !emailNovoUsuario || !idFuncionario || !senha || !permissao)
        res.status(400).send("Campos obrigatórios não foram preenchidos!"); 
    else
    {
         internalModel.editarUsuario(emailUsuario, emailNovoUsuario, idFuncionario, senha, permissao).then(function (resultado) {
            if (resultado.affectedRows === 0) {
                res.status(404).send("Nenhum usuário encontrado.");
            } else {
                res.status(200).json({ mensagem: "Funcionário atualizado com sucesso!" });
            }
        })
        .catch(function (erro) {
            console.log(erro);
            console.log("Erro do funcionário:", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
    }
}


function editarFuncionario(req, res) {
    var nomeFuncionario = req.body.nomeServer;
    var nomeNovoFuncionario = req.body.nomeNovoServer;
    var cargo = req.body.cargoServer;
    var telefone = req.body.telefoneServer;
    var cnpj = req.body.cnpjEmpresaServer;
    var idInformacao = req.body.idInformacaoServer;
    var sigla = req.body.siglaUfServer;

    if (!nomeNovoFuncionario || !nomeFuncionario || !cargo || !telefone || !cnpj || !idInformacao || !sigla)
        res.status(400).send("Campos obrigatórios não foram preenchidos!"); 
    else 
    {
        internalModel.editarFuncionario(nomeFuncionario, nomeNovoFuncionario, cargo, telefone, cnpj, idInformacao, sigla).then(function (resultado) {
            if (resultado.affectedRows === 0) {
                res.status(404).send("Nenhum funcionário encontrado.");
            } else {
                res.status(200).json({ mensagem: "Funcionário atualizado com sucesso!" });
            }
        })
        .catch(function (erro) {
            console.log(erro);
            console.log("Erro do funcionário:", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
    }
}

function editarEnderecoEmpresa(req, res) {
    var cnpj = req.body.cnpjServer;
    var cep = req.body.cepServer;
    var tipoLogradouro = req.body.tipoLogradouroServer;
    var nomeLogradouro = req.body.nomeLogradouroServer;
    var numero = req.body.numeroServer;
    var complemento = req.body.complementoServer;
    var bairro = req.body.bairroServer;
    var cidade = req.body.cidadeServer;
    var siglaUf = req.body.siglaUfServer;

    if (!cnpj || !cep || !tipoLogradouro || !nomeLogradouro || !numero || !complemento || !bairro || !cidade || !siglaUf) {
        res.status(400).send("Campos obrigatórios não foram preenchidos!");
    } else {
        internalModel.editarEnderecoEmpresa(
            cnpj,
            cep,
            tipoLogradouro,
            nomeLogradouro,
            numero,
            complemento,
            bairro,
            cidade,
            siglaUf
        )
        .then(function (resultado) {
            if (resultado.affectedRows === 0) {
                res.status(404).send("Nenhuma empresa foi encontrada com o CNPJ informado.");
            } else {
                res.json({ mensagem: "Endereço atualizado com sucesso!" });
            }
        })
        .catch(function (erro) {
            console.log(erro);
            console.log("Erro ao atualizar endereço da empresa:", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
    }
}

function editarInformacoesEmpresariaisEmpresa(req, res) {
    var cnpj = req.body.cnpjServer;
    var cnpjNovo = req.body.cnpjNovoServer;
    var nomeFantasia = req.body.nomeFantasiaServer;
    var razaoSocial = req.body.razaoSocialServer;

    if (cnpj == undefined) {
        res.status(400).send("O CNPJ está undefined!");
    } else if (cnpjNovo == undefined) {
        res.status(400).send("O novo CNPJ está undefined!");
    } else if (nomeFantasia == undefined) {
        res.status(400).send("O nome fantasia está undefined!");
    } else if (razaoSocial == undefined) {
        res.status(400).send("A razão social está undefined!");
    } else {
        internalModel.editarInformacoesEmpresariaisEmpresa(
            cnpj,
            cnpjNovo,
            nomeFantasia,
            razaoSocial
        )
        .then(function (resultado) {
            if (resultado.affectedRows === 0) {
                res.status(404).send("Nenhuma empresa foi encontrada com o CNPJ informado.");
            } else {
                res.json({ mensagem: "Informações empresariais atualizadas com sucesso!" });
            }
        })
        .catch(function (erro) {
            console.log(erro);
            console.log("\nHouve um erro ao realizar a alteração das informações empresariais! Erro: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
    }    
}

function excluirFuncionario(req, res){
    var nomeFuncionario = req.body.nomeFuncionarioServer
    var cnpj = req.body.cnpjEmpresaServer;
    
    if (nomeFuncionario == undefined)
    {
        res.status(400).send("O nome do funcionário está undefined!");
    } else if (cnpj == undefined) {
        res.status(400).send("O CNPJ está undefined!");
    } else {
        internalModel.excluirFuncionario(nomeFuncionario, cnpj)
        .then(function (resultado) {
            if (resultado.affectedRows === 0) {
                res.status(404).send("Nenhum funcionário foi encontrado.");
            } else {
                res.json({ mensagem: "Funcionário excluído com sucesso!" });
            }
        })
        .catch(function (erro) {
            console.log(erro);
            console.log("\nHouve um erro ao realizar a exclusão da funcionário! Erro: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
    }
}

function excluirUsuario(req, res){
    var email = req.body.emailUsuarioServer
    
    if (email == undefined)
    {
        res.status(400).send("O email do usuário está undefined!");
    } else {
        internalModel.excluirUsuario(email)
        .then(function (resultado) {
            if (resultado.affectedRows === 0) {
                res.status(404).send("Nenhum usuário foi encontrado.");
            } else {
                res.json({ mensagem: "Usuário excluído com sucesso!" });
            }
        })
        .catch(function (erro) {
            console.log(erro);
            console.log("\nHouve um erro ao realizar a exclusão do usuário! Erro: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
    }
}



module.exports = {
    cadastrarEmpresa,
    cadastrarEnderecoEmpresa,
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
