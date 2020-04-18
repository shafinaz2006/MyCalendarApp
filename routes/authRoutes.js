const express = require('express'),
	router = express.Router(),
	request = require('request'),
	passport = require('passport'),
	calendarData = require('../models/calendarData'),
	contactCalendarData = require('../models/contactCalendarData'),
	calendarUser 	= require('../models/calendarUser'),
	middlewareObj = require('../middleware'),
	util = require('util'),
	date = new Date();


//AUTH Routes:

// Register Routes:

router.get('/register', function(req, res) {
	
	console.log('In register page');
	
	res.render('register.ejs');
	
});

// Handling user registration:

router.post('/register', function(req, res) {
	
	var newCalendarUser = new calendarUser({ username: req.body.username });

	calendarUser.register(newCalendarUser, req.body.password, function(err, user) {
		if (err) {
			
			console.log(err.message);

			req.flash('error', err.message);

			return res.redirect('/register');
		}
		passport.authenticate('local')(req, res, function() {
			
			req.flash('success', 'Registration successful for: ' + user.username);

			res.redirect('/todo');
		});
	});
});

// LOG IN Routes:

// Log in Form:

router.get('/login', function(req, res) {
	
	res.render('login.ejs');
	
});

// Log in Logic:

router.post('/login',
			passport.authenticate('local', {
				successRedirect: '/',

				failureRedirect: '/login',

				failureFlash: true
			}),
			function(req, res) {}
);

// LOG OUT:

router.get('/logout', function(req, res, next) {
	if (req.session) {
		req.session.destroy(function(err) {
			if (err) {
				return next(err);
			} else {
				console.log('logged out');
											
				res.redirect('/todo');
			}
		});
	}
});

module.exports = router;

