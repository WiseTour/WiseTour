document.addEventListener("DOMContentLoaded", () => {
    const btnNovoUsuario = document.getElementById("btn-novo-usuario");
    const formCadastro = document.getElementById("form-cadastro");
    const btnCancelar = document.getElementById("btn-cancelar");
    const formUsuario = document.getElementById("form-usuario");
    const corpoTabela = document.getElementById("corpo-tabela");
    const cnpjAdminLogado = '12345678000199';

    let usuarios = [];
    let editandoIndex = null;

    fetch(`/funcionario/empresa/${cnpjAdminLogado}`)
    .then(res => {
        if (!res.ok) {
        throw new Error('Erro na resposta do servidor');
        }
        return res.json();
    })
    .then(data => {
        if (!Array.isArray(data)) {
        throw new Error(data.message || 'Resposta inesperada do servidor');
        }

        usuarios = data.map(f => ({
        nome: f.nome,
        cargo: f.cargo,
        telefone: f.telefone,
        email: f.usuario?.email || 'sem email'
        }));

        atualizarTabela();
    })
    .catch(err => {
        console.error('Erro ao buscar usuários da empresa:', err.message);
        // opcional: alertar usuário ou mostrar na tela
    });



    btnNovoUsuario.addEventListener("click", () => {
        formCadastro.style.display = "block";
        formUsuario.reset();
        editandoIndex = null;
    });

    btnCancelar.addEventListener("click", () => {
        formCadastro.style.display = "none";
        formUsuario.reset();
        editandoIndex = null;
    });

    formUsuario.addEventListener("submit", (e) => {
        e.preventDefault();

        const nome = formUsuario.nome.value;
        const cargo = formUsuario.cargo.value;
        const telefone = formUsuario.telefone.value;
        const email = formUsuario.email.value;

        const usuario = { nome, cargo, telefone, email };

        if (editandoIndex !== null) {
            usuarios[editandoIndex] = usuario;
        } else {
            usuarios.push(usuario);
        }

        atualizarTabela();
        cadastrarFuncionario(cadastrarInfoContato(usuario))
        formUsuario.reset();
        formCadastro.style.display = "none";
        editandoIndex = null;
    });



    function cadastrarInfoContato(usuario) {
        fetch("/usuario/cadastrar_info_contato", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                nomeServer: usuario.nome,
                emailServer: usuario.email,
                numeroUsuarioServer: usuario.telefone,
            }),
        })
            .then(function (resposta) {
                console.log("resposta: ", resposta);

                if (resposta.ok) {
                    return resposta.json()
                } else {
                    throw "Houve um erro ao tentar realizar o cadastro!";
                }
            })
            .catch(function (resposta) {
                console.log(`#ERRO: ${resposta}`);
            });
        return false;
    }


    function atualizarTabela() {
        corpoTabela.innerHTML = "";
        usuarios.forEach((u, index) => {
            const linha = document.createElement("tr");

            linha.innerHTML = `
                <td>${u.nome}</td>
                <td>${u.cargo}</td>
                <td>${u.telefone}</td>
                <td>${u.email}</td>
                <td>
                    <button onclick="editarUsuario(${index})">✏️</button>
                    <button onclick="removerUsuario(${index})">🗑️</button>
                </td>
            `;

            corpoTabela.appendChild(linha);
        });
    }

    window.editarUsuario = function (index) {
        const u = usuarios[index];
        formUsuario.nome.value = u.nome;
        formUsuario.cargo.value = u.cargo;
        formUsuario.telefone.value = u.telefone;
        formUsuario.email.value = u.email;
        formCadastro.style.display = "block";
        editandoIndex = index;
    };

    window.removerUsuario = function (index) {
        if (confirm("Tem certeza que deseja remover este usuário?")) {
            usuarios.splice(index, 1);
            atualizarTabela();
        }
    };
});
