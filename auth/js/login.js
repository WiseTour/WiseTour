
function entrar() {
    var emailVar = document.getElementById('email_input').value;
    var senhaVar = document.getElementById('senha_input').value;

    if (emailVar == "" || senhaVar == "") {
      document.getElementById('cardErro').style.display = "block";
      document.getElementById('mensagem_erro').innerHTML = "(Mensagem de erro para todos os campos em branco)";
      return false;
    } else {
      setInterval(sumirMensagem, 5000);
    }

    console.log("FORM LOGIN: ", emailVar);
    console.log("FORM SENHA: ", senhaVar);

    if(senhaVar == "admin123"){

            setTimeout(function () {
              window.location.href = "/internal/configuracao-cadastral-empresa.html";
            }, 1000);

          }else if(senhaVar == "urubu100"){

            setTimeout(function () {
              window.location.href = "/private/index.html";
            }, 1000);

          }else{
            alert("Houve um erro ao tentar realizar o login!");
          }

    // fetch("/usuarios/autenticar", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json"
    //   },
    //   body: JSON.stringify({
    //     emailServer: emailVar,
    //     senhaServer: senhaVar
    //   })
    // }).then(function (resposta) {

    //   if (resposta.ok) {
    //     resposta.json().then(json => {
    //       console.log(json);

    //       sessionStorage.setItem("EMAIL_USUARIO", json.email);
    //       sessionStorage.setItem("ID_USUARIO", json.id_usuario);
    //       sessionStorage.setItem("PERMISSAO", json.permissao);

    //       if(json.permissao == "admin"){

    //         setTimeout(function () {
    //           window.location.href = "/internal/configuracao-cadastral-empresa.html";
    //         }, 1000);

    //       }else if(json.permissao == "padrao"){

    //         setTimeout(function () {
    //           window.location.href = "/private/index.html";
    //         }, 1000);

    //       }else{
    //         alert("Houve um erro ao tentar realizar o login!");
    //       }

          
    //     });
    //   } else {
    //     resposta.text().then(texto => {
    //       console.error(texto);
    
    //       // Mostra alerta se for erro de login inválido
    //       if (texto === "Email e/ou senha inválido(s)") {
    //         alert("Email ou senha inválidos. Verifique seus dados.");
    //       } else if (texto === "Mais de um usuário com o mesmo login e senha!") {
    //         alert("Conflito de dados: mais de um usuário com esse login.");
    //       } else {
    //         alert("Erro ao tentar realizar o login: " + texto);
    //       }
    //     });
    //   }
    
    // }).catch(function (erro) {
    //   console.log(erro);
    //   alert("Erro na comunicação com o servidor.");
    // });

    // return false;


  }

  function sumirMensagem() {
    document.getElementById('cardErro').style.display = "none";
  }
