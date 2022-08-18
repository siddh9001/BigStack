const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const key = require('../../setup/Dburl');
const jsonwt = require('jsonwebtoken');

router.get('/', (req, res)=>{
    return res.json({
        test: "Auth sucessfull",
    })
})

//import Schema from Person to Register
const Person = require('../../models/Person');
const passport = require('passport');

//@type POST
//@route /api/auth/register
//@desc route for user registration
//@access PUBLIC

//route for registration
router.post('/register', (req,res)=>{
        //find the person in db
        Person.findOne({
            email: req.body.email})
                .then((person) => {
                    if(person){
                        res.status(404).json({
                            emailError: "User already exists",
                            // PersonDetails: person,
                        })
                    }
                    else{
                        const newPerson = new Person({
                            name: req.body.name,
                            email: req.body.email,
                            password: req.body.password,
                            username: req.body.username,
                        });
                        bcrypt.genSalt(10, (err, salt) => {
                            bcrypt.hash(newPerson.password, salt, (err, hash) => {
                                // Store hash in your password DB.
                                if(err) throw err;
                                newPerson.password = hash;
                                newPerson.save()
                                    .then((person) => {
                                        res.json(person);
                                    }).catch((err) => {
                                        console.log(err);
                                    });
                            });
                        });
                    }
                }).catch((err) => {
                    console.log(err);
        });
});

//@type POST
//@route /api/auth/login
//@desc route for user login
//@access PUBLIC

//route for login
router.post('/login', (req, res)=>{
    const email = req.body.email;
    const password = req.body.password;

    Person.findOne({email})
        .then((person) => {
            if(!person){
                res.status(404).json({UserError: "User not found"});
            }
            bcrypt.compare(password, person.password)
                .then((isCorrect) => {
                    if(isCorrect){
                        // res.json({User: "User sucessfully logged In"});
                        // use payload and create token for the user
                        const payload = {
                            id: person.id,
                            name: person.name,
                            email: person.email,
                            password: person.password,
                        };
                        jsonwt.sign(
                            payload, 
                            key.secret, 
                            { expiresIn: '1h' },   
                            (err, token) => {
                                if(err) throw err;
                                res.json({
                                    sucess: true,
                                    token: "Bearer " + token,
                                });
                            },
                        );
                    }
                    else
                        res.json({passwdErr: "Password us incorrect"});
                }).catch((err) => {
                    console.log(er.message);
                });

        }).catch((err) => {
            console.log(err.message);
        });
})

//@type GET
//@route /api/auth/profile
//@desc users login
//@access PRIVATE

//route for profile
router.get('/profile', passport.authenticate('jwt', { session: false }), 
    (req, res) => {
        res.json({
            id: req.user.id,
            name: req.user.name,
            email: req.user.email,
        });
    }
);



module.exports = router;