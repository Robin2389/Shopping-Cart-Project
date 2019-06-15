var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

var Product = require('../models/product');

var csrfProtection = csrf();
router.use(csrfProtection);

/* GET home page. */
router.get('/', function(req, res, next) {
  Product.find(function(err, docs) {
    var productChunks = [];
    var chunkSize = 3;
    for (var i = 0; i < docs.length; i += chunkSize) {
      productChunks.push(docs.slice(i, i + chunkSize));
    }
    res.render('shop/index', { title: 'Express/NodeJS/MongoDB Shopping Cart Project' , products: productChunks});
  });
});

router.get('/user/signup', function(req, res, next) {

      /*  Original Code: 
  res.render('user/signup', {csrfToken: req.csrfToken()});
});   */

// Altered Code to include messages:
  var messages = req.flash('error');
  res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});



/* We now need to re-edit the router code to use our passport.js strategy.
    In order to do this, we no longer redirect to the '/' route, instead we 
    will introduce the passport.js file function. So let's compare the old code
    with the new code.
*/

// The old router code:
/* 
router.post('/user/signup', function(req, res, next) {
  res.redirect('/');
});
*/

// The new router code:
router.post('/user/signup', passport.authenticate('local.signup', {
  successRedirect: '/user/profile',
  failureRedirect: '/user/signup',
  failureFlash: true
}));
/* But now this code needs to be recognized by password.js, so we have to write
code to import this file index.js into app.js. So let's go to app.js. */


//We need to also add our profile route
router.get('/user/profile', function(req, res, next) {
  res.render('user/profile')
});

module.exports = router;


