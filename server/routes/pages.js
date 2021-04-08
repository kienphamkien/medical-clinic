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
