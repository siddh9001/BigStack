const mongoose = require('mongoose');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const Person = mongoose.model('myPerson');
const myKey = require('../setup/Dburl');

var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = myKey.secret;

module.exports = passport => {
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        Person.findById(jwt_payload.id)
            .then((person) => {
                if(person){
                    return done(null, person);
                }
                return done(null, false);
            }).catch((err) => {
                console.log(err);
            });
    }));
}