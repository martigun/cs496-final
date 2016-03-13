
//call and start the express module
var express = require('express');
var app = express();

//call and connect the mongodb
var mongojs = require('mongojs');
var db = mongojs('ffb', ['player','coach']);

//call and connect body parser
var bodyParser = require('body-parser'); 
app.use(bodyParser.json())

//http://stackoverflow.com/questions/24543847/req-body-empty-on-posts
app.use(bodyParser.urlencoded({extended: true}));

//GET for coach
app.get('/coach', function(req,res){
	
	//message console
	console.log("I received a GET request for /coach");
	
	//find all coaches
	db.coach.find(function (err,docs) {	
		//console.log(docs); //send data to the console
		res.json(docs); //sends data back
	});
});

//GET for player
app.get('/player', function(req,res){
	
	//message console
	console.log("I received a GET request for /player");
	
	//find all players
	db.player.find(function (err,docs) {	
		
		res.json(docs); //sends data back
		//res.send("here is yo data!"); //nice test
	});	
});

// //GET for player with coach
// app.get('/player_w_coach', function(req,res){
	
	// //message console
	// console.log("I received a GET request for /player_w_coach");
	
	// var myArray = [];
	
	// //find all players
	// db.player.find(function (err,docs) {	
		
		// //set nbr of players in collection
		// var nbr_of_players = docs.length;
		
		// //myArray = docs;
		
		// for(var i=0; i < 5; i++){
			
			// myArray.push(docs[i]);
			
			// //var player_id = docs[i]._id;
			
			
			// //console.log(docs[i].LastName);
			// //console.log(docs[i]._id);
			
			// // var player_id = docs[i]._id;
			
			// // var coach_was_found = findMyCoach(player_id);
			
			// // var myStr = String(coach_was_found);
			
			// // console.log("From get: " + myStr);
			
			
		// }
		

		
		
		// //res.json(docs); //sends data back
		// //console.log("Number of players: " + nbr_of_players);
		// //res.send("Number of players: " + nbr_of_players); //nice test
		
		
		
	// });	
	
	// // for(var i=0; i < 5; i++){
	
		// // var player_id = myArray[i]._id;
		
		// // myArray[i].MyCoach = findMyCoach(player_id);
	
	// // }
	
	// res.json(myArray);
	
	
// });


//GET a players coach 
function findMyCoach(player_id){
	
	//see trace statments
	var trace = 0;
	
	//get player to find from params
	var player_to_find = mongojs.ObjectId(player_id); 

	//look thru all coaches
	db.coach.find(function (err,docs){
		
		//message server
		console.log("P to find: " + player_to_find);
		
		//set nbr of coaches in collection
		var nbr_of_coaches = docs.length;
		if(trace) console.log("# of coaches: " + nbr_of_coaches);
		
		//set coachFound to zero
		var coachFound = 0;
		var coach_obj = {};
		
		//cycle thru the coaches
		for(var i=0; i < nbr_of_coaches; i++){
			
			//get coach ID and # of players for each coach
			var coach_id = docs[i]._id;
			
			var nbr_of_players = docs[i].Players.length;
			
			if(trace) console.log("C is now: " + coach_id);
			if(trace) console.log("name: " + docs[i].UserName);
			if(trace) console.log("# of players: " + nbr_of_players);
			if(trace) console.log("--------------------------");
			
			//cycle thru this coach's players
			for(var j=0; j < nbr_of_players; j++){
				
				//get player_id
				var player_id = mongojs.ObjectId(docs[i].Players[j]);
				
				if(trace) console.log("#" + j + ": " + player_id);
				
				//convert both to strings
				var p_find = String(player_to_find);
				var p_curr = String(player_id);
				
				if(trace) console.log("p_curr type is: " + typeof(p_curr));
				if(trace) console.log("p_find type is: " + typeof(p_find));
				
				//if current player matches the player to find
				if(p_curr == p_find){
					
					//set coachFound to the found coach ID
					coachFound = coach_id;
					coach_obj = docs[i];
					
					if(trace) console.log(player_id + " EQUALS " + player_to_find);
				}
			};
			if(trace) console.log("--------------------------");
		};
		
		console.log("Coach found: " + coachFound);
		//console.log("Coach name: " + coach_fname);
		
		
		
		//if coach was not found
		if(coachFound != 0){
			

			console.log("Coach FirstName: " + coach_obj.FirstName);
			console.log("Coach LastName: " + coach_obj.LastName);
			
			//return coach_fname
		
		} 
		
		return coachFound;
		
	});
	
	
	
	
	

	
	
	
};


