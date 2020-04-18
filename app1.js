
const express  			= require('express'),
	  app 				= express(),
	  request       	= require('request'),
	  bodyparser 		= require('body-parser'),
	  methodOverride 	= require('method-override'),
	  expressSanitizer 	= require('express-sanitizer'),
	  mongoose		    = require('mongoose'),
	  flash 			= require('connect-flash'),
	  passport 			= require('passport'),
	  passportLocal 	= require('passport-local'),
	  passportLocalMongoose = require('passport-local-mongoose'),
	  util 				= require('util'),
	  calendarData 		= require('./models/calendarData'),
	  contactCalendarData = require('./models/contactCalendarData'),
	  calendarUser 		= require('./models/calendarUser');

var indexRoutes 		= require('./routes/indexRoutes');
var authRoutes 			= require('./routes/authRoutes');

const moment 		= require('moment');

app.use(express.static(__dirname + '/public'));

app.use(bodyparser.urlencoded({ extended: true }));

app.use(methodOverride('_method'));

app.use(expressSanitizer());

app.use(
	require('express-session')({
		cookie: { maxAge: 1*60*60*1000 },
		secret: 'secret',
		resave: false,
		saveUninitialized: false
	})
);

app.use(flash());

app.use(passport.initialize());

app.use(passport.session());

passport.use(new passportLocal(calendarUser.authenticate())); // works to user authentication- checks while log in

passport.serializeUser(calendarUser.serializeUser());

passport.deserializeUser(calendarUser.deserializeUser());

app.use(function(req, res, next) {
	res.locals.currentUser = req.user;

	res.locals.error = req.flash('error');

	res.locals.success = req.flash('success');

	next();
});

app.use(authRoutes);

app.use(indexRoutes);

// For Regular Listening:

app.listen(3000, () => {
	console.log('server listening on port 3000');
});


// Listening through Heroku PORT:

var port = process.env.PORT || 5000;

app.listen(port, function (){ 
	console.log("Server Has Started!");
});
