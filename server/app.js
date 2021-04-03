const express = require("express");
const app = express();
const path = require('path');

const mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config({path:'./.env'});


const db = mysql.createConnection({
    host: process.env.host, 
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
});

const clientDir = path.join(__dirname, '..', 'client');
// console.log(clientDir);
app.use(express.static(clientDir));
app.use(express.urlencoded({extended:false}));

app.use(express.json());

app.set('view engine', 'hbs');

db.connect((error) => {
    if (error) {
        console.log(error)
    } else {
        console.log("MySQL Connected!")
    }
})


app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));


app.listen(5001, () => {
    console.log("Server started on Port 5001")
})