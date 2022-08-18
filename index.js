const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const app = express();

const auth = require('./routes/api/auth');
const profile = require('./routes/api/profile');
const questions = require('./routes/api/question');
const passport = require('passport');

const port = process.env.PORT || 5001

//mongoDB configuration
const db = require('./setup/Dburl').URL;

//attempt to connect to DB
mongoose.connect(db)
    .then(()=>console.log("Sucessfully connected"))
    .catch(err=>console.log(err.message));

//middleware for passport 
app.use(passport.initialize());

//config for jwt strategy
require('./strategies/jsonwtStrategies')(passport);

//Midleware for bodyparser
app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());


//route for test
app.get('/', (req, res)=>{
    res.send('Hello bigstack project');
})

//actual routes
app.use('/api/auth', auth);
app.use('/api/profile', profile);
app.use('/api/questions', questions);

app.listen(port, ()=>console.log(`Server listening at ${port}`));