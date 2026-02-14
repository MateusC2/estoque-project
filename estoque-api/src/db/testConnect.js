const { pool } = require("./connect");

let attempts = 0;
const MAXATTEMPTS = 5;
const DELAY = 3000;

module.exports = function testConnection() {
  pool.query("SELECT 1", (err, result) => {
    if (err) {
      attempts++;
      if (attempts < MAXATTEMPTS) {
        console.log(`⚠️  Tentativa ${attempts}/${MAXATTEMPTS}: Conexão com MySQL falhou. Tentando novamente em ${DELAY / 1000}s...`);
        setTimeout(testConnection, DELAY);
      } else {
        console.warn(`⚠️  Não foi possível conectar ao MySQL após ${MAXATTEMPTS} tentativas.`);
        console.warn(`    Verifique se o MySQL está rodando em ${process.env.DATABASEHOST}:3306`);
      }
    } else {
      console.log("✅ Conexão com MySQL estabelecida com sucesso!");
    }
  });
};
