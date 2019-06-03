/* eslint-disable no-unused-vars */
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
const https = require('https');
var slug = require('slug');
var mongo = require('mongodb')
var session = require('express-session')
var ObjectID = require('mongodb').ObjectID;

//mongodb setup source= lecture 4 slides

require('dotenv').config()

var db = null
// var url = 'mongodb://' + process.env.DB_HOST + ':' + process.env.DB_PORT 
var url = process.env.MONGODB_URI;

mongo.MongoClient.connect(url, {useNewUrlParser: true},function (err, client) {
  if (err) throw err
  db = client.db(process.env.DB_NAME)
})


// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//set static path

app.use(express.static(path.join(__dirname, 'static')));
app.use('/static', express.static('static'));

// sessions setup

app.use(session({
    name: 'Nate_Session',
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET
})).listen(process.env.PORT)

//Forms
app.use(bodyParser.urlencoded({extended: true}))
app.post('/', Login)
app.post('/registration', reg1)
app.post('/registration2', reg2)
app.post('/interests', reg3)
app.post('/avatar', avatarSelect)
app.post('/avataredit', avatarEdit)
app.post('/logout', destroy)
app.post('/profile', change)

// routes
app.get('/', function(req, res){
    res.render('index.ejs');
});

app.get('/registration', function(req, res){
    res.render('registration.ejs');
});

app.get('/registration2', function(req, res){
    if (!req.session.name) {
        res.redirect('/notLoggedIn')
    }
    res.render('registration2.ejs', {formName: formName, req: req});
});

app.get('/interests', function(req, res){
    if (!req.session.name) {
        res.redirect('/notLoggedIn')
    }
    res.render('interests.ejs');
});

app.get('/avatar', function(req, res, avatarSelect){
    if (!req.session.name) {
        res.redirect('/notLoggedIn')
    }
    res.render('avatar.ejs', {totalAvatarChoices: totalAvatarChoices} );
});

app.get('/avataredit', function(req, res, avatarSelect){
    if (!req.session.user) {
        res.redirect('/notLoggedIn')
    }
    res.render('avataredit.ejs', {totalAvatarChoices: totalAvatarChoices} );
});

app.get('/completion', function(req, res){
    if (!req.session.name) {
        res.redirect('/notLoggedIn')
    }
    res.render('completion.ejs');
});

app.get('/matches', async function(req, res){
    fullProfile = await db.collection('reg1').find({email: req.session.user}).toArray()
        console.log(fullProfile)
    if (!req.session.user) {
        res.redirect('/notLoggedIn')
    }
    res.render('matches.ejs');
});

app.get('/matchprofile', function(req, res){
    if (!req.session.user) {
        res.redirect('/notLoggedIn')
    }
    res.render('matchprofile.ejs');
});

app.get('/chat', function(req, res){
    if (!req.session.user) {
        res.redirect('/notLoggedIn')
    }
    res.render('chat.ejs');
});

app.get('/request', function(req, res){
    if (!req.session.user) {
        res.redirect('/notLoggedIn')
    }
    res.render('request.ejs');
});

app.get('/requestsend', function(req, res){
    if (!req.session.user) {
        res.redirect('/notLoggedIn')
    }
    res.render('requestsend.ejs');
});

app.get('/matchafter', function(req, res){
    if (!req.session.user) {
        res.redirect('/notLoggedIn')
    }
    res.render('matchafter.ejs');
});

app.get('/chataccept', function(req, res){
    if (!req.session.user) {
        res.redirect('/notLoggedIn')
    }
    res.render('chataccept.ejs');
});

app.get('/filter', function(req, res){
    if (!req.session.user) {
        res.redirect('/notLoggedIn')
    }
    res.render('filter.ejs');
});

app.get('/chatlist', function(req, res){
    if (!req.session.user) {
        res.redirect('/notLoggedIn')
    }
    res.render('chatlist.ejs');
});

app.get('/profile', async function(req, res){
    if (!req.session.user) {
        res.redirect('/notLoggedIn')
    }
    console.log(fullProfile[0])
    fullProfile = await db.collection('reg1').find({email: req.session.email}).toArray()
    res.render('profile.ejs', {fullProfile: fullProfile, req, res});
});

app.get('/notloggedin', function(req, res){
    res.render('notLoggedIn.ejs',);
});

app.get('/logout', function(req, res){
    res.render('logout.ejs',);
});

// Variables used in the registration process

var formName = []
var avatarChoice1 = []
var avatarChoice2 = []
var avatarChoice3 = []
var totalAvatarChoices = []
var username = []
var fullProfile = []
var description = []
var fullAvatarChoice = []
var email = []
var login = []
var user = []
var loginPass = []
var userData = []
var userEmail = []
var userPass = []

// Login & userCheck function called on the POST request from ('/') 

function Login(req, res, next) {
    db.collection('Login').insertOne({
        email: req.body.email,
        password: req.body.password
    }, userCheck)

// userCheck function checks the input data from the login form and the if statement compares it to the database data

    async function userCheck() {
        login = await db.collection('Login').find({email: req.body.email}).toArray()
        user = await db.collection('reg1').find({email: req.body.email}).toArray()
        loginPass = await db.collection('Login').find({password: req.body.password}).toArray()
        userData = await db.collection('reg1').find({password: req.body.password}).toArray()
        userEmail = user[0].email
        userPass = userData[0].password
        req.session.user = user[0].email
        req.session.email = user[0].email
        req.session.pw = userData[0].password
        if(login[0].email === userEmail && loginPass[0].password === userPass) {
            res.redirect('/matches')
        }
        if (userEmail == null){
            return res.redirect('/')
        }
    } 
}

