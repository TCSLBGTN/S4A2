var express = require('express'),
app = module.exports.app = express();
var http = require('http');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var server = http.createServer(app);
var io = require('socket.io').listen(server);  //pass a http.Server instance


//connect to MongoDB
mongoose.connect('mongodb://35.178.252.184:27017/ForAuth',{ useNewUrlParser: true });
var db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
});

//use sessions for tracking logins
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));


// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// serve static files from template
app.use(express.static(__dirname + '/log'));
app.use(bodyParser.urlencoded({extend:true}));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views',__dirname + '/log');

// include routes
var routes = require('./routes/router');
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});


io.on('connection', function(socket) {
  socket.on('stream', function(image){
    socket.broadcast.emit('stream', image);
  });
});
// listen on port 3000
server.listen(3001, function () {
  console.log('Express app listening on port 3001');
});
