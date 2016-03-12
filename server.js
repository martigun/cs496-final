

var express = require('express'); // Express web server framework

var app = express();

app.use(express.static(__dirname));


app.get('/', function(req, res) {



});

console.log("Running on 3700...")

app.listen(3700);