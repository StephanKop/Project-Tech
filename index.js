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
var url = 'mongodb://' + process.env.DB_HOST + ':' + process.env.DB_PORT 

mongo.MongoClient.connect(url, function (err, client) {
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

// sessions

app.use(session({
    name: 'Nate_Session',
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET
})).listen(3000)

//Forms
app.use(bodyParser.urlencoded({extended: true}))
app.post('/', Login)
app.post('/registration', reg1)
app.post('/registration2', reg2)
app.post('/interests', reg3)
app.post('/avatar', avatarSelect)
app.post('/logout', destroy)

// routes
app.get('/', function(req, res){
    res.render('index.ejs');
});

app.get('/registration', function(req, res){
    res.render('registration.ejs');
});

app.get('/registration2', function(req, res){
    res.render('registration2.ejs', {formName: formName, req: req});
});

app.get('/interests', function(req, res){
    res.render('interests.ejs');
});

app.get('/avatar', async function(req, res){
    res.render('avatar.ejs', {totalAvatarChoices: totalAvatarChoices} );
});

app.get('/completion', function(req, res){
    res.render('completion.ejs');
});

app.get('/matches', async function(req, res){
    fullProfile = await db.collection('reg1').find({email: req.session.user}).toArray()
        console.log(req.session.user)
    if (!req.session.user) {
        res.render('notLoggedIn.ejs')
    }
    res.render('matches.ejs');
});

app.get('/matchprofile', function(req, res){
    if (!req.session.user) {
        res.render('notLoggedIn.ejs')
    }
    res.render('matchprofile.ejs');
});

app.get('/chat', function(req, res){
    if (!req.session.user) {
        res.render('notLoggedIn.ejs')
    }
    res.render('chat.ejs');
});

app.get('/request', function(req, res){
    if (!req.session.user) {
        res.render('notLoggedIn.ejs')
    }
    res.render('request.ejs');
});

app.get('/requestsend', function(req, res){
    if (!req.session.user) {
        res.render('notLoggedIn.ejs')
    }
    res.render('requestsend.ejs');
});

app.get('/matchafter', function(req, res){
    if (!req.session.user) {
        res.render('notLoggedIn.ejs')
    }
    res.render('matchafter.ejs');
});

app.get('/chataccept', function(req, res){
    if (!req.session.user) {
        res.render('notLoggedIn.ejs')
    }
    res.render('chataccept.ejs');
});

app.get('/filter', function(req, res){
    if (!req.session.user) {
        res.render('notLoggedIn.ejs')
    }
    res.render('filter.ejs');
});

app.get('/chatlist', function(req, res){
    if (!req.session.user) {
        res.render('notLoggedIn.ejs')
    }
    res.render('chatlist.ejs');
});

app.get('/profile', function(req, res){
    if (!req.session.user) {
        res.render('notLoggedIn.ejs')
    }
    res.render('profile.ejs', {fullProfile: fullProfile, description: description, req, res});
});

app.get('/notloggedin', function(req, res){
    res.render('notLoggedIn.ejs',);
});

app.get('/logout', function(req, res){
    res.render('logout.ejs',);
});

function check(req, res) {
    if (!req.session.user) {
        return res.status(401).send();
    }
    else {
        res.redirect('/matches')
    }
}

    function destroy (req, res) {
        req.session.destroy(function(err){
        console.log('u wordt uitgelogd')
        res.redirect('/');
        }
    )}

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

// mongodb login check sessions test
// function Login(req, res, next) {
//     req.session.email = req.body.email;
//     req.session.password = req.body.password;
//     res.end('done');
// }

function Login(req, res, next) {
    db.collection('Login').insertOne({
        email: req.body.email,
        password: req.body.password
    }, userCheck)

    async function userCheck() {
        var login = await db.collection('Login').find({email: req.body.email}).toArray()
        var user = await db.collection('reg1').find({email: req.body.email}).toArray()
        var loginPass = await db.collection('Login').find({password: req.body.password}).toArray()
        var userData = await db.collection('reg1').find({password: req.body.password}).toArray()
        var userEmail = user[0].email
        var userPass = userData[0].password
        req.session.user = user[0].email
        req.session.pw = userData[0].password
        if(login[0].email === userEmail && loginPass[0].password === userPass) {
            res.redirect('/matches')
        }
        if (userEmail == null){
            return res.redirect('/')
        }
    } 
}

var formName = []
var avatarChoice1 = []
var avatarChoice2 = []
var avatarChoice3 = []
var totalAvatarChoices = []
var username = []
var fullProfile = []
var description = []
var fullAvatarChoice = []

// mongodb form insert all in 1 collection

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
        // formName = await db.collection('reg1').find({name: req.body.name}).toArray()
        formName = req.body.name
        req.session.name = formName
        console.log(formName)
        res.redirect('/registration2')
        }
  }
}

