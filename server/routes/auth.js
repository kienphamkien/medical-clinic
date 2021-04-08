const express = require('express');
const authController = require('../controllers/auth');
const patientController = require('../controllers/patient');
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

/*Here is wehre you'd create the route for user page*/ 
module.exports = router; //required for the code to work 
