const mysql = require('mysql2');
require('dotenv').config();

const Connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
    connectTimeout: 20000
});

Connection.connect((err) => {
    if (err) console.log(err);
    else console.log('connected successfully!');
});


module.exports = Connection;