//GET a players coach 
app.get('/players_coach/:id', function(req,res){
	
	//message server
	console.log("I received a GET request for /players_coach");
	
	//see trace statments
	var trace = 0;
	
	//get player to find from params
	var player_to_find = mongojs.ObjectId(req.params.id); 
	if(trace) console.log("P to find: " + player_to_find);
	
	//find all coaches
	db.coach.find(function (err,docs) {	
		
		//if there are no coaches
		if(docs==null){
			
			res.status(404); //set status to nothing found
			res.json(docs); //return null
		
		//if there are coaches
		} else {
			
			//set nbr of coaches in collection
			var nbr_of_coaches = docs.length;
			
			//set coachFound to zero
			var coachFound = 0;
			
			//cycle thru the coaches
			for(var i=0; i < nbr_of_coaches; i++){
				
				//get coach ID and # of players for each coach
				var coach_id = docs[i]._id;
				var nbr_of_players = docs[i].Players.length;
				
				if(trace) console.log("C is now: " + coach_id);
				if(trace) console.log("name: " + docs[i].UserName);
				if(trace) console.log("# of players: " + nbr_of_players);
				if(trace) console.log("--------------------------");
				
				//cycle thru this coach's players
				for(var j=0; j < nbr_of_players; j++){
					
					//get player_id
					var player_id = mongojs.ObjectId(docs[i].Players[j]);
					
					if(trace) console.log("#" + j + ": " + player_id);
					
					//convert both to strings
					var p_find = String(player_to_find);
					var p_curr = String(player_id);
					
					if(trace) console.log("p_curr type is: " + typeof(p_curr));
					if(trace) console.log("p_find type is: " + typeof(p_find));
					
					//if current player matches the player to find
					if(p_curr == p_find){
						
						//set coachFound to the found coach ID
						coachFound = coach_id;
						if(trace) console.log(player_id + " EQUALS " + player_to_find);
					}
				};
				if(trace) console.log("--------------------------");
			};
		};
		
		//messsage server
		console.log("Coach value found:" + coachFound);
		
		//if coach was not found
		if(coachFound == 0){
			
			//return null
			res.json(null);
		
		//if coach was found
		} else {
			
			//redirect to the coach callback
			res.redirect('/coach/' + coachFound);
		}
	});	
	
	
	
});


/*


//------------------
			db.coach.find().forEach(function(err2,docs2){
				
				//if the coach is not null...
				if(docs2!=null){
					
					//remove this player_id
					db.coach.findAndModify({ 
						query: {_id: docs2._id},
						update: {$pull: {
							Players: player_id
						}},
						new: true,
						}, function(err3,docs3){} //return nothing here
					);
				}
			});
//-------------------------------

*/

//GET for coach with id
app.get('/coach/:id', function(req,res){
	
	//set up id var using the param and convert
	var id = mongojs.ObjectId(req.params.id); 
	
	//message console
	console.log("I received a GET id request for /coach");
	
	//find this coach
	db.coach.findOne({_id:id},function (err,docs) {	
		
		//check to see if id was found
		if(docs==null){
			
			res.status(404); //set status to nothing found
			res.json(docs); //return null	
		} else {
			
			res.json(docs); //sends data back
		}
	});	
});

//GET for coach by UserName
app.get('/coach_by_username/:UserName', function(req,res){
	
	//set up id var using the param and convert
	//var id = mongojs.ObjectId(req.params.id);
	var thisUserName = req.params.UserName;
	
	//message console
	console.log("I received a GET UserName request for /coach: " + thisUserName);
	
	//find this coach
	db.coach.findOne({UserName:thisUserName},function (err,docs) {	
		
		//check to see if id was found
		if(docs==null){
			
			res.status(404); //set status to nothing found
			res.json(docs); //return null	
		} else {
			
			res.json(docs); //sends data back
		}
	});	
});

//GET for player with id
app.get('/player/:id', function(req,res){
	
	//set up id var using the param and convert
	var id = mongojs.ObjectId(req.params.id); 
	
	//message console
	console.log("I received a GET id request for /player");
	
	//find this player
	db.player.findOne({_id:id},function (err,docs) {	
		//console.log(docs); //send data to the console
		
		//check to see if id was found
		if(docs==null){
			
			res.status(404); //set status to nothing found
			res.json(docs); //return null	
		} else {
			
			res.json(docs); //sends data back
		}
	});	
});

//POST for coach
app.post('/coach', function(req,res){
	
	//get the content-type of the post
	//http://stackoverflow.com/questions/23271250/
	// express-when-to-check-content-type
	var contype = req.headers['content-type'];
	
	//if not application/json return Not Acceptable
	if (contype != 'application/json') {
		res.status(406); //406 Not Acceptable
		var s = "Not Acceptable. "
		s = s + "This API only supports application/json."
		res.send(s);
		return
	}
	
	//message console
	console.log("I received a POST for a /coach");

	//insert the new data into the db from body
	db.coach.insert(req.body, function(err, doc){
		
		//send the data back
		res.json(req.body);
	});
});

//POST for player
app.post('/player', function(req,res){
	
	//get the content-type of the post
	var contype = req.headers['content-type'];
	
	//if not application/json return Not Acceptable
	if (contype != 'application/json') {
		res.status(406); //406 Not Acceptable
		var s = "Not Acceptable. "
		s = s + "This API only supports application/json."
		res.send(s);
		return
	}
	
	//message console
	console.log("I received a POST for a /player");

	//insert the new data into the db from body
	db.player.insert(req.body, function(err, doc){
		
		//send the data back
		res.json(req.body);
	});
});

