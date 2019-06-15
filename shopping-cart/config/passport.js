//Iniitalize variables, we are using the local strategy for passport in this case.
var passport = require('passport');
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;

// Then we store the user in the session and serialize it by ID.
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

/* We also want to deserialize the user,
    This will use the mongoDB as we use the call
    .findByID. We pass the ID which is stored in a session, and 
    we can either get a user or an error. */
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

/* Now we need a sign up strategy to make new users
    We will call it local.signup and we will use the LocalStrategy function
    This functin takes two arguments: 
        The first is a configuration in the form of a js object. 
        The second is a callback function
    We can then use the user.findOne function to get the email which will 
    produce the desired flash message errors when something goes wrong.
    This will be outputed through the view file. */
passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done) {
    User.findOne({'email': email}, function(err, user) {
        // Error
        if (err) {
            return done(err);
        }
        
        // User already exists, must send flash message.
        if (user) {
            return done(null, false, {message: 'Email is already in use.'});
        }
        /* If we pass both checks:
            1. No errors, 2. User doesn't already exist
            Than now we can create the new user */
        var newUser = new User();
        newUser.email = email;

        // Now we are going to add the password encryption info in /models/user.js

        /* Now that we have added the password information into user.js, we
        can incorporate that here */
        newUser.password = newUser.encryptPassword(password);
        newUser.save(function(err, result) {
            if (err) {
                return done(err);
            }
            return done(null, newUser);
        });
    })
}));

/* Now that we have created our strategy in passport.js, we have to figure out 
    how to apply this strategy. To do this we will have to edit /routes/index.js */