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

// router.post('/login', passport.authenticate('local-login', {
//     successRedirect : '/', // redirect to the secure profile section
//     failureRedirect : '/login', // redirect back to the signup page if there is an error
//     failureFlash : true // allow flash messages
// }),
// function(req, res) {
//     console.log("hello");

//     if (req.body.remember) {
//       req.session.cookie.maxAge = 1000 * 60 * 3;
//     } else {
//       req.session.cookie.expires = false;
//     }
// res.redirect('/');
// });





router.post('/register', authController.register); //

router.post('/scheduleAppt',authController.scheduleAppt);

router.post('/cancelAppt',authController.cancelAppt);

router.post('/rescheduleAppt', authController.rescheduleAppt);

/*Here is wehre you'd create the route for user page*/ 


module.exports = router; //required for the code to work 
