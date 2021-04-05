const express = require('express');
const authController = require('../controllers/auth');

const router = express.Router(); 

/*
router.get('/', (req,res)=>{
    res.render('index');
});

router.get('/register', (req,res)=>{
    res.render('register');
});*/
router.post('/login', authController.login);

router.post('/register', authController.register); //

router.post('/scheduleAppt',authController.scheduleAppt);

router.post('/cancelAppt',authController.cancelAppt);

router.post('/rescheduleAppt', authController.rescheduleAppt);

/*Here is wehre you'd create the route for user page*/ 


module.exports = router; //required for the code to work 
