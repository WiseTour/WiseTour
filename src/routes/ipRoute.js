var express = require("express");
var router = express.Router();
var axios = require("axios");

// PEGA INFORMAÇÕES DO IP DO USUÁRIO PARA DESCOBRIR O ESTADO
router.get("/estado", async (req, res) => {
  try {
    const ipResponse = await axios.get("https://api64.ipify.org?format=json");
    const ip = ipResponse.data.ip;
    console.log("IP público do usuário:", ip);

    const locationResponse = await axios.get(`http://ip-api.com/json/${ip}`);
    console.log("Resposta da API:", locationResponse.data);

    res.json({ estado: locationResponse.data.regionName || "BRASIL" });
  } catch (error) {
    console.error("Erro ao obter localização:", error);
    res.status(500).json({ erro: "Erro ao obter localização" });
  }
});

// Rota adicional para obter informações completas de localização
router.get("/localizacao", async (req, res) => {
  try {
    const ipResponse = await axios.get("https://api64.ipify.org?format=json");
    const ip = ipResponse.data.ip;
    console.log("IP público do usuário:", ip);

    const locationResponse = await axios.get(`http://ip-api.com/json/${ip}`);
    console.log("Resposta completa da API:", locationResponse.data);

    res.json({
      ip: ip,
      pais: locationResponse.data.country || "Brasil",
      estado: locationResponse.data.regionName || "BRASIL",
      cidade: locationResponse.data.city || "Não identificada",
      cep: locationResponse.data.zip || "Não informado",
      latitude: locationResponse.data.lat || null,
      longitude: locationResponse.data.lon || null,
      provedor: locationResponse.data.isp || "Não identificado",
      timezone: locationResponse.data.timezone || "America/Sao_Paulo"
    });
  } catch (error) {
    console.error("Erro ao obter localização completa:", error);
    res.status(500).json({ erro: "Erro ao obter localização completa" });
  }
});

// Rota para obter apenas o IP público
router.get("/ip-publico", async (req, res) => {
  try {
    const ipResponse = await axios.get("https://api64.ipify.org?format=json");
    const ip = ipResponse.data.ip;
    console.log("IP público solicitado:", ip);

    res.json({ ip: ip });
  } catch (error) {
    console.error("Erro ao obter IP público:", error);
    res.status(500).json({ erro: "Erro ao obter IP público" });
  }
});

module.exports = router;