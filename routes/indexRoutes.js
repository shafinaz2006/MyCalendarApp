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

// Find the date to query:

const moment = require('moment');

//INDEX Routes: **********************************************************************************

router.get('/', function(req, res) {
	res.redirect('/todo');
});

router.get('/todo', function(req, res){
	
	console.log('req.user is: ' + req.user);
	
	var date = new Date();

	var today = date.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' });

	console.log('PST is: ' + today);
	
	var keywordQuote = 'inspire';
	var keywordWeather = 'Vancouver';
	var accessKeyWeather = 'f38e20be28d7a7beab53ba483162213f';
	
	var weatherURL = 
		'http://api.weatherstack.com/current?access_key=' + accessKeyWeather + '&query=' + keywordWeather
	
	//console.log(weatherURL)
	
	var quoteData, weatherData;
	
	var pageDay = new Date(today);
	
	var startTodos = '', endTodos = '';
	
	var isLoggedIn = false;
	
	request('http://quotes.rest/qod.json?category=' + keywordQuote, function(error, response, body){

		quoteData = getQuoteAPIData(error, response, body);
		
		//console.log('quoteData in index Route: ' + util.inspect(quoteData, false, null, true));
		
		request(weatherURL, function(error, response, body) {

			console.log('today is: ' + new Date(today))

			weatherData = getWeatherAPIData(error, response, body);

			//console.log('weatherData in index route: ' + util.inspect(weatherData, false, null, true));

			if(!req.user){

				res.render('index.ejs', {pageDay:pageDay,
										isLoggedIn: isLoggedIn,
										quoteData: quoteData,
										weatherData: weatherData,
										startTodos: startTodos,
										endTodos: endTodos});
			}else{

				isLoggedIn = true;
				
				var queryUser = {user: {id: req.user._id, name: req.user.username}};
	
				//console.log('queryUser: ' + util.inspect(queryUser, false, null, true));

				var queryStartDate = {user: {id: req.user._id, name: req.user.username},

									  startDate: {	$gte: moment(today, 'MM-DD-YYYY').startOf('day').toDate(),

													$lte: moment(today, 'MM-DD-YYYY').endOf('day').toDate()} };

				var queryEndDate = {user: {id: req.user._id, name: req.user.username},
									
									endDate: { $gte: moment(today, 'MM-DD-YYYY').startOf('day').toDate(),

											  $lte: moment(today, 'MM-DD-YYYY').endOf('day').toDate()} };

				calendarData.find(queryStartDate, function(err, startTodos){

					//console.log('startTodos: ' + util.inspect(startTodos, false, null, true));

					calendarData.find(queryEndDate, function(err, endTodos){

				 	//console.log('endTodos: ' + util.inspect(endTodos, false, null, true));

						res.render('index.ejs', {pageDay:pageDay,isLoggedIn: isLoggedIn, 
												 quoteData: quoteData, weatherData: weatherData, 
												 startTodos: startTodos, endTodos: endTodos});
					});

				});
			}
								
		});
		
	});
		
});


// /todo/new Routes: *****************************************************************************

router.get('/todo/new', middlewareObj.isLoggedIn, function(req, res) {
	
	console.log('********inside /todo/new GET route');
	
	res.render('createToDo.ejs');
	
});

// /todo/new POST Route:

router.post('/todo', middlewareObj.isLoggedIn, function(req, res){
	
	console.log('********inside /todo/new POST route');
	
    var user = {id: req.user._id, name: req.user.username};
	
	req.body.description = req.sanitize(req.body.description.trim()); 
	
	var newCalendarData = { user: user, 
						  title: req.body.title,
						  description: req.body.description,
						  startDate: req.body.startDate,
						  endDate: req.body.endDate,
						  statusRadio: req.body.statusRadio};
	
	console.log('newCalendarData' + util.inspect(newCalendarData, false, null, true));
	
	// calendarData.collection.dropIndexes(function(err, reply) {

	// 	if (err) {

	// 		console.log('Couldn"t drop all indexes' + err);

	// 	} else {

			calendarData.create(newCalendarData, function(err, newCalendarData) {
				
				if(err){
					
					console.log(err);
					
				}else {
					
					console.log('newCalendarData after POST create' + 
								util.inspect(newCalendarData, false, null, true));
					
	 				res.redirect('/todo');
				}
			});
		// }
	// }); 
	
 });




