const express = require('express');

const router = express.Router();

const passport = require('passport'),
    OAuth2Strategy = require('passport-oauth').OAuth2Strategy;


//configure passport
passport.use('provider', new OAuth2Strategy({
    authorizationURL: 'https://www.reddit.com/api/v1/authorize',
    tokenURL: 'https://www.reddit.com/api/v1/access_token',
    clientID: 'IXKX_GNnghWNYA',
    clientSecret: 'xEOulPITcRVJww_kfHCjGqRXYZs',
    callbackURL: 'http://localhost:8080/passport/reddit/callback'
},
    function (accessToken, refreshToken, profile, done) {
        return done(null, profile);
    })
);

router.get('/login', passport.authenticate('provider', { scope: 'identity', state: 'rando' }));

router.get('/callback', function (req, res) {
    passport.authenticate('provider', {
        successRedirect: "/success",
        failureRedirect: "/failure"
    });
});

router.get('/success', function (req, res){
    res.send("Success");
});

router.get('/failure', function (req, res){
    res.send("Failure");
});


module.exports = router;
