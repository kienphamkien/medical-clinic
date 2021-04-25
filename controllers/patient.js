const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const { promisify } = require('util');


// This is the connection to the Google Cloud SQL
// const db = mysql.createConnection({
//     host: "35.223.45.141", 
//     user: "root",
//     password: "team14",
//     database: "clinic"
// });

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST, 
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

/*
const db = mysql.createConnection({
    host: "35.223.45.141", 
    user: "root",
    password: "team14",
    database: "clinic"
});
*/


exports.scheduleAppt= (req, res)=>{
    console.log(req.body);

    const{FName, LName, ID, reason, AppointDay,time,paymentMethod, clinic}= req.body

        db.query('INSERT INTO APPOINTMENT set? ',{FName:FName, LName:LName, PatientID:ID, Reason:reason, InsuranceProv:paymentMethod, AppointDay:AppointDay, AppointTime:time, ClinicID:clinic}, (error, results)=>{
            if (error) {
                console.log(error);
                return res.render('scheduleAppt', {
                    message: 'Appointment Day is invalid!'
                });

            } else {
                console.log(results);
                return res.render('scheduleAppt', {
                    message: 'Appointment Succesfully Scheduled!'
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

            db.query('SELECT AppointID from APPOINTMENT WHERE AppointID=? AND PatientID= ?', [AppointID, patientID], async(error, results)=>{
                if (error) {
                    console.log(error);
                } 
                if(results.length==0){
                    return res.render('rescheduleAppt',{
                        message: 'AppointmentID or PatientID is incorrect'
                    })
                }


                db.query('UPDATE APPOINTMENT SET ? WHERE AppointID=? AND PatientID= ? ', [{AppointDay:dateForAppt, AppointTime:time}, AppointID, patientID], async(error,results)=>{
                    if (error) {
                        console.log(error);
                        return res.render('scheduleAppt', {
                            message: 'Appointment Day is invalid!'
                        });
                    } else{
                        console.log(results);
                        return res.render('rescheduleAppt', {
                            message: 'Appointment Rescheduled Succesfuly!'
                        })
                    }
                });
            });
        });
    });
}