//SHOW Date pages: *******************************************************************************************

router.get('/todo/year/:yearId/month/:monthId/day/:dayId', middlewareObj.isLoggedIn, function(req, res) {
	
	console.log(
		'req params in show route: ' + req.params.yearId + req.params.monthId + req.params.dayId
	);

	var dateShow = new Date(req.params.yearId, req.params.monthId - 1, req.params.dayId);

	console.log('dateShow is: ' + dateShow);

	var queryUser = {user: {id: req.user._id, name: req.user.username}};
	
	console.log('queryUser: ' + util.inspect(queryUser, false, null, true));

	var queryStartDate = {user: {id: req.user._id, name: req.user.username},

						  startDate: {	$gte: moment(dateShow, 'MM-DD-YYYY').startOf('day').toDate(),

										$lte: moment(dateShow, 'MM-DD-YYYY').endOf('day').toDate()} };

	var queryEndDate = {user: {id: req.user._id, name: req.user.username},

						endDate: { $gte: moment(dateShow, 'MM-DD-YYYY').startOf('day').toDate(),

								  $lte: moment(dateShow, 'MM-DD-YYYY').endOf('day').toDate()} };

	console.log('queryStartDate is: ' + util.inspect(queryStartDate, false, null, true));

	//console.log('queryEndDate is: ' + util.inspect(queryStartDate, false, null, true));

	calendarData.find(queryStartDate, function(err, foundStartData) {
		
		if (err) {
			
			console.log(err);
			
		} else {
			
			console.log('foundStartData is: ' + foundStartData);

			calendarData.find(queryEndDate, function(err, foundEndData) {
				
				if (err) {
					
					console.log(err);
					
				} else {
					
					//console.log('foundEndData is: ' + foundEndData);

					res.render('showToDo.ejs', {
						dateShow: dateShow,
						startTodos: foundStartData,
						endTodos: foundEndData
					});
				}
			});
		}
	});
});

//EDIT ROUTES ******************************************************************************************

// EDIT Route

router.get('/todo/:id/edit', function(req, res){
	
	//res.send('in edit get route;')
	
	console.log('*****************in edit GET Route')
	
	calendarData.findById(req.params.id, function(err, foundTodo){
		
		if(err){
			
			console.log(err);
			
		}else{
			
			console.log('inside /todo/:id/edit GET route ' + foundTodo);
			
			res.render('editToDo.ejs', {foundTodo: foundTodo});
			
		}
	});
	
});


//UPDATE Route

router.put('/todo/:id', function(req, res){
	
	req.body.todo.description = req.sanitize(req.body.todo.description.trim()); 
	
	//sanitized user input in todo.description field
		
	calendarData.findByIdAndUpdate(req.params.id, req.body.todo, {new: true}, function(err, updatedTodo){
		
		if(err){
			
			//req.flash('error', 'Your todo is not updated');
			
			console.log(err);
		
			
		}else{
			
			console.log('*****' + util.inspect(updatedTodo, false, null, true /* enable colors */));
			
			req.flash('success', 'Your todo is updated');
			
			res.redirect('/todo'); 
		}
	});
	
});




//DELETE Route:

router.delete('/todo/:id', function(req, res){

	calendarData.findByIdAndRemove(req.params.id, function(err, updatedTodo){
		
		if(err){
			
			console.log(err);
			
			req.flash('error', 'todo is not deleted. Something went wrong');
			
			res.redirect('/todo');
			
		}else{
			
			req.flash('success', 'todo is removed');
			
			res.redirect('/todo'); // redirecting: '/todo
		}
	});
	
});

//Daily Quotes ROUTE (separate)***********************************************************************************

router.get('/results', function(req, res) {
	
	var keyword = 'inspire';

	request('http://quotes.rest/qod.json?category=' + keyword, function(error, response, body) {
		
		if (!error && response.statusCode == 200) {
			
			var apiData = JSON.parse(body);

			var quote, author;

			var quoteData = {
				quote: apiData.contents.quotes[0].quote,
				author: apiData.contents.quotes[0].author
			};

			res.send(quoteData);

		}
	});
});

