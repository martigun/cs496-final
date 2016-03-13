//Gunnar Martin
//CS496
//Winter 2016
//Final Project



//set requires
var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var bodyParser = require('body-parser'); //requires the body-parser module

//set app
var app = express();

//set uses
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); //json data
app.use(express.static(__dirname));

//initiate handlebars
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

var rootURL = 'http://localhost:3600'

app.get('/', function(req, res) {
	
	//create context object
	var obj = {};
	
	res.render('menu', obj);
	
	//res.render('login', context);
	//res.redirect('/viewCoaches');

});



app.get('/viewCoaches', function(req, res) {
	
	//create context object
	var obj = {};

	//Get coaches
	var options = { method: 'GET',	url : rootURL + '/coach' };
	request(options, function(error, response, body){
		
		//set dArray to the body
		var dArray = JSON.parse(body);
		
		//load up the object
		obj.dArray = dArray;
		
		//render coaches
		res.render('coaches', obj);
	});
});

app.get('/deleteCoach', function(req, res) {
	
	//get coach id
	var coach_id = req.query.coach_id;
	
	console.log("Deleting coach: " + coach_id);

	//Delete this coach
	var options = { 
		method: 'DELETE',
		url : rootURL + '/coach/' + coach_id,
		headers: {'Content-Type' : 'application/json'}
	};
	request(options, function(error, response, body){
		
		console.log(body);
		
		//redirect to coach table
		res.redirect('/viewCoaches');
	});
});

app.get('/addCoachForm', function(req, res) {
	
	//render the addCoach page
	var obj = {};
	res.render('addCoach', obj);
});

app.get('/editCoachForm', function(req, res) {
	
	//get coach id
	var coach_id = req.query.coach_id;
	
	//set options
	var options = { 
		method: 'GET',	
		url : rootURL + '/coach/' + coach_id
	};
	
	//Get this coach
	request(options, function(error, response, body){
		
		//set dArray to the body
		var obj = JSON.parse(body);
		
		//render coaches
		res.render('editCoach', obj);
	});
});

app.get('/editCoach', function(req, res) {
	
	//get coach id
	var coach_id = req.query.coach_id;
	
	var obj = {};
	
	console.log("Coach Edit!");
	console.log("Coach ID:" + coach_id);
	
	var origURL = req.originalUrl;
	
	console.log(origURL);
	

	//set options
	var options = {
		method: 'PUT',
		url : rootURL + '/coach/' + coach_id,
		headers: {'Content-Type' : 'application/json'},
		json: {
			"UserName" : req.query.UserName,
			"FirstName" : req.query.FirstName,
			"LastName" : req.query.LastName,
			"TeamName" : req.query.TeamName,
			"Password" : req.query.Password
		}
	};
	
	//make request
	request(options, function(error, response, body){
		
		
		console.log(body);
	});
	
	//back to coaches table
	res.redirect('/viewCoaches');
});



app.get('/addCoach', function(req, res) {
	
	var obj = {};
	
	console.log("Coach Add!");
	
	var origURL = req.originalUrl;
	
	console.log(origURL);
	

	
	var options = {
		method: 'POST',
		url : rootURL + '/coach',
		headers: {'Content-Type' : 'application/json'},
		json: {
			"UserName" : req.query.UserName,
			"FirstName" : req.query.FirstName,
			"LastName" : req.query.LastName,
			"TeamName" : req.query.TeamName,
			"Password" : req.query.Password
		}
	};
	
	request(options, function(error, response, body){
		
		
		console.log(body);
	});
	
	
	
	res.redirect('/viewCoaches');
});

//open draft Distance page
app.get('/draftDist', function(req, res) {
	
	//create context object
	var obj = {};
	
	//render draft Dist
	res.render('draftDist', obj);

});

//when Get Info is clicked
app.get('/getDraft', function(req, res) {
	
	
	
	console.log(req.originalUrl);
	
	var myLatLong = req.query.myLatLong;
	
	console.log(myLatLong);
	
	//set LatLong of the draft location
	var draftLatLong = '30.25,-97.75'; //Austin Draft
	//var draftLatLong = '41.921542,-87.702482'; //Chicago Draft
	
	//get myKey
	var myKey = 'AIzaSyBp8lIReveKnqn9vVuxHslFpJxv0Fj0stg';
	
	//build key for the directions API
	var dirString = 'https://maps.googleapis.com/maps/api/directions/json?'
	dirString += 'origin=' + myLatLong;
	dirString += '&destination=' + draftLatLong;
	dirString += '&key=' + myKey;

	//make API request
	request.post(dirString, function(error, response, body){
		
		//set body to obj
		var obj = JSON.parse(body);
		
		//message to console
		console.log("------ How far are you from the draft? ------");
		console.log("Distance: " + obj.routes[0].legs[0].distance.text);
		console.log("Duration: " + obj.routes[0].legs[0].duration.text);
		console.log("Start: " + obj.routes[0].legs[0].start_address);
		console.log("End: " + obj.routes[0].legs[0].end_address);
		console.log(obj.routes[0].copyrights);
		
		var context = {};
		
		//set info to object to be rendered
		context.draft_dist = obj.routes[0].legs[0].distance.text;
		context.draft_dur = obj.routes[0].legs[0].duration.text;
		context.draft_start = obj.routes[0].legs[0].start_address;
		context.draft_end = obj.routes[0].legs[0].end_address;
		
		//render page
		res.render('draftDist', context);
	});
});

console.log("Running on 3700...")

app.listen(3700);

// // Archive---------------------------------------

// app.get('/', function(req, res) {
	
	// //create context object
	// var context = {};

	// //set up options
	// var options1 = {
		// method: 'GET',
		// url : rootURL + '/coach'
	// };
	
	// var options2 = {
		// method: 'POST',
		// url : rootURL + '/coach',
		// headers: {'Content-Type' : 'application/json'},
		// json: {
			// "UserName" : "bellban",
			// "FirstName" : "Banny",
			// "LastName" : "Bells"
		// }
	// };
	
	// request(options1, function(error, response, body){
		
		// console.log(body);
		
		
	// });
	
	// res.render('login', context);

// });