//PUT for coach info
app.put('/coach/:id', function(req,res){
	
	//get the content-type of the post
	var contype = req.headers['content-type'];
	
	//if not application/json return Not Acceptable
	if (contype != 'application/json') {
		res.status(406); //406 Not Acceptable
		var s = "Not Acceptable. "
		s = s + "This API only supports application/json."
		res.send(s);
		return
	}
	
	//set up id var using the param and convert
	var id = mongojs.ObjectId(req.params.id); 
	
	//message console
	console.log("I received a PUT for a /coach");
	
	//find and modify based on the ID
	db.coach.findAndModify({ 
		query: {_id: id},
		update: {$set: {
			UserName: req.body.UserName,
			FirstName: req.body.FirstName,
			LastName: req.body.LastName,
			TeamName: req.body.TeamName,
			TeamName: req.body.TeamName,
			Password: req.body.Password
		}},
		new: true
		}, function(err,docs){res.json(docs);}
	); 
});

//PUT for player info
app.put('/player/:id', function(req,res){
	
	//get the content-type of the post
	var contype = req.headers['content-type'];
	
	//if not application/json return Not Acceptable
	if (contype != 'application/json') {
		res.status(406); //406 Not Acceptable
		var s = "Not Acceptable. "
		s = s + "This API only supports application/json."
		res.send(s);
		return
	}
	
	//set up id var using the param and convert
	var id = mongojs.ObjectId(req.params.id); 
	
	//message console
	console.log("I received a PUT for a /player");
	
	//find and modify based on the ID
	db.player.findAndModify({ 
		query: {_id: id},
		update: {$set: {
			FirstName: req.body.FirstName,
			LastName: req.body.LastName,
			Team: req.body.Team,
			Position: req.body.Position,
			ProjectedPoints: req.body.ProjectedPoints,
			Birthdate: req.body.Birthdate,		
			Height: req.body.Height,				
			Weight: req.body.Weight	
		}},
		new: true
		}, function(err,docs){res.json(docs);}
	); 
});

//POST for coach add a player
app.post('/coach/:id', function(req,res){
	
	//get the content-type of the post
	var contype = req.headers['content-type'];
	
	//if not application/json return Not Acceptable
	if (contype != 'application/json') {
		res.status(406); //406 Not Acceptable
		var s = "Not Acceptable. "
		s = s + "This API only supports application/json."
		res.send(s);
		return
	}
	
	//set up id var using the param and convert
	var id = mongojs.ObjectId(req.params.id); 
	
	//message console
	console.log("I received a POST for a /coach to add a /player");
	
	//insert the new data into the db from body
	db.coach.findAndModify({ 
		query: {_id: id},
		update: {$addToSet: {
			Players: mongojs.ObjectId(req.body._id)
		}},
		new: true
		}, function(err,docs){res.json(docs);}
	); 
});

//DELETE a coach
app.delete('/coach/:id', function(req,res){
	
	//get the content-type of the post
	var contype = req.headers['content-type'];
	
	//if not application/json return Not Acceptable
	if (contype != 'application/json') {
		res.status(406); //406 Not Acceptable
		var s = "Not Acceptable. "
		s = s + "This API only supports application/json."
		res.send(s);
		return
	}
	
	//set up id var using the param and convert
	var id = mongojs.ObjectId(req.params.id);
	
	//message console
	console.log("I received a DELETE for a /coach");
	
	//find the coach at this ID number
	db.coach.findOne({_id:id},function (err,docs) {	
	
		//check to see if id was found
		if(docs==null){
			
			res.status(404); //set status to nothing found
			res.json(docs); //return null	
		} else {
			
			//remove the coach at this id number
			db.coach.remove({_id: id}, function(err2,docs2){
				res.json(docs2);
			})
		}	
	});	
});

//DELETE a player
app.delete('/player/:id', function(req,res){
	
	//get the content-type of the post
	var contype = req.headers['content-type'];
	
	//if not application/json return Not Acceptable
	if (contype != 'application/json') {
		res.status(406); //406 Not Acceptable
		var s = "Not Acceptable. "
		s = s + "This API only supports application/json."
		res.send(s);
		return
	}
	
	//set up id var using the param and convert
	var player_id = mongojs.ObjectId(req.params.id); 
		
	//message console
	console.log("I received a DELETE for a /player");
	
	db.player.findOne({_id:player_id},function (err,docs) {	
		//console.log(docs); //send data to the console
		
		//check to see if id was found
		if(docs==null){
			
			console.log("This player was not found.");
			res.status(404); //set status to nothing found
			res.json(docs); //return null	
		} else {
			
			//remove this player
			db.player.remove({_id: player_id}, function(err4,docs4){});
			
			//go through each coach to clean up players
			db.coach.find().forEach(function(err2,docs2){
				
				//if the coach is not null...
				if(docs2!=null){
					
					//remove this player_id
					db.coach.findAndModify({ 
						query: {_id: docs2._id},
						update: {$pull: {
							Players: player_id
						}},
						new: true,
						}, function(err3,docs3){} //return nothing here
					);
				}
			});
			
			//send done.
			res.json("Player has been removed.");
			
		}
	});	
	
});

console.log("Database running on 3600...");
app.listen(3600);