//Daily Weather ROUTE (separate)***********************************************************************************

router.get('/weather', function(req, res) {
	var keyword = 'Vancouver';
	var accessKey = '01fff300ae102e9953fdd211e386f301';

	request(
		'http://api.weatherstack.com/current? access_key=' + accessKey + '& query=' + keyword,
		
		function(error, response, body) {
			if (!error && response.statusCode == 200) {
				var weatherAPIData = JSON.parse(body);

				var temperature, weather_icons, weather_descriptions, wind_speed, precip, humidity;

				var weatherData = {
					temperature: weatherAPIData.current.temperature,
					weather_icons: weatherAPIData.current.weather_icons,
					weather_descriptions: weatherAPIData.current.weather_descriptions,
					wind_speed: weatherAPIData.current.wind_speed,
					precip: weatherAPIData.current.precip,
					humidity: weatherAPIData.current.humidity
				};

				res.send(weatherData);

				console.log('This is requested: /results');
			}
		}
	);
});


//CONTACT Routes:

// CONTACT GET Route:

router.get('/contact/new', function(req, res) {
	
	console.log('inside /contact/new GET route');

	res.render('contactUs.ejs');
	
});

//CONTACT POST Route:

router.post('/contact', function(req, res){
	
	req.body.contact.message = req.sanitize(req.body.contact.message.trim())
	
	var contactInfo = req.body.contact;

	console.log('/contact: POST route. New Data is prepared: ');

	// console.log(
	// 	'contactInfo before adding db:' +
	// 		util.inspect(contactInfo, false, null, true /* enable colors */)
	// );

	contactCalendarData.collection.dropIndexes(function(err, reply) {
		if (err) {
			console.log('Couldn"t drop all indexes' + err);
		} else {
			contactCalendarData.create(contactInfo, function(err, contactInfo) {
				if (err) {
					console.log('Error' + err);

					res.render('/todo');
					
				} else {
					console.log('/contact: POST route. New Data is created: ' + contactInfo);

					//res.send(contactInfo);

					req.flash('success', 'Thank you for your query. Our administrator will contact you shortly');

					res.redirect('/todo');
				}
			});
		}
	});
});

function getQuoteAPIData(error, response, body) {
	
	var quote, author, quoteData;

	quoteData = {
			quote: 'Do the best you can until you know better. Then when you know better, do better.',
			author: 'Jim Rohn'
		};

	if (error) {
		
		console.log('quote request error' + error);
		
		return quoteData
	}
	
	if (!error && response.statusCode == 200) {

		var apiData = JSON.parse(body);

		 if (apiData.contents.quotes[0].quote.length > 100 ){
			 
			 return quoteData;
			 
		 }else{

			 quoteData = {
				quote: apiData.contents.quotes[0].quote,
				author: apiData.contents.quotes[0].author
			};
		}
	}

	// console.log('Quote data getAPIDataQuote: ' + util.inspect(quoteData, false, null, true));
	
	return quoteData;
	
}

function getWeatherAPIData(error, response, body){
	
		var temperature, weather_icons, weather_descriptions, wind_speed, precip, humidity;
	
		var weatherData = {
					temperature: '',
					weather_icons: '' ,
					weather_descriptions: '' ,
					wind_speed: '',
					precip: '',
					humidity: ''
				};

		if (error) {
				console.log('Weather request error' + error);
			
				return weatherData

			}
		if (!error && response.statusCode == 200) {

					var weatherAPIData = JSON.parse(body);
			
					// console.log(weatherAPIData)

					 weatherData = {
						temperature: weatherAPIData.current.temperature,
						weather_icons: weatherAPIData.current.weather_icons,
						weather_descriptions: weatherAPIData.current.weather_descriptions,
						wind_speed: weatherAPIData.current.wind_speed,
						precip: weatherAPIData.current.precip,
						humidity: weatherAPIData.current.humidity
					};
		}
	// console.log('weatherData from getAPIDataWeather: ' + util.inspect(weatherData, false, null, true));
	
	return weatherData;
}


module.exports = router;