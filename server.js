

var express = require('express'); // Express web server framework

var request = require('request'); // "Request" library

var app = express();

app.use(express.static(__dirname));


app.get('/', function(req, res) {



});

app.get('/myLoc', function(req, res) {



	res.send("Location!");


});



//var request = require('request'); // "Request" library

console.log("Running on 3700...")

app.listen(3700);