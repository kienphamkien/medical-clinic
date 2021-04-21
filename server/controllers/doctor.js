const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const { promisify } = require('util');

//const db = mysql.createConnection({
/*
const db = mysql.createConnection({
    host: "35.223.45.141", 
    user: "root",
    password: "team14",
    database: "clinic"
});
*/
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST, 
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

exports.fillMC= async(req,res)=>{
    console.log(req.body);
    const{PatientFName,PatientLName,AppointDay,time,summary,diagnosis}=req.body

    db.query('SELECT AppointID from APPOINTMENT WHERE Fname= ? and Lname= ? and AppointDay= ?', [PatientFName,PatientLName,AppointDay], async(error,result)=>{
        if(result.length==0){
            return res.render('fillMC',{
                message: 'Patient was not found'
            });
        }
        db.query('INSERT INTO APPOINTMENT_REPORT set?', {AppointID:result[0].AppointID, Diagnosis:diagnosis, Summary:summary},(error,results)=>{
            if (error) {
                console.log(error);
            } else {
                console.log(results);
                return res.render('fillMC', {
                    message: 'Appointment Report Succesfully Inserted!'
                });
            }
        })
    })

}

exports.createMC= async(req,res)=>{
    console.log(req.body);
    const{patientID,Sex,BloodType,height,Weight,familyHistory, surgicalHistory,allergies}=req.body

    db.query('SELECT PatientID from PATIENT WHERE PatientID= ?', [patientID], async(error,results)=>{
        if(error){
            console.log(error);
        }
        if(results.length==0){
            return res.render('createMC',{
                message: 'PatientID is incorrect'
            })
        }

        db.query('SELECT PatientID from MEDICAL_CHART WHERE PatientID= ?', [patientID], async(error,result)=>{
            if(error){
                console.log(error);
            }
            if(result.length>0){
                return res.render('createMC',{
                    message: 'The patient already has a medical chart'
                })
            }
            db.query('INSERT INTO MEDICAL_CHART set?', {PatientID:patientID, Sex:Sex, BloodType:BloodType, Height:height, 
                                                        Weight:Weight, FamilyHist:familyHistory,
                                                        SurgicalHist:surgicalHistory, Allergies:allergies},(error,results)=>{
                if (error) {
                    console.log(error);
                } else {
                    console.log(results);
                    return res.render('createMC', {
                        message: 'Medical Chart succesfully created!'
                    });
                }
            })
        })

    })
}


exports.requestMC= async(req,res) =>{
    console.log(req.body);
    const{patientID}=req.body
    var patientMedicalChart= [];
    db.query('SELECT PatientID from MEDICAL_CHART WHERE PatientID= ?', [patientID], async(error,results)=>{
        if(error){
            console.log(error);
        }
        if(results.length==0){
            return res.render('requestMC',{
                message: 'PatientID is incorrect or Medical Chart is nonexistant'
            })
        }
        

        db.query('SELECT * FROM MEDICAL_CHART WHERE PatientID=?', [patientID], async(error, result)=>{
            if(error){
                console.log(error);
            }else{
                var MC= {
                    'patientID': result[0].PatientID,
                    'sex': result[0].Sex,
                    'bloodType': result[0].BloodType,
                    'height':result[0].Height,
                    'weight':result[0].Weight,
                    'famHistory':result[0].FamilyHist,
                    'surgical':result[0].SurgicalHist,
                    'allergies':result[0].Allergies
                }

                patientMedicalChart.push(MC);
            }
            return res.render('requestMC', {"patientMedicalChart": patientMedicalChart});
        })

    })

}