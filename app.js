// var ambiente_processo = 'producao';
var ambiente_processo = "desenvolvimento";

var caminho_env = ambiente_processo === "producao" ? ".env" : ".env.dev";
// Acima, temos o uso do operador ternário para definir o caminho do arquivo .env
// A sintaxe do operador ternário é: condição ? valor_se_verdadeiro : valor_se_falso

require("dotenv").config({ path: caminho_env });

var express = require("express");
var cors = require("cors");
var path = require("path");
var PORTA_APP = process.env.APP_PORT;
var HOST_APP = process.env.APP_HOST;

var app = express();

// PEGA INFORMAÇÕES DO IP DO USUÁRIO PARA DESCOBRIR O ESTADO

var axios = require("axios");

app.get("/estado", async (req, res) => {
    try {
        const ipResponse = await axios.get('https://api64.ipify.org?format=json');
        const ip = ipResponse.data.ip;
        console.log('IP público do usuário:', ip);
    
        const locationResponse = await axios.get(`http://ip-api.com/json/${ip}`);
        console.log('Resposta da API:', locationResponse.data);
    
        res.json({ estado: locationResponse.data.regionName || 'BRASIL' });
      } catch (error) {
        console.error('Erro ao obter localização:', error);
        res.status(500).json({ erro: 'Erro ao obter localização' });
      }
});

// /PEGA INFORMAÇÕES DO IP DO USUÁRIO PARA DESCOBRIR O ESTADO

var indexRouter = require("./src/routes/index");
var usuarioRouter = require("./src/routes/usuarios");
var internalRoutes = require("./src/routes/internalRoutes");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
}); // Definição de rota para o arquivo home html quando iniciar a API
app.use(express.static(path.join(__dirname, "public")));
app.use("/common", express.static(path.join(__dirname, "common")));
app.use("/auth", express.static(path.join(__dirname, "auth")));
app.use("/private", express.static(path.join(__dirname, "private")));
app.use("/internal", express.static(path.join(__dirname, "internal")));
app.use(cors());

app.use("/", indexRouter);
app.use("/usuarios", usuarioRouter);
app.use("/internalRoutes", internalRoutes);

app.listen(PORTA_APP, function () {
  console.log(`
    ##   ##  ######   #####             ####       ##     ######     ##              ##  ##    ####    ######  
    ##   ##  ##       ##  ##            ## ##     ####      ##      ####             ##  ##     ##         ##  
    ##   ##  ##       ##  ##            ##  ##   ##  ##     ##     ##  ##            ##  ##     ##        ##   
    ## # ##  ####     #####    ######   ##  ##   ######     ##     ######   ######   ##  ##     ##       ##    
    #######  ##       ##  ##            ##  ##   ##  ##     ##     ##  ##            ##  ##     ##      ##     
    ### ###  ##       ##  ##            ## ##    ##  ##     ##     ##  ##             ####      ##     ##      
    ##   ##  ######   #####             ####     ##  ##     ##     ##  ##              ##      ####    ######  
    \n\n\n                                                                                                 
    Servidor do seu site já está rodando! Acesse o caminho a seguir para visualizar .: http://localhost:${PORTA_APP} :. \n\n
    Você está rodando sua aplicação em ambiente de .:${process.env.AMBIENTE_PROCESSO}:. \n\n
    \tSe .:desenvolvimento:. você está se conectando ao banco local. \n
    \tSe .:producao:. você está se conectando ao banco remoto. \n\n
    \t\tPara alterar o ambiente, comente ou descomente as linhas 1 ou 2 no arquivo 'app.js'\n\n`);
});
