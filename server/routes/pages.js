const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

const mysql = require("mysql");
const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE
});

router.get('/', authController.isLoggedIn, (req, res) => {
  if (req.user) {
    res.render('loggedinIndex', {
      user: req.user
    });
  } else {
    res.render('index');
  }
})

router.get('/register', (req, res) => {
  res.render('register');
});
// res.render('patient', {data:{"userInfo":userInfo,"sortedAppt":sortedAppt}});
// console.log(authController.login.userInfo)
//loading the pages that i added!
router.get('/patient', authController.isLoggedIn, (req, res) => {
  console.log("cucucu ne", req.user);
  if (req.user) {
    var userInfo = [];
    var apptinfo = [];
    db.query('SELECT * FROM PATIENT WHERE PatientID= ?', [req.user.PatientID], async (error, result) => {
      if (error) {
        console.log(error);
      } else {
        var patientInfo = {
          'FName': result[0].Fname,
          'LName': result[0].Lname,
          'PatientID': result[0].PatientID
        }
        userInfo.push(patientInfo);
        // console.log("ten tao ne", userInfo)
      }
    })
    db.query('SELECT * FROM APPOINTMENT WHERE PatientID= ?', [req.user.PatientID], async (error, result) => {
      var appointmentInfo;
      if (error) {
        console.log(error);
      } else {
        if (result.length >= 1) {
          for (i = 0; i < result.length; i++) {
            if (result[i].isDeleted != 1) {
              appointmentInfo = {
                'appointmentDate': result[i].AppointDay,
                'appointTime': result[i].AppointTime,
                'appointID': result[i].AppointID
              }
              apptinfo.push(appointmentInfo);
            }

          }
        } else {
          var date = "You dont have any upcoming appointments";
          var time = "You can schedule an appointment by hitting schedule an appointment at the top right";
          var id = "You dont have any appointment ID.... yet"
          var appointmentInfo = {
            'appointmentDate': date,
            'appointTime': time,
            'appointID': id
          }
          apptinfo.push(appointmentInfo);
        }
      }

      const sortedAppt = apptinfo.sort((a, b) => a.appointmentDate - b.appointmentDate)
      //res.render('patient', {data:{"userInfo":userInfo,"apptinfo":apptinfo}});
      res.render('patient', { data: { "userInfo": userInfo, "sortedAppt": sortedAppt } });
    })
    // console.log(req.user.Fname)
    // res.render('patient', {
    //   user: req.user, data: { "userInfo": authController.userInfo }
    // });
  } else {
    res.status(401).render('login', { message: 'You need to login to view this page!' });
  }
});

router.get('/scheduleAppt', authController.isLoggedIn, (req, res) => {
  console.log(req.user);
  if (req.user) {
    res.render('scheduleAppt', {
      user: req.user
    });
  } else {
    res.status(401).render('login', { message: 'You need to login to view this page!' });
  }
});
router.get('/cancelAppt', authController.isLoggedIn, (req, res) => {
  console.log(req.user);
  if (req.user) {
    res.render('cancelAppt', {
      user: req.user
    });
  } else {
    res.status(401).render('login', { message: 'You need to login to view this page!' });
  }
});
router.get('/rescheduleAppt', authController.isLoggedIn, (req, res) => {
  console.log(req.user);
  if (req.user) {
    res.render('rescheduleAppt', {
      user: req.user
    });
  } else {
    res.status(401).render('login', { message: 'You need to login to view this page!' });
  }
});
//****************** */
router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/staff', (req, res) => {
  res.render('staff.hbs');
});

router.get('/requestMC', (req, res) => {
  res.render('requestMC.hbs');
});

router.get('/createMC', (req, res) => {
  res.render('createMC.hbs');
});

router.get('/fillMC', (req, res) => {
  res.render('fillMC.hbs');
});


//manager
router.get('/manager', (req, res) => {
  res.render('manager.hbs');
});

router.get('/registerDoctor', (req, res) => {
  res.render('registerDoctor.hbs');
});

router.get('/patientReport', (req, res) => {
  res.render('patientReport.hbs');
});

router.get('/staffReport', (req, res) => {
  res.render('staffReport.hbs');
});

router.get('/apptReport', (req, res) => {
  res.render('apptReport.hbs');
});

module.exports = router;
