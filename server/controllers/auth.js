const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const { promisify } = require('util');


// This is the connection to the Google Cloud SQL
/*
 const db = mysql.createConnection({
     host: "35.223.45.141", 
     user: "root",
     password: "team14",
     database: "clinic"
});

*/
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

/*
//grabing all the data sent from the form and log into the terminal 
exports.register = (req, res) => {
    console.log(req.body);
    res.send("Form submitted");
};*/

exports.register = (req, res) => {
    console.log(req.body);

    const { Fname, Minit, Lname, DOB, Address, PhoneNumber, Email, Password, ConfirmPassword } = req.body;

    db.query('SELECT Email from PATIENT WHERE Email = ?', [Email], async (error, results) => {
        if (error) {
            console.log(error);
        }
        if (results.length > 0) {
            return res.render('register', {
                message: 'Email is already taken!'
            })
        } else if (Password !== ConfirmPassword) {
            return res.render('register', {
                message: 'Passwords do not match!'
            })
        }
        let hashedPassword = await bcryptjs.hash(Password, 8);
        console.log(hashedPassword);
        db.query('INSERT INTO PATIENT set ? ', { Fname: Fname, Minit: Minit, Lname: Lname, DOB: DOB, Address: Address, PhoneNumber: PhoneNumber, Email: Email, Pass: hashedPassword }, (error, results) => {
            console.log(results);
            if (error) {
                console.log(error);
                return res.render('login', {
                    message: 'Date of Birth invalid!'
                });
            } else {
                console.log(results);
                return res.render('login', {
                    message: 'User registered! You can now login with your email address and password.'
                });
            }
        });
    });
}

exports.login = async (req, res) => {
    var userInfo = [];
    var apptinfo = [];
    try {
        const { Email, Password } = req.body;
        db.query('SELECT * FROM PATIENT WHERE Email=?', [Email], async (error, results) => {
            if (results.length == 0) {
                db.query('SELECT * FROM DOCTOR WHERE Email=?', [Email], async (error, result) => {
                    if (result.length != 0) {
                        console.log(result);
                        if (!result || !(await bcryptjs.compare(Password, result[0].Pass))) {
                            res.status(401).render('login', {
                                message: 'Email or Password is incorrect.'
                            })
                        } else if (!result.length) {
                            res.status(401).render('login', {
                                message: 'Email or Password is incorrect.'
                            })
                        } else {
                            const DoctorID = result[0].DoctorID;
                            const token = jwt.sign({ DoctorID }, process.env.JWT_SECRET, {
                                expiresIn: process.env.JWT_EXPIRES_IN
                            });
                            console.log("The token is: " + token);
                            const cookieOptions = {
                                expires: new Date(
                                    Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                                ),
                                httpOnly: true
                            }
                            res.cookie('jwt', token, cookieOptions);
                            res.status(200);
                            res.redirect('../staff');
                        }
                    } else if (result.length == 0) {
                        /*
                        console.log(result);
                        res.status(401).render('login', {
                            message: 'Email or Password is incorrect.'
                        })*/

                        db.query('SELECT * FROM MANAGER WHERE Email= ?', [Email], async (error, results) => {
                            console.log(results.length);
                            if (results.length != 0) {
                                console.log(results);
                                if (!results || Password != results[0].Pass) { //Need to find a way to encrypt the manager password
                                    res.status(401).render('login', {
                                        message: 'Email or Password is incorrect.'
                                    })
                                } else if (!results.length) {
                                    res.status(401).render('login', {
                                        message: 'Email or Password is incorrect.'
                                    })
                                } else {
                                    const ManagerID = results[0].ManagerID;
                                    const token = jwt.sign({ ManagerID }, process.env.JWT_SECRET, {
                                        expiresIn: process.env.JWT_EXPIRES_IN
                                    });
                                    console.log("The token is: " + token);
                                    const cookieOptions = {
                                        expires: new Date(
                                            Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                                        ),
                                        httpOnly: true
                                    }
                                    res.cookie('jwt', token, cookieOptions);
                                    res.status(200);
                                    res.render('manager');
                                }
                            } else if (results.length == 0) {
                                console.log(result);
                                res.status(401).render('login', {
                                    message: 'Email or Password is incorrect.'
                                })
                            }
                        })
                    }
                });
            } else {
                console.log(results);
                if (!results || !(await bcryptjs.compare(Password, results[0].Pass))) {
                    res.status(401).render('login', {
                        message: 'Email or Password is incorrect.'
                    })
                }
                else if (!results.length) {
                    res.status(401).render('login', {
                        message: 'Email or Password is incorrect.'
                    })
                }
                else {
                    const PatientID = results[0].PatientID;
                    const token = jwt.sign({ PatientID }, process.env.JWT_SECRET, {
                        expiresIn: process.env.JWT_EXPIRES_IN
                    });
                    console.log("The token is: " + token);
                    const cookieOptions = {
                        expires: new Date(
                            Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                        ),
                        httpOnly: true
                    }
                    res.cookie('jwt', token, cookieOptions);
                    res.status(200);
                    res.redirect('../patient');
                }
            }
        })
    } catch (error) {
        console.log(error)
    }
}



exports.isLoggedIn = async (req, res, next) => {
    // console.log(req.cookies);
    if (req.cookies.jwt) {
        try {
            //1) verify the token
            const decoded = await promisify(jwt.verify)(req.cookies.jwt,
                process.env.JWT_SECRET
            );
            console.log(decoded);
            //2) Check if the user still exists
            db.query('SELECT * FROM MANAGER WHERE ManagerID = ?', [decoded.ManagerID], (error, result) => {
                console.log(result);
                if (result.length == 0) {
                    db.query('SELECT * FROM PATIENT WHERE PatientID = ?', [decoded.PatientID], (error, result) => {
                        console.log(result);
                        if (result.length == 0) {

                            db.query('SELECT * FROM DOCTOR WHERE DoctorID = ?', [decoded.DoctorID], (error, result) => {
                                if (result.length == 0) {
                                    return next();
                                } else {
                                req.user = result[0];
                                console.log("user is")
                                console.log(req.user);
                                return next();}
                            });
                        } else{

                        req.user = result[0];
                        console.log("user is")
                        console.log(req.user);
                        return next();}
                    });
                }
                else {
                    req.user = result[0];
                    console.log("user is")
                    console.log(req.user);
                    return next();
                }
            });
        } catch (error) {
            console.log(error);
            return next();
        }
    } else {
        next();
    }
}
exports.logout = async (req, res) => {
    res.cookie('jwt', 'logout', {
        expires: new Date(Date.now() + 2 * 1000),
        httpOnly: true
    });

    res.status(200).redirect('/');
}
