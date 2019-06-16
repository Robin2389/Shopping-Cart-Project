var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

var csrfProtection = csrf();
router.use(csrfProtection);

// Profile
router.get('/profile', isLoggedIn, function(req, res, next) {
    res.render('user/profile');
});

// Logout 
router.get('/logout', isLoggedIn, function(req, res, next) {
    req.logout(); // function provided by the passport package
    res.redirect('/'); // redirect to the front page
});

// Check all requests to see if we are logged in
router.use('/', notLoggedIn, function(req, res, next) {
    next();
});

// Signup
router.get('/signup', function(req, res, next) {

    var messages = req.flash('error');
    res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});
router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/user/profile',
    failureRedirect: '/user/signup',
    failureFlash: true
}));

// Signin
router.get('/signin', function(req, res, next) {
    var messages = req.flash('error');
    res.render('user/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});
router.post('/signin', passport.authenticate('local.signin', {
    successRedirect: '/user/profile',
    failureRedirect: '/user/signin',
    failureFlash: true
}));

module.exports = router;

// Protection Middleware
function isLoggedIn(req, res, next)  {
    if (req.isAuthenticated()) {  // isauthenitcated is a function from passport
        return next();
    }
    res.redirect('/');
}

function notLoggedIn(req, res, next)  {
    if (!req.isAuthenticated()) {  
        return next();
    }
    res.redirect('/');
}
