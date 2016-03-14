//Gunnar Martin
//CS496
//Winter 2016
//Final Project: FFBM

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

//initiate session
var session = require('express-session');
app.use(session({secret:'Pockets1'}));

//initiate handlebars
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

var rootURL = 'http://localhost:3600'
//var rootURL = 'http://52.88.255.17:3600'

//root//
app.get('/', function(req, res) {
	
	//clear error status
	req.session.errStatus = false;
	
	//if not logged in...
	var loggedIn = req.session.loggedIn | 0;
	if(loggedIn == 0){ 
	
		//goto login
		res.redirect('/login');
	} else {
	
		//go to main menu
		res.redirect('/menu');
	}
});

//menu//
app.get('/menu', function(req, res) {
	
	//create context object
	var context = {};
	
	//set UserName and error status
	context.loginUserName = req.session.loginUserName;
	context.errStatus = req.session.errStatus;
	
	//get my coach object
	var getURL = rootURL + '/coach/' + req.session.UserObj._id;
	var options = { method: 'GET', url : getURL	};

	//Update the UserObj and go to 2
	request(options, function(error, response, body){
		
		//reset user info
		var obj = JSON.parse(body);
		context.UserObj = obj;
		
		//render the menu
		res.render('menu',context);
	});	
});

//logout//
app.get('/logout', function(req, res) {

	//clear user and error status
	req.session.errStatus = false;
	req.session.loginUserName = false;
	req.session.loggedIn = 0;
	req.session.UserObj = false;
	
	//go to login
	res.redirect('/login');
});

//login//
app.get('/login', function(req, res) {
	
	//set error status
	var context = {};
	context.errStatus = req.session.errStatus;

	//render page
	res.render('login', context);
});

//checkLogin//
app.get('/checkLogin', function(req, res) {
	
	console.log("checking login...");
	
	//get the input UserName as password
	var inputUserName = req.query.UserName;
	var inputPassword = req.query.Password;
	
	console.log("Input PW:" + inputPassword);
	
	//set options for search
	var options = { 
		method: 'GET',	
		url : rootURL + '/coach_by_username/' + inputUserName
	};
	
	//Find this user in the database
	request(options, function(error, response, body){
		
		//set obj to the body
		var obj = JSON.parse(body);
		
		console.log(obj);
		
		//if username is not found...
		if(!obj){
			
			//set error status and message console
			console.log("User was not found: " + inputUserName);
			req.session.errStatus = "UserName not found.";
			
			//go back to login
			res.redirect('/login');
			
		//If UserName was found...
		} else{
			
			console.log("user was found.");
			
			//set login user and pw
			var foundUserName = obj.UserName;
			var foundPassword = obj.Password;
			var foundID = obj._id;
			
			
			//message console
			console.log("Found User: " + foundUserName);
			console.log("Found Password: [" + foundPassword + "]");
			console.log("Found ID: " + foundID);
			
			console.log("Input PW: [" + inputPassword + "]");
			
			
			
			
			//if password is correct
			if(inputPassword == foundPassword){
				
				//message console
				console.log("Password is correct.");
				
				//set error status and UserName
				req.session.errStatus = false;
				req.session.loginUserName = foundUserName;
				req.session.UserID = foundID;
				req.session.loggedIn = 1;
				req.session.UserObj = obj;
				
				//go to main menu
				res.redirect('/menu');
			
			//password is wrong
			} else {
				
				//set error status and clear UserName
				req.session.errStatus = "UserName and Password do not match.";
				
				//go back to login
				res.redirect('/login');
			}
		}
	});
});

//viewCoaches//
app.get('/viewCoaches', function(req, res) {
	
	//create context object
	var context = {};

	//Get coaches
	var options = { method: 'GET',	url : rootURL + '/coach' };
	request(options, function(error, response, body){
		
		//set dArray to the body
		var dArray = JSON.parse(body);
		
		//load up the object
		context.dArray = dArray;
		context.loginUserName = req.session.loginUserName;
		
		//render coaches
		res.render('coaches', context);
	});
});

//viewPlayers//
app.get('/viewPlayers', function(req, res) {
	
	//create context object
	var context = {};

	//Get players
	var options = { method: 'GET',	url : rootURL + '/player' };
	request(options, function(error, response, body){
		
		//set dArray to the body
		var dArray = JSON.parse(body);
		
		//load up the object
		context.dArray = dArray;
		context.loginUserName = req.session.loginUserName;
		
		//render players
		res.render('players', context);
	});
});

//viewOnePlayer//
app.get('/viewOnePlayer', function(req, res) {
	
	//create context object
	var context = {};
	
	//establish context
	var fArray = ["player_id","FirstName","LastName","Pos","Team","ProjPts","Cost"]
	
	//fill context
	for(var i=0; i < fArray.length; i++) context[fArray[i]] = req.query[fArray[i]];
	context.loginUserName = req.session.loginUserName;
	
	//build URL
	var getURL = rootURL + '/players_coach/' + req.query.player_id;

	//Build options
	var options = { 
		method: 'GET',	
		url : getURL  
	};

	//Find his coach
	request(options, function(error, response, body){
		
		//set dArray to the body
		var obj = JSON.parse(body);
		
		//If no coach
		if(!obj){
			
			//render without coach
			context.coach = null;
			
			//res.render('onePlayer',context);
			console.log("No coach!");
		
		//if there is a coach
		} else {
			
			//set context.coach to object
			context.coach = obj;
		}
		
		//set user ID
		context.UserID = req.session.UserID
		
		//render players
		res.render('onePlayer',context);
	});
});

