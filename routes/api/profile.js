const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const Profile = require('../../models/Profile');
const Person = require('../../models/Person');

//@type GET
//@route /api/profile
//@desc route for the individual profile
//@access PRIVATE

router.get('/', passport.authenticate('jwt', {session: false}), 
    (req, res)=>{
        Profile.findOne({user: req.user.id})
            .then((profile) => {
                if(!profile){
                    res.status(404).json({profileErr: "Profile Not Found"});
                }
                res.json(profile);
            }).catch((err) => {
                console.log(err.message);
            });
});

//@type POST
//@route /api/profile
//@desc route for the UPDATING/SAVING user Profile
//@access PRIVATE

router.post('/', passport.authenticate('jwt', {session: false}),
    (req, res) => {
        const ProfileValues = {};
        ProfileValues.user =  req.user.id;
        if(req.body.username) ProfileValues.username = req.body.username;
        if(req.body.website) ProfileValues.website = req.body.website;
        if(req.body.country) ProfileValues.country = req.body.country;
        if(req.body.portfolio) ProfileValues.portfolio = req.body.portfolio;
        if(typeof req.body.languages !== undefined)
            ProfileValues.languages = req.body.languages.split(',');

        ProfileValues.workrole = Array();
        let workRoleObj = {};
        if(req.body.role) workRoleObj.role = req.body.role;
        if(req.body.company) workRoleObj.company = req.body.company;
        if(req.body.country) workRoleObj.country = req.body.country;
        if(req.body.from) workRoleObj.from = req.body.from;
        if(req.body.current) workRoleObj.current = req.body.current;

        ProfileValues.workrole[0]=(workRoleObj);

        ProfileValues.social = {}
        if(req.body.youtube) ProfileValues.social.youtube = req.body.youtube;
        if(req.body.facebook) ProfileValues.social.facebook = req.body.facebook;
        if(req.body.instagram) ProfileValues.social.instagram = req.body.instagram;

        //DO database stuff
        Profile.findOne({user: req.user.id})
            .then((profile) => {
                if(profile){
                    Profile.findOneAndUpdate(
                        {user: req.user.id},
                        {$set: ProfileValues},
                        {new: true}
                    )
                    .then((profile) => {
                        res.json(profile);
                    }).catch((err) => {
                        console.log(err.message);
                    });
                }
                else{
                    Profile.findOne({username: ProfileValues.username})
                        .then((profile) => {
                            if(profile){
                                //if username already exits
                                res.status(400).json({userErr: "username already exits"})
                            }
                            //save user
                            new Profile(ProfileValues).save()
                                .then((profile) => {
                                    res.json(profile);
                                }).catch((err) => {
                                    console.log(err.message);
                                });
                        }).catch((err) => {
                            console.log(err.message);
                        });
                }
            }).catch((err) => {
                console.log(err.message);
            });

});



//@type POST
//@route /api/profile/mywork
//@desc route for adding work of the person
//@access PRIVATE

router.post('/mywork', passport.authenticate('jwt', {session: false}), 
    (req, res) => {
        Profile.findOne({user: req.user.id})
            .then((profile) => {
                if(!profile)
                    res.status(404).json({profileErr: "profile not found"});

                const newWork = {
                    role: req.body.role,
                    company: req.body.company,
                    country: req.body.country,
                    from: req.body.from,
                    to: req.body.to,
                    current: req.body.current,
                }

                profile.workrole.push(newWork);
                profile.save()
                    .then((profile) => {
                        res.json(profile);
                    }).catch((err) => {
                        console.log(err.message);
                    });
            }).catch((err) => {
                console.log(err.message);
            });
    }
);



//@type GET
//@route /api/profile/:username
//@desc route for getting user profile base on username
//@access PUBLIC

router.get('/:username', passport.authenticate('jwt', {session: false}),
    (req, res) => {
        Profile.findOne({username: req.params.username})
            .then((profile) => {
                if(!profile) res.status(404).json({profileErr: "Profile not found"});
                res.json(profile);
            }).catch((err) => {
                console.log(err.message);
            });
    }
);



//@type DELETE
//@route /api/profile
//@desc route for deleting the profile
//@access PRIVATE

router.delete('/', passport.authenticate('jwt', {session: false}),
    (req, res) => {
        Profile.findOne({user: req.user.id})
            .then((profile) => {
                if(!profile) res.status(404).json({profileErr: "Profile not Found"});
                
                Profile.findOneAndRemove({user: req.user.id})
                    .then(() => {
                        Person.findOneAndRemove({_id: req.user.id})
                            .then(() => {
                                res.json({Sucess: "Sucessfully removed user"});
                            }).catch((err) => {
                                console.log(err.message);
                            });
                    }).catch((err) => {
                        
                    });
            }).catch((err) => {
                console.log(err.message);
            });
    }
);



//@type DELETE
//@route /api/profile/workrole/:w-id
//@desc route for deleting the workrole
//@access PRIVATE

router.delete('/workrole/:w_id', passport.authenticate('jwt', {session: false}),
    (req, res) => {
        Profile.findOne({user: req.user.id})
            .then((profile) => {
                if(!profile) res.status.json({profileErr: "profile not found"});

                const removethis = profile.workrole.map((item)=> item.id).indexOf(req.params.w_id);
                profile.workrole.splice(removethis, 1);

                profile.save()
                    .then((profile) => {
                        res.json(profile);
                    }).catch((err) => {
                        console.log(err.message);
                    });
            }).catch((err) => {
                console.log(err.message);
            });
    }
);

module.exports = router;