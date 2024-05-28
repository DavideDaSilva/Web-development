const express = require('express');
const app = express();
const Pool = require('pg').Pool;
const path = require('path');
const ejs = require('ejs');
const PORT =3000;
require('dotenv').config();

const pool = new Pool({
    user: process.env.USER_NAME,
    host: process.env.HOST_NAME,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    dialect: process.env.DB_DIALECT,
    port: process.env.PORT_NUMBER
})


pool.connect((err, client, release)=> {
    if (err) {
        return console.error('Error in connection!')
    }
    client.query('SELECT NOW()', (err, result)=>{
        release()
        if (err) {
            return console.error("Error Executing query")
        }
        console.log("Connected to database!")
    })
})

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use('/static', express.static('static'))

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.get('/', async(req, res) =>{
    const data = await pool.query(`SELECT * FROM todo`);
    res.render('index', {data: data.rows})
})

// ADD TODO ENDPOINT
app.post('/addTodo', async(req, res)=>{
    const {todo, date} = req.body;

    try {
        const result = await pool.query(`INSERT INTO todo (todo, date) VALUES ($1, $2) RETURNING *`, [todo, date])
        // The RETURNING* clause returns all values ​​from the newly inserted row, including all columns.
        console.log(result)
        res.redirect('/') // REDIRECT TO THE index.ejs page (the root page)
    } catch (error) {
        console.log('Error in adding todo')
        res.status(500).json({errpr: 'Internal Server Error'})
    }
})

app.listen(PORT, ()=>{console.log(`Server is running at port ${PORT}`)});