function reg2(req, res, next) {
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
        // description = req.body.description;
        res.redirect('/interests')
        }
  }
}

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
        // reg3Data = await db.collection('reg3').find({}).toArray()
        avatarChoice1 = await db.collection('avatars').find({trait1: req.body.trait1}).toArray()
        avatarChoice2 = await db.collection('avatars').find({trait2: req.body.trait2}).toArray()
        avatarChoice3 = await db.collection('avatars').find({trait3: req.body.trait3}).toArray()
        totalAvatarChoices = avatarChoice1.concat(avatarChoice2, avatarChoice3);
        username = req.body.username;
        res.redirect('/avatar')
        }
  }
}

// function reg2(req, res, next) {
//     db.collection('reg2').insertOne({
//         profileimg: req.body.profileimg,
//         description: req.body.description,
//     }, done)

//     function done(err, registration2) {
//         if (err) {
//         next(err)
//         } else {
//         description = req.body.description;
//         res.redirect('/interests')
//         }
//   }
// }



// function reg3(req, res, next) {
//     db.collection('reg3').insertOne({
//         username: req.body.username,
//         age: req.body.age,
//         preference: req.body.preference,
//         genre: req.body.genre,
//         trait1: req.body.trait1,
//         trait2: req.body.trait2,
//         trait3: req.body.trait3,
//     }, done)

//     async function done(err) {
//         if (err) {
//         next(err)
//         } else {
//         // reg3Data = await db.collection('reg3').find({}).toArray()
//         avatarChoice1 = await db.collection('avatars').find({trait1: req.body.trait1}).toArray()
//         avatarChoice2 = await db.collection('avatars').find({trait2: req.body.trait2}).toArray()
//         avatarChoice3 = await db.collection('avatars').find({trait3: req.body.trait3}).toArray()
//         totalAvatarChoices = avatarChoice1.concat(avatarChoice2, avatarChoice3);
//         username = req.body.username;
//         res.redirect('/avatar')
//         }
//   }
// }

function avatarSelect(req, res, next) {
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
        req.session.user = fullProfile[0]
        console.log(fullProfile)
        res.redirect('/completion')
        }
  }
}

var dataFromReg1 = []
var dataFromReg2 = []
var dataFromReg3 = []
var dataFromRegs = []

// async function getUserData(req,res){
//     fullProfile = await db.collection('reg1').find({email: req.body.email}).toArray()
//     console.log(fullProfile[0])
// }



// async function getName(req, res, next) {
//     var formName = await db.collection('reg1').find({name: 'john'}).toArray();
//     console.log(formName[0].name);
// }


// function reg1(req, res) {
//     var id = slug(req.body.name).toLowerCase()
//     // var form = [];
  
//     form.push({
//       id: id,
//       name: req.body.name,
//       country: req.body.country,
//       postal: req.body.postal,
//       phone: req.body.phone
//     })
    
//     console.log(form[0].name);
//     // res.redirect('/registration' + id)
//     res.redirect('/registration2')
//   }

//   function reg2(req, res) {
//     var id = slug(req.body.username).toLowerCase()
//     var registration2 = [];
  
//     registration2.push({
//       id: id,
//       username: req.body.username,
//       profileimg: req.body.profileimg,
//       description: req.body.description,
//     })
    
//     console.log(registration2);
//     // res.redirect('/registration' + id)
//     res.redirect('/interests')
//   }

//   function reg3(req, res) {
//     var id = slug(req.body.age).toLowerCase()
//     var registration3 = [];
  
//     registration3.push({
//       id: id,
//       age: req.body.age,
//       preference: req.body.preference,
//       movie: req.body.movie,
//       genre: req.body.genre,
//     })
    
//     console.log(registration3);
//     // res.redirect('/registration' + id)
//     res.redirect('/avatar')
//   }

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

// express tutorial used:
// https://www.youtube.com/watch?v=gnsO8-xJ8rs&list=FLUxU78Eq_Gp1nP5koyYFm6Q&index=3&t=646s