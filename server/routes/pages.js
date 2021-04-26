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
  if (typeof(req.user) == 'undefined') {
    res.render('index');
  }
  else if (req.user.PatientID) {
    res.render('loggedinIndex', {
      user: req.user
    });
  }
  else if (req.user.ManagerID) {
    res.render('loggedinIndexManager', {
      user: req.user
    });
  }
  else if (req.user.DoctorID) {
    console.log("testne",req.user.DoctorID)
    res.render('loggedinIndexDoctor', {
      user: req.user
    });
  }
 
})

router.get('/register', (req, res) => {
  res.render('register');
});

//loading the pages that i added!
router.get('/patient', authController.isLoggedIn, (req, res) => {
  if (req.user.PatientID) {
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
      req.app.locals.showAppt = sortedAppt
      res.render('patient', { data: { "userInfo": userInfo, "sortedAppt": sortedAppt } });
    })
  } else {
    res.status(401).render('login', { message: 'You need to login to view this page!' });
  }
});

router.get('/scheduleAppt', authController.isLoggedIn, (req, res) => {
  console.log(req.user);
  if (req.user.PatientID) {
    res.render('scheduleAppt', {
      user: req.user
    });
  } else {
    res.status(401).render('login', { message: 'You need to login to view this page!' });
  }
});

router.get('/cancelAppt', authController.isLoggedIn, (req, res) => {
  console.log(req.user);
  if (req.user.PatientID) {
    res.render('cancelAppt', {
      user: req.user, data: { "sortedAppt":  req.app.locals.showAppt  }
    });
  } else {
    res.status(401).render('login', { message: 'You need to login to view this page!' });
  }
});
router.get('/rescheduleAppt', authController.isLoggedIn, (req, res) => {
  console.log(req.user);
  if (req.user.PatientID) {
    res.render('rescheduleAppt', {
      user: req.user, data: { "sortedAppt":  req.app.locals.showAppt  }
    });
  } else {
    res.status(401).render('login', { message: 'You need to login to view this page!' });
  }
});
//****************** */
router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/staff', authController.isLoggedIn, (req, res) => {
  console.log(req.user);
  if (req.user.DoctorID) {
    res.render('staff', {
      user: req.user, Lname : req.user.Lname
    });
  } else {
    res.status(401).render('login', { message: 'You need to login to view this page!' });
  }
});

router.get('/requestMC', authController.isLoggedIn, (req, res) => {
  console.log(req.user);
  if (req.user.DoctorID) {
    res.render('requestMC', {
      user: req.user
    });
  } else {
    res.status(401).render('login', { message: 'You need to login to view this page!' });
  }
});

router.get('/createMC', authController.isLoggedIn, (req, res) => {
  console.log(req.user);
  if (req.user.DoctorID) {
    res.render('createMC', {
      user: req.user
    });
  } else {
    res.status(401).render('login', { message: 'You need to login to view this page!' });
  }
});

router.get('/fillMC', authController.isLoggedIn, (req, res) => {
  console.log(req.user);
  if (req.user.DoctorID) {
    res.render('fillMC', {
      user: req.user
    });
  } else {
    res.status(401).render('login', { message: 'You need to login to view this page!' });
  }
});

router.get('/manager', authController.isLoggedIn, (req, res) => {
  console.log(req.user);
  if (req.user.ManagerID) {
    res.render('manager', {
      user: req.user
    });
  } else {
    res.status(401).render('login', { message: 'You need to login to view this page!' });
  }
});
//manager
// router.get('/manager', (req, res) => {
//   res.render('manager.hbs');
// });

router.get('/registerDoctor', authController.isLoggedIn, (req, res) => {
  console.log(req.user);
  if (req.user.ManagerID) {
    res.render('registerDoctor', {
      user: req.user
    });
  } else {
    res.status(401).render('login', { message: 'You need to login to view this page!' });
  }
});


router.get('/patientReport', authController.isLoggedIn, (req, res) => {
  console.log(req.user);
  if (req.user.ManagerID) {
    res.render('patientReport', {
      user: req.user
    });
  } else {
    res.status(401).render('login', { message: 'You need to login to view this page!' });
  }
});

router.get('/staffReport', authController.isLoggedIn, (req, res) => {
  console.log(req.user);
  if (req.user.ManagerID) {
    res.render('staffReport', {
      user: req.user
    });
  } else {
    res.status(401).render('login', { message: 'You need to login to view this page!' });
  }
});

router.get('/apptReport', authController.isLoggedIn, (req, res) => {
  console.log(req.user);
  if (req.user.ManagerID) {
    res.render('apptReport', {
      user: req.user
    });
  } else {
    res.status(401).render('login', { message: 'You need to login to view this page!' });
  }
});


module.exports = router;
