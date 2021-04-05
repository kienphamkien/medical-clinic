const express = require("express");
const app = express();
const path = require('path');

const mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config({path:'./.env'});


const db = mysql.createConnection({
    host: process.env.DATABASE_HOST, 
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

const clientDir = path.join(__dirname, '..', 'client'); //dirname is variable that gives access to current directory
// console.log(clientDir);
app.use(express.static(clientDir)); //to grab all static files 
app.use(express.urlencoded({extended:false})); //to make sure you can grab the data from any form 

app.use(express.json()); //makes sure that the values from the form come in as json

app.set('view engine', 'hbs'); //setting the view engine as hbs templates

db.connect((error) => {
    if (error) {
        console.log(error)
    } else {
        console.log("MySQL Connected!")
    }
})

//define routes. It goes from these routes into the pages file in the routes folder. The pages file looks at the route defined and
//goes into the specific file. It then looks at the form and submits the the action label of the form via the method you defined (post)
//better explanation of the video in video 5 towards the end\
app.use('/', require('./routes/pages')); //
app.use('/auth', require('./routes/auth'));//whatver starts 



app.listen(5001, () => {
    console.log("Server started on Port 5001")
})