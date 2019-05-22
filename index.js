var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
const https = require('https');

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//set static path

app.use(express.static(path.join(__dirname, 'static')));
app.use('/static', express.static('static'));

// routes
app.get('/', function(req, res){
    res.render('index.ejs');
});

app.get('/registration', function(req, res){
    res.render('registration.ejs');
});

app.get('/registration2', function(req, res){
    res.render('registration2.ejs');
});

app.get('/interests', function(req, res){
    res.render('interests.ejs');
});

app.get('/avatar', function(req, res){
    res.render('avatar.ejs');
});

app.get('/completion', function(req, res){
    res.render('completion.ejs');
});

app.get('/matches', function(req, res){
    res.render('matches.ejs');
});

app.get('/matchprofile', function(req, res){
    res.render('matchprofile.ejs');
});

app.get('/chat', function(req, res){
    res.render('chat.ejs');
});

app.get('/request', function(req, res){
    res.render('request.ejs');
});

app.get('/requestsend', function(req, res){
    res.render('requestsend.ejs');
});

app.get('/matchafter', function(req, res){
    res.render('matchafter.ejs');
});

app.get('/chataccept', function(req, res){
    res.render('chataccept.ejs');
});

app.get('/filter', function(req, res){
    res.render('filter.ejs');
});

app.get('/chatlist', function(req, res){
    res.render('chatlist.ejs');
});

app.get('/profile', function(req, res){
    res.render('profile.ejs');
});

app.get('/apitest', function(req, res){
    res.render('apiTest.ejs', {data: JSON.parse(data)});
});

//404

app.use(function(req,res){
    res.type('text/plain');
    res.status(404);
    res.send('404 not found');
});

app.use(function(req,res){
    res.type('text/plain');
    res.status(200);
    res.send('status ok');
});

app.listen(3000, function(){
    console.log('server started on port 3000...');
});

// api test

var data = '';

    https.get('https://api.thecatapi.com/v1/images/search?size=full', (resp) => {

    resp.on('data', (chunk) => {
        data += chunk;
    });

    resp.on('end', () => {
        console.log(data);
    });
    }).on("error", (err) => {
    console.log("Error: " + err.message);
});

// const cows = require('cows');
// console.log(cows()[15]);