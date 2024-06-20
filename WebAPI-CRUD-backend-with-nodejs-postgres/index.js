require("dotenv").config();

const db = require("./db");

const port = process.env.PORT;

const express = require('express');

const app = express();

// app.get('caminho da rota', (função de callback (a função que vai ser disparada quando a rota é chamada))=> {})

app.get('/', (req, res) => {
    res.json({
        message: "Funcionando!!!"
    })
})

app.listen(port);

console.log("Backend is running")