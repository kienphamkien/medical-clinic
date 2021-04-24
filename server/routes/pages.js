const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');


router.get('/', authController.isLoggedIn, (req, res) => {
    if( req.user ) {
      res.render('loggedinIndex', {
        user: req.user
      });
    } else {
      res.render('index');
    }
})

router.get('/register', (req, res) =>{
    res.render('register');
});

//loading the pages that i added!
router.get('/patient', authController.isLoggedIn, (req, res) => {
    console.log(req.user);
    if( req.user ) {
      res.render('patient', {
        user: req.user
      });
    } else {
      res.status(401).render('login', { message : 'You need to login to view this page!'});
    }
});

router.get('/scheduleAppt', authController.isLoggedIn, (req, res) => {
    console.log(req.user);
    if( req.user ) {
      res.render('scheduleAppt', {
        user: req.user
      });
    } else {
      res.status(401).render('login', { message : 'You need to login to view this page!'});
    }
});
router.get('/cancelAppt', authController.isLoggedIn, (req, res) => {
    console.log(req.user);
    if( req.user ) {
      res.render('cancelAppt', {
        user: req.user
      });
    } else {
      res.status(401).render('login', { message : 'You need to login to view this page!'});
    }
});
router.get('/rescheduleAppt', authController.isLoggedIn, (req, res) => {
    console.log(req.user);
    if( req.user ) {
      res.render('rescheduleAppt', {
        user: req.user
      });
    } else {
      res.status(401).render('login', { message : 'You need to login to view this page!'});
    }
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


//manager
router.get('/manager',(req,res)=>{
  res.render('manager.hbs');
});

router.get('/registerDoctor', (req,res)=>{
  res.render('registerDoctor.hbs');
});

router.get('/patientReport',(req,res)=>{
  res.render('patientReport.hbs');
});

router.get('/staffReport', (req,res)=>{
  res.render('staffReport.hbs');
});

router.get('/apptReport', (req,res)=>{
  res.render('apptReport.hbs');
});

module.exports = router;
