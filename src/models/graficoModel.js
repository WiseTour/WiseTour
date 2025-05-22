const database = require('../database/config');

function listarDados() {
    const instrucao = `SELECT mes,
       chegadas,
       CASE mes
           WHEN 1 THEN 'Janeiro'
           WHEN 2 THEN 'Fevereiro'
           WHEN 3 THEN 'Março'
           WHEN 4 THEN 'Abril'
           WHEN 5 THEN 'Maio'
           WHEN 6 THEN 'Junho'
           WHEN 7 THEN 'Julho'
           WHEN 8 THEN 'Agosto'
           WHEN 9 THEN 'Setembro'
           WHEN 10 THEN 'Outubro'
           WHEN 11 THEN 'Novembro'
           WHEN 12 THEN 'Dezembro'
       END AS mes_nome
FROM Chegada_Turistas_Internacionais_Brasil_Mensal
WHERE ano = 2023
ORDER BY mes;
`;
    return database.executar(instrucao);
}

module.exports = {
    listarDados
};
