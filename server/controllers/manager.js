const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const { promisify } = require('util');

const db = mysql.createConnection({
    host: "35.223.45.141", 
    user: "root",
    password: "team14",
    database: "clinic"
});
/*
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST, 
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});
*/

exports.registerDoctor = (req, res) => {
    console.log(req.body);

    const { Fname, Minit, Lname, dob, address,clinic, pNumber, Email, Password, ConfirmPassword } = req.body

    db.query('SELECT Email from DOCTOR WHERE Email = ?', [Email], async (error, results) => {
        if (error) {
            console.log(error);
        }
        if (results.length > 0) {
            return res.render('registerDoctor', {
                message: 'Email is already taken!'
            })
        } else if (Password !== ConfirmPassword) {
            return res.render('registerDoctor', {
                message: 'Passwords do not match!'
            })
        }
        let hashedPassword = await bcryptjs.hash(Password, 8);
        console.log(hashedPassword);
        db.query('INSERT INTO DOCTOR set ? ', { Fname: Fname, Minit: Minit, Lname: Lname, DOB: dob, Address: address,clinicID:clinic ,PhoneNumber: pNumber, Email: Email, Pass: hashedPassword }, (error, results) => {
            console.log(results);
            if (error) {
                console.log(error);
            } else {
                console.log(results);
                return res.render('registerDoctor', {
                    message: 'Doctor is registered! He can now login with his email address and password.'
                });
            }
        });
    });
}

exports.apptReport= (req,res)=>{
    console.log(req.body);
    const{clinic,startingDate,endingDate}= req.body
    var appt=[];
    var notDeleted= 1;

    db.query('SELECT * from APPOINTMENT WHERE ClinicID= ? and AppointDay BETWEEN ? and ? and isDeleted!= ?', [clinic, startingDate, endingDate, notDeleted], async(error,results)=>{
        if(error){
            console.log(error);
        }else if (results.length==0){
            return res.render('apptReport',{
                message: 'No appointments during the selected dates'
            });
        }else{
            var info;
            for(i=0; i<results.length; i++){
                info={
                    'AppointID':results[i].AppointID,
                    'AppointDay':results[i].AppointDay,
                    'AppointTime':results[i].AppointTime,
                    'FName':results[i].FName,
                    'LName':results[i].LName,
                    'InsuranceProv':results[i].InsuranceProv,
                    'Reason':results[i].Reason,
                    'ClinicID':results[i].ClinicID
                }
                appt.push(info)
            }
            return res.render('apptReport', {"appt":appt});
        }
    })
}

exports.staffReport=(req,res)=>{
    console.log(req.body);
    const{clinic}= req.body
    var staff=[];
    db.query('SELECT * FROM DOCTOR WHERE ClinicID= ?', [clinic],async(error,results)=>{
        if(error){
            console.log(error);
        }else if (results.length==0){
            return res.render('staffReport',{
                message: 'No staff found'
            });
        }else {
            var info;
            for(i=0; i<results.length; i++){
                info={
                    'Fname':results[i].Fname,
                    'Lname':results[i].Lname,
                    'DoctorID':results[i].DoctorID,
                    'pnumber':results[i].PhoneNumber,
                    'Email':results[i].Email
                }
                staff.push(info);
            }
            return res.render ('staffReport',{"staff":staff});
        }
    })

}