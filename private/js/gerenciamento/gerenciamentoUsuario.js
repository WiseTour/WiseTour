import { aplicarMascaraCelular, removerMascara } from '../utils/mascara.js';

export function preencherCamposUsuario(data) {
  document.getElementById("nome").value = data.funcionario.nome || "";
  document.getElementById("funcao").value = data.funcionario.cargo || "";
  document.getElementById("telefone").value = aplicarMascaraCelular(data.funcionario.telefone) || "";
  document.getElementById("email").value = data.email || "";

  document.getElementById("span-passaporte").innerText = data.id_usuario || "";
  document.getElementById("span-nome").innerText = data.funcionario.nome || "";
  document.getElementById("span-funcao").innerText = data.funcionario.cargo || "";
}

export function preencherCamposGerenciamentoSenha(data, senha) {
  document.getElementById("nome_gerenciamento_senha").value = data.funcionario.nome || "";
  document.getElementById("email_gerenciamento_senha").value = data.email || "";
  document.getElementById("senha_gerenciamento_senha").value = senha || "";
  document.getElementById("nova_senha_gerenciamento_senha").value = "";
}


export function alterarInformacoesUsuario() {
  const usuario = JSON.parse(sessionStorage.getItem("usuario"));

  if (!usuario || !usuario.id_usuario) {
    alert("Usuário não encontrado.");
    return;
  }

  const informacoes = {
    id_usuario: usuario.id_usuario,
    id_funcionario: usuario.funcionario.id_funcionario,
    nome: document.getElementById("nome").value,
    cargo: document.getElementById("funcao").value,
    telefone: removerMascara(document.getElementById("telefone").value),
    email: document.getElementById("email").value,
  };

  fetch(`/usuario/alterar_informacoes`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(informacoes),
  })
    .then((response) => {
      if (!response.ok) throw new Error("Erro ao atualizar informações");
      return response.json();
    })
    .then((data) => {
      console.log("Informações atualizadas:", data);
      alert("Informações atualizadas com sucesso!");
      window.location.reload();
    })
    .catch((error) => {
      console.error("Erro:", error);
      alert("Não foi possível atualizar os dados do funcionário");
    });
}


export function alterarSenhaUsuario() {
  const usuario = JSON.parse(sessionStorage.getItem("usuario"));

  if (!usuario || !usuario.id_usuario) {
    alert("Usuário não encontrado.");
    return;
  }

  const novaSenha = document.getElementById("nova_senha_gerenciamento_senha").value;

  if (!novaSenha) {
    alert("Por favor, preencha o campo de nova senha.");
    return;
  }

  const dadosSenha = {
    id_usuario: usuario.id_usuario,
    senha: novaSenha,
  };

  fetch(`/usuario/alterar_senha`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dadosSenha),
  })
    .then((response) => {
      if (!response.ok) throw new Error("Erro ao atualizar a senha");
      return response.json();
    })
    .then((data) => {
      console.log("Senha atualizada:", data);
      alert("Senha atualizada com sucesso!");
      window.location.reload();
    })
    .catch((error) => {
      console.error("Erro:", error);
      alert("Não foi possível atualizar a senha");
    });
}
