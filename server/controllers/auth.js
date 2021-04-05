const mysql = require("mysql"); //import db
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');

const dotenv = require("dotenv");
dotenv.config({path:'./.env'});

//connecting our database
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST, 
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

exports.register = (req, res) => {
    console.log(req.body);

    const { Fname, Minit, Lname, DOB, Address, PhoneNumber, Email, Password, ConfirmPassword} = req.body;
    
    //seclecting the email from the patient table where the email equals ?. The question mark will be the value we want to look at the database. [This represents the value you grabbed from the form]
    db.query('SELECT Email from PATIENT WHERE Email = ?', [Email], async (error, results) => {
        if (error) {
            console.log(error);
        }
        if (results.length > 0) { //results comes back as an array
            return res.render('register', { //render the register page and display a message saying that the email is already taken
                message: 'Email is already taken!'
            })
        } else if (Password !== ConfirmPassword) {
            return res.render('register', {
                message: 'Passwords do not match!'
            })
        }
        
        //encrypt the password
        let hashedPassword = await bcryptjs.hash(Password, 8);
        console.log(hashedPassword);

        //adding the user to the user table
        db.query('INSERT INTO PATIENT set? ', {Fname: Fname, Minit: Minit, Lname: Lname, DOB: DOB, Address: Address, PhoneNumber: PhoneNumber, Email: Email, Pass: Password}, (error, results) =>{
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

exports.scheduleAppt= (req, res)=>{
    console.log(req.body);

    const{FName, LName, ID, reason, AppointDay,time,paymentMethod}= req.body

        db.query('INSERT INTO APPOINTMENT set? ',{FName:FName, LName:LName, PatientID:ID, Reason:reason, InsuranceProv:paymentMethod, AppointDay:AppointDay}, (error, results)=>{
            if (error) {
                console.log(error);
            } else {
                console.log(results);
                return res.render('scheduleAppt', {
                    message: 'Appointment Succesfuly Scheduled!'
                });
            }
        });
}


exports.cancelAppt= (req,res)=>{
    console.log(req.body);
    const{patientID,apptID,reason}=req.body;

    db.query('SELECT PatientID from APPOINTMENT WHERE PatientID= ?', [patientID], async(error,results)=>{
        if(error){
            console.log(error);
        }

        if(results.length==0){
            return res.render('cancelAppt',{
                message: 'PatientID is incorrect'
            })
        }

        db.query('SELECT AppointID from APPOINTMENT WHERE AppointID= ?', [apptID], async(error,results)=>{
            if(error){
                console.log(error);
            }
            if(results.length==0){
                return res.render('cancelAppt',{
                    message: 'AppointmentID is incorrect'
                })
            }
        });

        db.query('UPDATE APPOINTMENT SET ? WHERE AppointID= ? and PatientID= ?', [{isDeleted:1}, apptID, patientID], async(error,results)=>{
            if (error) {
                console.log(error);
            } else{
                console.log(results);
                return res.render('cancelAppt', {
                    message: 'Appointment Cancelled Succesfuly!'
                })
            }
        });
    })


}


exports.rescheduleAppt=(req,res)=>{
    console.log(req.body);

    const{patientID, AppointID,dateForAppt,time}=req.body;

    db.query('SELECT PatientID from APPOINTMENT WHERE PatientID= ?', [patientID], async(error,results)=>{
        if(error){
            console.log(error);
        }
        if(results.length==0){
            return res.render('rescheduleAppt',{
                message: 'PatientID is incorrect'
            })
        }

        db.query('SELECT AppointID from APPOINTMENT WHERE AppointID=? ', [AppointID], async(error,results)=>{
            if(error){
                console.log(error);
            }if(results.length==0){
                return res.render('rescheduleAppt',{
                    message: 'AppointmentID is incorrect'
                })
            }
        });

        db.query('UPDATE APPOINTMENT SET ? WHERE AppointID=? AND PatientID= ? ', [{AppointDay:dateForAppt}, AppointID, patientID], async(error,results)=>{
            if (error) {
                console.log(error);
            } else{
                console.log(results);
                return res.render('cancelAppt', {
                    message: 'Appointment Rescheduled Succesfuly!'
                })
            }
        });
    })
}



/*
//grabing all the data sent from the form and log into the terminal 
exports.register = (req, res) => {
    console.log(req.body);
    res.send("Form submitted");
};*/