var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var fs = require("fs")
var PORT = process.env.PORT || 3000;

app.get('/main', function(req, res){
    fs.readFile( __dirname + "/../data/user.json", function(error, data){
        console.log(data);
        //res.writeHead(200, {'content-type': 'text/html'});
        res.end(data);
    });
});

app.get('/img', function(req, res){
    fs.readFile('signin.jpg', function(error, data){
        res.writeHead(200, {'content-type': 'text/html'});
        res.end(data);
    });
});

app.listen(PORT, function(){
    console.log('Server start.');
});