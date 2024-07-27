const mysql = require('mysql');
const dotenv = require('dotenv');
let instance = null;
dotenv.config();

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT,
});

connection.connect((err) => {
    if (err) {
        console.log("CONNECTION ERROR. ERROR MESSAGE: ", err.message)
    }
    console.log("NO ERROR FOUND. DB " + connection.state);
})

class DbService {
    static getDbServiceInstance() {
        return instance ? instance : new DbService();
    }

    // Function responsible for getting data from the database
    async getAllData() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM names;";

                connection.query(query, (err, results) => {
                    if(err) reject(new Error(err.message));
                    resolve(results);
                })
            });

            // console.log(response);
            return response;

        } catch (error) {
            console.log(error);
        }
    }

    // Function responsible for inserting data into the database
    async insertNewName(name) {
        try {
            const dateAdded = new Date();
            const insertId = await new Promise((resolve, reject) => {
                const query = "INSERT INTO names (name, date_added) VALUES (?, ?);";

                connection.query(query, [name, dateAdded], (err, result) => {
                    if(err) reject(new Error(err.message));
                    resolve(result.insertId);
                })
            });

            // console.log(insertId);
            // Returt "id", "name" and "dataAdded" back to the table
            return {
                id: insertId,
                name: name,
                dateAdded: dateAdded
            }

        } catch (error) {
            console.log(error);
        }
    }

    // Function responsible for deleting data

    // Funtion responsible for updating data
}


module.exports = DbService;