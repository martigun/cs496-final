

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


app.get('/', function(req, res) {



});

app.get('/myLoc/:myLatLong', function(req, res) {
	
	var myLatLong = req.params.myLatLong;
	var draftLatLong = '30.25,-97.75';
	var myKey = 'AIzaSyBp8lIReveKnqn9vVuxHslFpJxv0Fj0stg';
	
	console.log("myLatLong: " + myLatLong);
	
	var dirString = 'https://maps.googleapis.com/maps/api/directions/json?'
	dirString += 'origin=' + myLatLong;
	dirString += '&destination=' + draftLatLong;
	dirString += '&key=' + myKey;

	var testString = 'https://maps.googleapis.com/maps/api/directions/json?'
	+ 'origin=33.7946333,-84.44877199999999&destination=30.25,-97.75'
	+ '&key=AIzaSyBp8lIReveKnqn9vVuxHslFpJxv0Fj0stg';

	var myKey = 'AIzaSyBp8lIReveKnqn9vVuxHslFpJxv0Fj0stg';
	var qGeoString = 'https://www.googleapis.com/geolocation/v1/geolocate?key=' + myKey;

	request.post(dirString, function(error, response, body){
		
		//body.routes[0].copyrights;
		
		//var printMe = body.routes[0].copyrights;
		
		var obj = JSON.parse(body);
		
		console.log(obj.routes[0].copyrights);
		
		console.log("Distance: " + obj.routes[0].legs[0].distance.text);
		console.log("Duration: " + obj.routes[0].legs[0].duration.text);
		console.log("End: " + obj.routes[0].legs[0].end_address);
		console.log("Start: " + obj.routes[0].legs[0].start_address);
		
	})



	res.send("Location!");


});



//var request = require('request'); // "Request" library

console.log("Running on 3700...")

app.listen(3700);