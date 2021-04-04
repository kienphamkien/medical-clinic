const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');



const db = mysql.createConnection({
    host: process.env.host, 
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
});





exports.register = (req, res) => {
    console.log(req.body);

    const { Fname, Minit, Lname, DOB, Address, PhoneNumber, Email, Password, ConfirmPassword} = req.body;
    
    db.query('SELECT Email from PATIENT WHERE Email = ?', [Email], async (error, results) => {
        if (error) {
            console.log(error);
        }
        if (results.length > 0) {
            return res.render('register', {
                message: 'Email is already taken!'
            })
        } else if (Password !== ConfirmPassword) {
            return res.render('register', {
                message: 'Passwords do not match!'
            })
        }

        let hashedPassword = await bcryptjs.hash(Password, 8);
        console.log(hashedPassword);

        db.query('INSERT INTO PATIENT set? ', {Fname: Fname, Minit: Minit, Lname: Lname, DOB: DOB, Address: Address, PhoneNumber: PhoneNumber, Email: Email, Password: Password}, (error, results) =>{
            if (error) {
                console.log(error);
            } else {
                console.log(results);
                return res.render('register', {
                    message: 'User registered! You can now login with your email address and password.'
                });
            }
        });
    });
}