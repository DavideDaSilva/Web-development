require("dotenv").config();

const db = require("./db");

const port = process.env.PORT;

const express = require('express');

const app = express();

// as the data that we are going to insert into the database is arriving in .json format, we have to prepare the back-end to receive this data
app.use(express.json());

// app.get('caminho da rota', (função de callback (a função que vai ser disparada quando a rota é chamada))=> {})

app.get('/', (req, res) => {
    res.json({
        message: "Funcionando!!!"
    })
})

// Route to list one customer
app.get('/clientes/:id', async (req, res) => {
    const cliente = await db.selectCustomer(req.params.id);

    res.json(cliente);
})

// Route to list all customers
app.get('/clientes', async (req, res) => {
    const clientes = await db.selectCustomers();

    res.json(clientes);
})

// Route to insert customers
// To test this Route I used postman
app.post('/clientes', async (req, res) => {
    await db.insertCustomer(req.body);
    res.sendStatus(201) // 201 is the success code
})

// Route to edit/update customers
app.patch("/clientes/:id", async (req, res) => {
    await db.updateCustomer(req.params.id, req.body)
    res.sendStatus(200) // 200 is the udpate code
})

// Route to delete customers

app.listen(port);

console.log("Backend is running")