// mongodb form insert 
// reg 1 creates the document with the data from the first registration page
// reg 2 and reg 3 add their data to the document created by reg1 so all userdata is in 1 place

function reg1(req, res, next) {
    db.collection('reg1').insertOne({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        country: req.body.country,
        postal: req.body.postal,
        phone: req.body.phone
    }, done)

    async function done(err) {
        if (err) {
        next(err)
        } else {
        formName = req.body.name
        req.session.name = formName
        email = req.body.email
        req.session.email = email
        console.log(formName)
        res.redirect('/registration2')
        }
  }
}

function reg2(req, res, next) {
    console.log(formName)
    db.collection('reg1').updateOne(
        {name: formName },
        {$set: {
            profileimg: req.body.profileimg,
             description: req.body.description,
            }}, done)

    function done(err) {
        if (err) {
        next(err)
        } else {
        res.redirect('/interests')
        }
  }
}

// reg 3 adds the traits from the user to the database
// the avatarchoice 1, 2 and 3 get the matching trait data from the avatars and totalAvatarChoices concats them to 1 array

function reg3(req, res, next) {
    console.log(formName)
    db.collection('reg1').updateOne(
        {name: formName },
        {$set: {
        username: req.body.username,
        age: req.body.age,
        preference: req.body.preference,
        genre: req.body.genre,
        trait1: req.body.trait1,
        trait2: req.body.trait2,
        trait3: req.body.trait3,
    }}, done)

    async function done(err) {
        if (err) {
        next(err)
        } else {
        avatarChoice1 = await db.collection('avatars').find({trait1: req.body.trait1}).toArray()
        avatarChoice2 = await db.collection('avatars').find({trait2: req.body.trait2}).toArray()
        avatarChoice3 = await db.collection('avatars').find({trait3: req.body.trait3}).toArray()
        totalAvatarChoices = avatarChoice1.concat(avatarChoice2, avatarChoice3);
        username = req.body.username;
        res.redirect('/avatar')
        }
  }
}

// change is essentially the same function as reg3 however it updates specific data on the input of the user from profile

function change(req, res, next) {
    console.log(fullProfile[0])
    db.collection('reg1').updateOne(
        {name: fullProfile[0].name },
        {$set: {
        description: req.body.description,
        genre: req.body.genre,
        trait1: req.body.trait1,
        trait2: req.body.trait2,
        trait3: req.body.trait3,
    }}, done)

    async function done(err) {
        if (err) {
        next(err)
        } else {
        avatarChoice1 = await db.collection('avatars').find({trait1: req.body.trait1}).toArray()
        avatarChoice2 = await db.collection('avatars').find({trait2: req.body.trait2}).toArray()
        avatarChoice3 = await db.collection('avatars').find({trait3: req.body.trait3}).toArray()
        totalAvatarChoices = avatarChoice1.concat(avatarChoice2, avatarChoice3);
        // req.session.user = fullProfile[0]
        res.redirect('/avataredit')
        }
  }
}

// avatarSelect and avatarEdit updates the user document with the avatar choice

function avatarSelect(req, res, next) {
    console.log(formName)
    db.collection('reg1').updateOne(
        {name: formName},
        {$set: {choice : req.body.choice}},
     done)

    async function done(err) {
        if (err) {
        next(err)
        } else {
        fullProfile = await db.collection('reg1').find({name: formName}).toArray()
        fullAvatarChoice = await db.collection('avatars').find({fullProfile}).toArray()
        req.session.user = fullProfile[0].name
        res.redirect('/completion')
        }
  }
}

var fullProfilename

function avatarEdit(req, res, next) {
    console.log(fullProfile[0])
    db.collection('reg1').updateOne(
        {name: fullProfile[0].name},
        {$set: {choice : req.body.choice}},
     done)

    async function done(err) {
        if (err) {
        next(err)
        } else {
        fullProfile = await db.collection('reg1').find({name: fullProfile[0].name}).toArray()
        fullAvatarChoice = await db.collection('avatars').find({fullProfile}).toArray()
        // req.session.user = fullProfile[0].name
        console.log(fullProfile[0].name)
        res.redirect('/profile')
        }
  }
}

//session destroy function

function destroy (req, res) {
    req.session.destroy(function(err){
    console.log('u wordt uitgelogd')
    res.redirect('/');
    }
)}

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

// app.get('/apitest', function(req, res){
//     res.render('apiTest.ejs', {data: JSON.parse(data)});
// });

// api test

// var data = '';

//     https.get('https://api.thecatapi.com/v1/images/search?size=full', (resp) => {

//     resp.on('data', (chunk) => {
//         data += chunk;
//     });

//     resp.on('end', () => {
//         // console.log(data);
//     });
    
//     }).on("error", (err) => {
//     console.log("Error: " + err.message);
// });

// express tutorial used:
// https://www.youtube.com/watch?v=gnsO8-xJ8rs&list=FLUxU78Eq_Gp1nP5koyYFm6Q&index=3&t=646s