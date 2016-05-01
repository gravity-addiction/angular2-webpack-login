'use strict';

var express         = require('express'),
    _q              = require('q'),
    jwt             = require('jsonwebtoken'),
    passwd          = require('./crypto-pbkdf2'),
    async           = require('async')
;


var app = module.exports = express.Router();

var attempts = [];
var users = [];

// Creates new users
app.post('/users/create', function(req, res) {

  var userScheme = getUserScheme(req);
  var user = req.body;

  if (!userScheme.username || !user.password) {
    return res.status(400).send("You must send the username and the password");
  }

  users.push(user);

  var idToken = prepareTokenResponse(user, userScheme.remember);

  res.status(201).send({ id_token: idToken });

  console.log(users);

});


// Authenticate Against to create session auth
app.post('/sessions/create', function(req, res) {

  var userScheme = getUserScheme(req);
  var ip = getIp(req);

  if (!userScheme.username || !req.body.password) {
    return res.status(400).send("You must send the username and the password");
  }

  var user = attemptLogin(userScheme, req.body.password);

  if (user) {
    var idToken = prepareTokenResponse(user, userScheme.remember);
    res.status(201).send({ id_token: idToken });
  } else {
    res.status(401).send({message:"The username or password don't match"});
  }

});


// Signs Token with user data and expiration date
function createToken(user, expires) {
  console.log(process.env.cookie_secret);
  return jwt.sign(user, process.env.cookie_secret, { expiresIn: expires });
}


// Parses user information out of form submit
function getUserScheme(req) {

  var username;
  var type;
  var remember = false;
  var userSearch = {};

  // The POST contains a username and not an email
  if(req.body.username) {
    username = req.body.username;
    type = 'username';
    userSearch = { username: username };
  }
  // The POST contains an email and not an username
  else if(req.body.email) {
    username = req.body.email;
    type = 'email';
    userSearch = { email: username };
  }

  if (req.body.remember) {
    remember = !!req.body.remember;
  }

  return {
    username: username,
    type: type,
    userSearch: userSearch,
    remember: remember
  }
}


// fetch IP based off header or connection data
function getIp(req) {
  return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
}


function prepareTokenResponse(user, remember) {
  var expires = parseConfigDuration(process.env.cookie_forget);

  if(remember === true) {
    expires = parseConfigDuration(process.env.cookie_remember);
  }

  return createToken(user, expires);
}


// attempts to login user based on posted information
// Checks Submitted information against database
function attemptLogin(userScheme, password) {

  var userLen = 0;

  userLen = users.length;
  for (var u=0; u<userLen; u++) {
    console.log('My User');
    console.log('1', userScheme.type);
    console.log('2', userScheme.username);
    console.log('3', users[u].username);
    console.log('4', users[u].password);
    console.log('5', password);
    console.log(users[u]);
    if (userScheme.type === 'username' && users[u].username === userScheme.username && users[u].password === password) return users[u];
    else if (userScheme.type === 'email' && users[u].email === userScheme.username && users[u].password === password) return users[u];
  }
  return 0;
}

function parseConfigDuration(timeString) {
  if (!timeString) { return 0; }

  var parsed;
  try { parsed = /([\+-])([\d]+) ([\w]+)$/gi.exec(timeString); } catch(e) { }
  if (parsed.length !== 4) { return 0; }

  var multiply = 0;
  var duration = 0;

  try { var interval = parsed[3].toLowerCase(); } catch(e) { return 0; }
  if (interval === 'minutes' || interval === 'minute' || interval === 'min' || interval === 'm') {multiply = 60;
  } else if (interval === 'hours' || interval === 'hour' || interval === 'hr' || interval === 'h') { multiply = 60 * 60;
  } else if (interval === 'days' || interval === 'day' || interval === 'd') { multiply = 60 * 60 * 24;
  } else if (interval === 'weeks' || interval === 'week' || interval === 'w') { multiply = 60 * 60 * 24 * 7; }

  try { duration = parseInt(parsed[2]); } catch(e) { return 0; }

  if (parsed[1] === '-') {
    return -duration * multiply;
  } else { return duration * multiply; }
}
