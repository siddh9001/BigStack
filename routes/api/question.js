const express = require('express');
const passport = require('passport');
const Profile = require('../../models/Profile');
const Question = require('../../models/Question');
const router = express.Router();

//@type GET
//@route /api/questions
//@desc route for getting all questions
//@access PUBLIC
router.get('/', (req, res)=>{
    Question.find()
        .then((question) => {
            res.json(question);
        }).catch((err) => {
            console.log(err.message);
        });
});

//@type POST
//@route /api/questions/
//@desc route for submitting questions
//@access PRIVATE
router.post('/', passport.authenticate('jwt', {session: false}),
    (req, res) =>{
        const newQuestion = new Question({
            user: req.user.id,
            name: req.body.name,
            textone: req.body.textone,
            texttwo: req.body.texttwo,
        })
        newQuestion.save()
            .then((question) => {
                res.json(question);
            }).catch((err) => {
                console.log(err.message);
            });

    }
);

//@type POST
//@route /api/questions/answers/:id
//@desc route for submitting answers to question
//@access PRIVATE
router.post('/answers/:id', passport.authenticate('jwt', {session: false}),
    (req, res) => {
        Question.findById(req.params.id)
            .then((question) => {
                const newAnswer = {
                    user: req.user.id,
                    text: req.body.text,
                    name: req.body.name,
                }

                question.answers.unshift(newAnswer);
                question.save()
                    .then((question) => {
                        res.json(question);
                    }).catch((err) => {
                        console.log(err.message);
                    });
            }).catch((err) => {
                console.log(err.message);
            });
    }
);

//@type POST
//@route /api/questions/upvote/:id
//@desc route for upvoting
//@access PRIVATE
router.post('/upvote/:id', passport.authenticate('jwt', {session: false}),
    (req, res) => {
        Profile.findOne({user: req.user.id})
            .then((profile) => {
                if(!profile) res.status(404).json({profileErr: "profile not found"});
                Question.findById(req.params.id)
                    .then((question) => {
                        if(question.upvotes.filter(upvote => 
                            upvote.user.toString() === req.user.id.toString()).length > 0){
                                res.status(400).json({upvoteErr: "already upvoted"});

                        }
                        else{
                            question.upvotes.unshift({user: req.user.id});
                            question.save()
                                .then((question) => {
                                    res.json(question);
                                
                                }).catch((err) => {
                                    console.log(err.message);
                                });
                        }
                    }).catch((err) => {
                        
                    });
            }).catch((err) => {
                console.log(err.message);
            });
    }
);

//@type DELETE
//@route /api/questions/downvote/:id
//@desc route for downvoting
//@access PRIVATE
router.delete('/downvote/:id', passport.authenticate('jwt', {session: false}),
    (req, res) => {
        Profile.findOne({user: req.user.id})
            .then((profile) => {
                if(!profile) res.status(404).json({profileErr: "profile not found"});
                Question.findById(req.params.id)
                    .then((question) => {
                        const removeidx = question.upvotes.map((item, idx) => {if(item.user === req.user.id) return idx;});
                        question.upvotes.splice(removeidx, 1);

                        question.save()
                            .then((question) => {
                                res.json(question);
                            }).catch((err) => {
                                console.log(err.message);
                            });
                        
                    }).catch((err) => {
                        
                    });
                
            }).catch((err) => {
                
            });
    }
);

//@type DELETE
//@route /api/questions/:id
//@desc route for deleting the question
//@access PRIVATE
router.delete('/:id', passport.authenticate('jwt', {session: false}),
    (req, res) => {
        Profile.findOne({user: req.user.id})
            .then((profile) => {
                if(!profile) res.status(404).json({profileErr: "profile not found"});

                Question.findByIdAndRemove(req.params.id)
                    .then(() => {
                        res.json({Sucess: "Sucessfully removed question"});
                    }).catch((err) => {
                        console.log(err.message);
                    });

            }).catch((err) => {
                
            });
    }
);

//@type DELETE
//@route /api/questions/
//@desc route for deleting all the questions
//@access PRIVATE
router.delete('/', passport.authenticate('jwt', {session: false}),
    (req, res) => {
        Profile.findOne({user: req.user.id})
        .then((profile) => {
            if(!profile) res.status(404).json({profileErr: "profile not found"});

            Question.deleteMany()
                .then(() => {
                    res.json({Sucess: "All questions deleted"});
                }).catch((err) => {
                    console.log(err.message);
                });
        }).catch((err) => {
            
        });
    }
);

module.exports = router;