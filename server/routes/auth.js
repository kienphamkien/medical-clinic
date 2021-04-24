const express = require('express');
const authController = require('../controllers/auth');
const patientController = require('../controllers/patient');
const doctorController = require('../controllers/doctor');
const managerController= require('../controllers/manager');
const router = express.Router(); 

/*
router.get('/', (req,res)=>{
    res.render('index');
});

router.get('/register', (req,res)=>{
    res.render('register');
});*/
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/register', authController.register); //

router.post('/scheduleAppt',patientController.scheduleAppt);
router.post('/cancelAppt', patientController.cancelAppt);
router.post('/rescheduleAppt', patientController.rescheduleAppt);


router.post('/fillMC',doctorController.fillMC);
router.post('/createMC', doctorController.createMC)
router.post('/requestMC', doctorController.requestMC)

router.post('/registerDoctor', managerController.registerDoctor);
router.post('/apptReport', managerController.apptReport);
router.post('/staffReport', managerController.staffReport);
router.post('/patientReport', managerController.patientReport);
/*Here is wehre you'd create the route for user page*/ 
module.exports = router; //required for the code to work 
