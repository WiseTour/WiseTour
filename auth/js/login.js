function entrar() {
  var emailVar = document.getElementById("email_input").value;
  var senhaVar = document.getElementById("senha_input").value;

  if (emailVar == "" || senhaVar == "") {
    document.getElementById("cardErro").style.display = "block";
    document.getElementById("mensagem_erro").innerHTML =
      "(Mensagem de erro para todos os campos em branco)";
    return false;
  } else {
    setInterval(sumirMensagem, 5000);
  }

  console.log("FORM LOGIN: ", emailVar);
  console.log("FORM SENHA: ", senhaVar);

  fetch("/usuario/autenticar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      emailServer: emailVar,
      senhaServer: senhaVar,
    }),
  })
    .then(function (resposta) {
      if (resposta.ok) {
        resposta.json().then((json) => {
          console.log(json);

          const usuario = {
            email: json.email,
            id_usuario: json.id_usuario,
            permissao: json.permissao,
          };

          localStorage.setItem("usuario", JSON.stringify(usuario));

          if (json.permissao == "wisetour") {
            setTimeout(function () {
              window.location.href = "/internal/configuracao-cadastral-empresa.html";
            }, 1000);
          } else if (json.permissao == "padrao" || json.permissao == "admin") {
            // Para usuários padrão e admin, buscar preferências primeiro
            fetch(
              `/preferenciaVisualizacaoDashboard/usuario/preferencias-visualizacao-dashboard?id_usuario=${usuario.id_usuario}`
            )
              .then((res) => {
                if (!res.ok)
                  throw new Error("Erro ao buscar preferências do usuário");
                return res.json();
              })
              .then((preferencias) => {
                // Armazena no localStorage
                localStorage.setItem(
                  "preferenciaUsuario",
                  JSON.stringify(preferencias)
                );

                // Função para determinar a URL de redirecionamento
                function determinarRedirecionamento(preferencias) {
                  // Verificar se tem panoramaGeral ativo
                  const panoramaGeral = preferencias.find(
                    (p) =>
                      p.tela_dashboard?.tela === "panoramaGeral" ||
                      p.fk_tela_dashboard === 1
                  );
                  if (panoramaGeral && panoramaGeral.ativo === "sim") {
                    return "/private/index.html";
                  }

                  // Verificar se tem perfilTurista ativo
                  const perfilTurista = preferencias.find(
                    (p) =>
                      p.tela_dashboard?.tela === "perfilTurista" ||
                      p.fk_tela_dashboard === 2
                  );
                  if (perfilTurista && perfilTurista.ativo === "sim") {
                    return "/private/perfilturista.html";
                  }

                  // Verificar se tem sazonalidade ativo
                  const sazonalidade = preferencias.find(
                    (p) =>
                      p.tela_dashboard?.tela === "sazonalidade" ||
                      p.fk_tela_dashboard === 3
                  );
                  if (sazonalidade && sazonalidade.ativo === "sim") {
                    return "/private/sazonalidade.html";
                  }

                  // Se não tiver nenhum ativo, vai para configurações
                  return "/private/configuracoes.html";
                }

                const urlRedirecionamento = determinarRedirecionamento(preferencias);
                
                setTimeout(function () {
                  window.location.href = urlRedirecionamento;
                }, 1000);
              })
              .catch((err) => {
                console.error("Erro:", err);
                alert("Não foi possível carregar as preferências do usuário");
                // Em caso de erro, redireciona para configurações
                setTimeout(function () {
                  window.location.href = "/private/configuracoes.html";
                }, 1000);
              });
          } else {
            alert("Houve um erro ao tentar realizar o login!");
          }
        });
      } else {
        resposta.text().then((texto) => {
          console.error(texto);

          // Mostra alerta se for erro de login inválido
          if (texto === "Email e/ou senha inválido(s)") {
            alert("Email ou senha inválidos. Verifique seus dados.");
          } else if (
            texto === "Mais de um usuário com o mesmo login e senha!"
          ) {
            alert("Conflito de dados: mais de um usuário com esse login.");
          } else {
            alert("Erro ao tentar realizar o login: " + texto);
          }
        });
      }
    })
    .catch(function (erro) {
      console.log(erro);
      alert("Erro na comunicação com o servidor.");
    });

  return false;
}

function sumirMensagem() {
  document.getElementById("cardErro").style.display = "none";
}
