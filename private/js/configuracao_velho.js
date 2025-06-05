document.addEventListener("DOMContentLoaded", () => {
    const btnNovoUsuario = document.getElementById("btn-novo-usuario");
    const formCadastro = document.getElementById("form-cadastro");
    const btnCancelar = document.getElementById("btn-cancelar");
    const formUsuario = document.getElementById("form-usuario");
    const corpoTabela = document.getElementById("corpo-tabela");

    let usuarios = [];
    let editandoIndex = null;

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
        formUsuario.reset();
        formCadastro.style.display = "none";
        editandoIndex = null;
    });

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
