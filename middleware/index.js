
var middlewareObj = {};

var calendarData 	= require('../models/calendarData'),
	calendarUser 	= require('../models/calendarUser'),
contactCalendarData = require('../models/contactCalendarData');

middlewareObj.isLoggedIn = function(req, res, next){
	
	if(req.isAuthenticated()){
	
		return next();
		
	}
	req.flash('error', 'Please log in to your account');
	
	//console.log('logging verification completed. not logged in')
	
	res.redirect('/login');
}




module.exports = middlewareObj;

