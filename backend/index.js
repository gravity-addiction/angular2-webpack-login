var logger          = require('morgan'),
    async           = require('async'),
    cors            = require('cors'),
    http            = require('http'),
    https           = require('https'),
    express         = require('express'),
    errorhandler    = require('errorhandler'),
    dotenv          = require('dotenv'),
    bodyParser      = require('body-parser'),
    fs              = require('fs'),
    app             = require('express')(),
    _q              = require('q'),
    _url            = require('url')

dotenv.load();

// Parsers
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use(function(err, req, res, next) {
  if (err.name === 'StatusError') {
    res.send(err.status, err.message);
  } else {
    next(err);
  }
});

if (process.env.NODE_ENV === 'development') {
  app.use(logger('dev'));
  app.use(errorhandler())
}

// Add Module Routes
app.use(require('./modules/login/login-routes'));


// Redirect CTRL-C Stops to Exit Normally
process.on('SIGINT', function() {
  process.exit(0);
});

// Clean up from running processes
process.on("exit", function() {
  console.log("\nShutting Down SQL Connections..\n");

  // bookshelf mysql connection cleanup needs to happen here


  // mysql pool clean up
  //for (var store in db) {
  //  if (!db.hasOwnProperty(store)) continue;
  //  try { db[store].pool.end(); } catch(e) { }
  //}

  console.log("\nExiting...\n");
});




var ip = process.env.IP || '0.0.0.0';
var port = process.env.PORT || 5000;

var sslip = process.env.SSLIP || '0.0.0.0';
var sslport = process.env.SSLPORT || 3443;

if (process.env.USESSL === 1) {
  var options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
  };

  https.createServer(options, app).listen(sslport, sslip, function (err) {
    console.log('listening in https://'+sslip+':' + sslport);
  });
}

if (!process.env.USESSL || port != sslport) {
  http.createServer(app).listen(port, ip, function (err) {
    console.log('listening in http://' + ip + ':' + port);
  });
}



























// SOCKET.IO Stuff
/*
var users = {};
var users_socket = {};

io.set('origins', '*:*');
io.on('connection', function(socket){
  console.log('socket connected');

  users[socket.id] = { auth: false, host: '', id: ''};
  users_socket[socket.id] = socket;

  socket.on('getUsers', function(data) {
    socket.emit('socketReturn', {socketTag: data.socketTag, users: users});
  });

  socket.on('refreshUser', function(data) {
    console.log('refreshUser', data);
    users_socket[data.socketid].emit('refreshQuicknotes', {});
  });
  socket.on('deAuthUser', function(data) {
    console.log('deAuthUser', data);
    users_socket[data.socketid].disconnect();
    delete users[data.socketid];
    delete users_socket[data.socketid];
  })

  socket.on('disconnect', function () {
    delete users[socket.id];
    delete users_socket[socket.id];
    console.log('socket disconnected');
  });

  //require('./personnel.socket')(db, socket, users);
  //require('./quicknotes.socket')(db, socket, users);

});
*/
