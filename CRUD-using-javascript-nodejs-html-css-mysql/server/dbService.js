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
    async deleteRowById(id) {
        try {
            id = parseInt(id, 10); // base 10. I added it because some browser may not work the same way
            const response = await new Promise((resolve, reject) => {
                const query = "DELETE FROM names WHERE id = ?";
    
                connection.query(query, [id], (err, result) => {
                    if(err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });

            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }

    }

    // Funtion responsible for updating data
    async updateNameById(id, name) {
        try {
            id = parseInt(id, 10); // base 10. I added it because some browser may not work the same way
            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE names SET name = ? WHERE id = ?";
    
                connection.query(query, [name, id], (err, result) => {
                    if(err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });

            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
}


module.exports = DbService;