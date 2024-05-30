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

// READ
app.get('/', async(req, res) =>{
    const data = await pool.query(`SELECT * FROM todo ORDER BY date`);
    res.render('index', {data: data.rows})
})

// FILTER ENDPOINT
app.post('/filter', async(req, res) =>{
    const searchDate = req.body.date
    const data = await pool.query(`SELECT * FROM todo WHERE date='${searchDate}'`);
    res.render('filter', {data: data.rows})
})


// ADD TODO ENDPOINT
app.post('/addTodo', async(req, res)=>{
    const {todo, date} = req.body;

    try {
        const result = await pool.query(`INSERT INTO todo (todo, date) VALUES ($1, $2) RETURNING *`, [todo, date])
        // The RETURNING* clause returns all values ​​from the newly inserted row, including all columns.
        res.redirect('/') // REDIRECT TO THE index.ejs page (the root page)
    } catch (error) {
        console.log('Error in adding todo')
        res.status(500).json({errpr: 'Internal Server Error'})
    }
})

//UPDATE
app.get('/edit/:id', async(req, res)=> {
    const id = req.params.id;
    const data = await pool.query(`SELECT * FROM todo WHERE id= $1`, [id])
    res.render('edit', {data: data.rows})
})

// ENDPOINT FOR UPDATE
app.post('/update/:id', async(req, res)=> {
    const id = req.params.id;
    const {todo, date} = req.body;

    try {
        await pool.query(`UPDATE todo SET todo = $1, date = $2 WHERE id = $3`, [todo, date, id])
        res.redirect('/')
    } catch (error) {
        console.error('Error while updation todo:', error)
        res.status(500).json({error: 'Internal Server Error'})
    }
})

app.listen(PORT, ()=>{console.log(`Server is running at port ${PORT}`)});