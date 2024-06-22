async function connect() {
    const { Pool } = require("pg");

    // When I call the connect function again, I will check if I already have a global.connection loaded. If there is, then I'll just return it.
    // This strategy is called a singleton. It prevents you from completely recreating objects all the time.
    if(global.connection)
        return global.connection.connect();

    const pool = new Pool({
        user: process.env.USER_NAME,
        host: process.env.HOST_NAME,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        dialect: process.env.DB_DIALECT,
        port: process.env.PORT_NUMBER
    })

    const client = await pool.connect();
    console.log("Connection pool created successfully!")

    const resdb = await client.query("SELECT now()");
    console.log(resdb.rows[0]);
    client.release()

    // We can save our pool in global connection. Then we can do the "if" like at begining of this file
    global.connection = pool;

    return pool.connect()
}

connect(); // Remembering/Reminder: we have to load/import the db.js file there in our index.js back-end.


// Function to list customers
async function selectCustomers() {
    // Establish connection
    const client = await connect();

    // Send sql command to the database
    const res = await client.query("SELECT * FROM clientes");

    return res.rows;
}

// Function to list one customer
async function selectCustomer(id) {
    // Establish connection
    const client = await connect();

    // Send sql command to the database
    // const res = await client.query("SELECT * FROM clientes WHERE ID=" +id); // This can cause SQL injection
    const res = await client.query("SELECT * FROM clientes WHERE ID=$1", [id]); // Prepared statement or prepared query

    return res.rows;
}

// Function to insert customers
async function insertCustomer(customer) {
    // Establish connection
    const client = await connect();
    // query
    const sql = "INSERT INTO clientes(nome, idade, uf) VALUES ($1, $2, $3)";
    // parameters that must be injected into the query
    const values = [customer.nome, customer.idade, customer.uf];

    // does not have a return
    await client.query(sql, values)
}

// Function to edit/update customers

// Function to delete customers


module.exports = {
    selectCustomers,
    selectCustomer,
    insertCustomer
}