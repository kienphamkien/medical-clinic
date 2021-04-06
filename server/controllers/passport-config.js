const mysql = require("mysql");
// const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');

const LocalStrategy = require('passport-local').Strategy;


const db = mysql.createConnection({
    host: process.env.DATABASE_HOST, 
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});


module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'Email', passwordField: 'Password', passReqToCallback:true }, (req, Email, Password, done) => {
        // Match user
            db.query('SELECT * FROM PATIENT WHERE Email = ?', [Email], async (error, results) => {
                console.log(results);
                if (error) {return done(error)}
                else if (results.length && !(await bcryptjs.compare(Password, results[0].Pass))) {
                    return done(null, false, { message : 'Email or Password is incorrect.'})
                }
                else if (!results.length) {
                    return done(null, false, { message : 'Email or Password is incorrect.'})
                }
                else {
                    return done(null, results[0])
                }})
            }
        )
    )
    
       // used to serialize the user for the session
    // passport.serializeUser(function(PatientID, done) {
	// 	done(null, results[0].PatientID);
    // });

    // used to deserialize the user
    // passport.deserializeUser(function(PatientID, done) {
	//     db.query('SELECT * FROM PATIENT WHERE PatientID = ?', [PatientID], async (error, results) => {	
	// 		done(err, results[0]);
	// 	});
    // });
}