//addOnePlayer//
app.get('/addOnePlayer', function(req, res) {
	
	
	console.log("add a player");
	
	var origURL = req.originalUrl;
	
	console.log(origURL);
	
	var player_id = req.query.player_id;
	var coach_id = req.query.coach_id;
	
	
	var options = {
		method: 'POST',
		url : rootURL + '/coach/' + coach_id,
		headers: {'Content-Type' : 'application/json'},
		json: {
			"_id" : player_id
		}
	};
	
	request(options, function(error, response, body){
		
		
		console.log(body);
	});
	
	req.session.errStatus = "Player has been added.";
	
	res.redirect('/menu');
});

//viewMyTeam//
app.get('/viewMyTeam', function(req, res) {
	
	//create context object and get coach ID
	var context = {};
	var coach_id = req.query.coach_id;
	context.FirstName = req.query.FirstName;
	context.LastName = req.query.LastName;
	context.TeamName = req.query.TeamName;
	context.loginUserName = req.session.loginUserName;
	
	console.log("Req ID:" + coach_id);
	
	console.log("My ID:" + req.session.UserObj._id);
	
	//set context of isMyTeam
	if(coach_id == req.session.UserObj._id){
		
		console.log("It is my team!");
		context.isMyTeam = true;
	} else {
		console.log("Not my team");
		context.isMyTeam = false;
	}

	//get my coach object
	var getURL = rootURL + '/coach/' + coach_id;
	var options = { method: 'GET', url : getURL	};

	//Update the UserObj and go to 2
	request(options, function(error, response, body){
		
		//set obj to body
		var obj = JSON.parse(body);
		
		//if this coach has players
		if(obj.Players.length > 0){
		
			//establish string for parameters
			var pStr = "";
			
			//loop thru players to build param string
			for(var i=0; i < obj.Players.length; i++){
			
				//if not the first element...
				if(i>0) pStr +=","; //add a comma
				
				//add this player ID
				pStr += obj.Players[i];
			}
			
			//get my coach object
			var getURL = rootURL + '/players/' + pStr;
			var options = { method: 'GET', url : getURL	};

			//Update the UserObj and go to 2
			request(options, function(error, response, body){
				
				//update object
				obj = JSON.parse(body);
				
				//set context
				context.Players = obj;
				context.errStatus = req.session.errStatus;
				
				//Render Page
				res.render('myTeam',context);
			});
			
		//coach has no players
		} else {
			
			//set context
			context.Players = false;
			context.errStatus = "This team has no players.";
			
			//Render Page
			res.render('myTeam',context);
		}
	});
});

//removePlayer//
app.get('/removePlayer', function(req, res) {
	
	//get player id
	var player_id = req.query.player_id;
	
	console.log("Removing player: " + player_id);

	//Delete this player
	var options = { 
		method: 'DELETE',
		url : rootURL + '/remove_player/' + player_id,
		headers: {'Content-Type' : 'application/json'}
	};
	
	console.log(options);
	
	//res.redirect('/viewMyTeam');
	
	request(options, function(error, response, body){
		
		//send rsponse to console
		console.log(body);
		
		//redirect to myTeam
		req.session.errStatus = "Player has been removed.";
		res.redirect('/menu');
	});
	
});

//deleteCoach//
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
		req.session.loginUserName = false;
		req.session.errStatus = "Account has been removed.";
		res.redirect('/login');
	});
});

//addCoachLoad//
app.get('/addCoachLoad', function(req, res) {
	
	//render the addCoach page
	var obj = {};
	res.render('addCoach', obj);
});

//addCoach//
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
			"Password" : req.query.Password,
			"Players" : []
		}
	};
	
	request(options, function(error, response, body){
		
		
		console.log(body);
	});
	
	
	
	res.redirect('/');
});

//editCoachLoad//
app.get('/editCoachLoad', function(req, res) {
	
	console.log(req.originalUrl);
	
	//get coach id
	var coach_id = req.query.coach_id;
	var context  = {};
	
	console.log(coach_id);
	
	//set options
	var options = { 
		method: 'GET',	
		url : rootURL + '/coach/' + coach_id
	};
	
	//Get this coach
	request(options, function(error, response, body){
		
		//set context to the body
		var context = JSON.parse(body);
		context.loginUserName = req.session.loginUserName;
		
		//render edit coach
		res.render('editCoach', context);
	});
});

//editCoach//
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
	req.session.errStatus = "Changes have been saved.";
	res.redirect('/menu');
	
});

//draftDistLoad//
app.get('/draftDistLoad', function(req, res) {
	
	//create context object
	var context = {};
	context.loginUserName = req.session.loginUserName;
	
	//render draft Dist
	res.render('draftDist', context);

});

//draftDist//
app.get('/draftDist', function(req, res) {
	
	
	
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
		
		//get user name
		context.loginUserName = req.session.loginUserName;
		
		//render page
		res.render('draftDist', context);
	});
});

//listen
console.log("Running on 3700...")
app.listen(3700);