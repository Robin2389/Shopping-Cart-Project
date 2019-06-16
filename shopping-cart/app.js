var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressHbs = require('express-handlebars');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');
var MongoStore = require('connect-mongo')(session);

var indexRouter = require('./routes/index');
var userRoutes = require('./routes/user');

var app = express();

mongoose.connect('mongodb://localhost:27017/shopping', {useNewUrlParser: true } );

/* Here we will include our index.js package. (This is the same as copying and pasting the entire code
  from /config/password.js into this app.js file) */
require('./config/passport');

// view engine setup
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');

app.use(logger('dev'));

// Express parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Here we add the validator because the code had to be parsed first
app.use(validator());

app.use(cookieParser());

// This is how we initialize the session
app.use(session({
  secret: 'secretkey', 
  resave: false, 
  saveUninitialized: false,
  // Add our store function here:
  store: new MongoStore({ mongooseConnection: mongoose.connection }), // we access the current mongoose section
  cookie: { maxAge: 180 * 60 * 1000} // Here we set the max length of our session (in milliseconds)
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session; // This way we can access session in all our view templates without having to pass through our routes functions
  next();
});

// Here we call our route file:
app.use('/user', userRoutes);
// The '/' function says call any other folder
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
