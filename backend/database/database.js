const {Client} = require('pg')
 
const client = new Client({
    host: "Localhost",
    user: "postgres",
    port: 5432,
    password: "CA-Dev",
    database: "Civil-Affairs-DB"
})

module.exports = client ;