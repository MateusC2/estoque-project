const app = require("./index");
const testConnect = require('./db/testConnect');

const port = process.env.PORT || 5000;

testConnect();

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});

