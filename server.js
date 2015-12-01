// load the packages and create our app
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser'); // get body-parser
var morgan     = require('morgan'); // used to see requests
var mongoose   = require('mongoose'); // for working w/ our database
var port       = process.env.PORT || 8080;// set the port for our app”
var app=express();
var	User=require('./app/models/users');

// APP CONFIGURATION ---------------------
// use body parser so we can grab information from POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/_'));

//connect to MongoDB
// mongoose.connect('mongodb://localhost:27017/TOOLDB');

// configure our app to handle CORS requests
app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, \
	Authorization');
	next();
});

// ROUTES FOR OUR API
// =============================
// basic route for the home page
app.get('/', function(req, res) {
	// res.send('Welcome to the home page!');
	res.sendFile(__dirname+'/index.html')
});
// get an instance of the express router
var apiRouter = express.Router();
// test route to make sure everything is working 
// accessed at GET http://localhost:8080/api
apiRouter.get('/', function(req, res) {
	res.json({ message: 'hooray! welcome to our api!' });	
});

apiRouter.route('/users')
	.post(function(req,res){
		var user=new User();
		user.name=req.body.name;
		user.username=req.body.username;
		user.password=req.body.password;

		user.save(function(err) {
            if (err) {                // duplicate entry
                if (err.code == 11000) 
                    return res.json({ success: false, message: 'A user with that username already exists. '});
                else 
                    return res.send(err);
            }

			res.json({ message: 'User created!' });
		});
		
	})

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', apiRouter);

// log all requests to the console 
app.use(morgan('dev'));

// START THE SERVER
// ===============================
app.listen(port);
console.log('Magic happens on port ' + port);