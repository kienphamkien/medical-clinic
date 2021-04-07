const express = require('express');
const router = express.Router();

router.get('/', (req, res) =>{
    res.render('index');
});

router.get('/register', (req, res) =>{
    res.render('register');
});


//loading the pages that i added!
router.get('/patient', (req, res)=>{
    res.render('patient');
});

router.get('/scheduleAppt', (req,res)=>{
    res.render('scheduleAppt');
});

router.get('/cancelAppt', (req,res)=>{
    res.render('cancelAppt');
});




router.get('/rescheduleAppt', (req,res)=>{
    res.render('rescheduleAppt');
});


//****************** */
router.get('/login', (req, res) =>{
    res.render('login');
});

router.get('/staff', (req,res)=>{
    res.render('staff.hbs');
});

router.get('/requestMC', (req,res)=>{
    res.render('requestMC.hbs');
});

router.get('/createMC', (req,res)=>{
    res.render('createMC.hbs');
});

router.get('/fillMC', (req,res)=>{
    res.render('fillMC.hbs');
});

module.exports = router;
