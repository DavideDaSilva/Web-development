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

// Route to list customers
app.get('/clientes', async (req, res) => {
    const clientes = await db.selectCustomers();
    res.json(clientes);
})

// Route to insert customers

// Route to edit/update customers

// Route to delete customers

app.listen(port);

console.log("Backend is running")