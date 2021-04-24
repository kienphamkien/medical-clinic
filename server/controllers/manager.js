const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const { promisify } = require('util');
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

exports.patientReport= (req,res)=>{
    console.log(req.body);
    const{Fname,Lname}= req.body
    var patient=[];
    var stat = [];
    var notDeleted= 1;
    var values = ""; 
    var values2;

    
    if(Fname.length == 0 && Lname == 0)
        return null;
    else if(Fname.length != 0 && Lname != 0){
        values = "Fname = ? AND Lname";
        values2 = [Fname, Lname];
    }
    else if(Fname.length != 0){
        values = "Fname = ?";
        values2 = [Fname];
    }
    else if(Lname.length != 0){
        values = "Lname = ?";
        values2 = [Lname];
    }
    

    db.query('SELECT * from PATIENT WHERE  ' + values + '', values2, async(error,results)=>{
        if(error){
            console.log(error);
            return res.render('patientReport', {
                message: 'Test error path!'
            })
        }else if (results.length==0){
            return res.render('patientReport',{
                message: 'No patients found.'
            });
        }else{

            var numOfPatients = results.length;
            stats= {
                'numOfPatients':numOfPatients
            }
            stat.push(stats);
            var info;
            for(i=0; i<results.length; i++){
                info={
                    'PatientID':results[i].PatientID,
                    'Fname':results[i].Fname,
                    'Lname':results[i].Lname,
                    'DOB':results[i].DOB,
                    'PNumber':results[i].PhoneNumber,
                    'Address':results[i].Address,
                    'EmailAddress':results[i].Email
                }
                patient.push(info)
            }
            //const sortedAppt= patient.sort((a,b)=> a.AppointDay-b.AppointDay)
            //return res.render('apptReport', {"appt":appt});
            return res.render('patientReport', {data:{"stat":stat,"patient":patient}});
        }
    })
}

exports.apptReport= (req,res)=>{
    console.log(req.body);
    const{clinic,startingDate,endingDate}= req.body
    var appt=[];
    var stat =[]
    var notDeleted= 1;
    db.query('SELECT * from APPOINTMENT WHERE ClinicID= ? and AppointDay BETWEEN ? and ? and isDeleted!= ?', [clinic, startingDate, endingDate, notDeleted], async(error,results)=>{
        if(error){
            console.log(error);
        }else if (results.length==0){
            return res.render('apptReport',{
                message: 'No appointments during the selected dates'
            });
        }else{
            var numOfAppoint = results.length;
            stats= {
                'numOfAppoint':numOfAppoint
            }
            stat.push(stats);

            for(i=0; i<results.length; i++){
                info={
                    'AppointID':results[i].AppointID,
                    'AppointDay':results[i].AppointDay,
                    'AppointTime':results[i].AppointTime,
                    'FName':results[i].FName,
                    'LName':results[i].LName,
                    'InsuranceProv':results[i].InsuranceProv,
                    'Reason':results[i].Reason,
                    'ClinicID':results[i].ClinicID,
                    //'NumOfAppoint':results.length
                }
                appt.push(info)
                
            }
            
            const sortedAppt= appt.sort((a,b)=> a.AppointDay-b.AppointDay)
            //return res.render('apptReport', {"appt":appt});
            return res.render('apptReport',{data:{"stat":stat,"sortedAppt":sortedAppt}});
        }
    })
}

exports.staffReport=(req,res)=>{
    console.log(req.body);
    const{clinic,startingDate,endingDate}= req.body
    var staff=[];
    var clinics=[];
    var count=[3];
    var notDeleted= 1;
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
            //return res.render ('staffReport',{"staff":staff});
        }
    //})

    db.query('SELECT * from APPOINTMENT WHERE AppointDay BETWEEN ? and ? and isDeleted!= ?', [startingDate, endingDate, notDeleted], async(error,results)=>{
        if(error){
            console.log(error);
        }else if (results.length==0){
            return res.render('apptReport',{
                message: 'No appointments during the selected dates'
            });
        }else{
            var clinic1Total=0;
            var clinic2Total=0;
            var clinic3Total=0; 
            var clinicAppt;
            for(i=0; i<results.length; i++){
                if(results[i].ClinicID==1 && results[i].isDeleted==0){
                     //count[0]=count[0]+1;
                    //clinicAppt.Clinic1= clinicAppt.Clinic1+1;
                    clinic1Total+=1;
                }else if(results[i].ClinicID==2 && results[i].isDeleted==0){
                    //count[1]=count[1]+1;
                    //clinicAppt.Clinic2= clinicAppt.Clinic2+1;
                    clinic2Total+=1;
                }else if(results[i].ClinicID==3&& results[i].isDeleted==0){
                    //count[2]=count[2]+1;
                    //clinicAppt.Clinic3= clinicAppt.Clinic3+1;
                    clinic3Total+=1;
                }
                //clinics.push(clinicAppt);
            }
            clinicAppt={
                'Clinic1': clinic1Total,
                'Clinic2': clinic2Total,
                'Clinic3': clinic3Total
            };
            clinics.push(clinicAppt);
        }
        return res.render ('staffReport',{data:{"staff":staff,"clinics":clinics}});
    });
    
})
    //return res.render ('staffReport',{"staff":staff});

}