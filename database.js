
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