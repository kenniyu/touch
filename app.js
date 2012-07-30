
/**
 * Module dependencies.
 */

var express = require('express'),
		routes = require('./routes'),
		connect = require('connect'),
		ejs = require('ejs'),
		nowjs = require('now');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.set('view options', { layout: false });
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);

app.listen(3000, function(){
  console.log("Touch server listening on port %d in %s mode", app.address().port, app.settings.env);
});

var everyone = nowjs.initialize(app),		// everyone is initialized
		usersHash = {},
		usersCount = 1;

// when a client connects to this page
nowjs.on('connect', function() {	
	// get user data
	var user = this.user,
			clientId = user.clientId,
			username = 'user' + usersCount,
			clientCookieId = get_cookie(user.cookie),
			color = '#'+Math.floor(Math.random()*16777215).toString(16);
			
	// set user id and name
	userKey = clientId;
	console.log(color);
	userValue = {
		id: clientId,
		username: username,
		color: color,
		animationDelay: 1000
	}
	
	
	// add user to hash
	usersHash[userKey] = userValue;

	// increment user count
	usersCount++;	
	
	// broadcast join
	
	user_obj = usersHash[clientId];
	// broadcast_message(user_obj, 'join');
	
	// update everyone's client list
	updateUsersList();
});

// when a client disconnects from the page
nowjs.on('disconnect', function() {
	var clientId = this.user.clientId,
			user_obj	= usersHash[clientId];
	// broadcast_message(user_obj, 'leave');
	delete usersHash[clientId];
	// everyone_update_clients_list();
});

function updateUsersList() {
	everyone.now.updateUsersList(usersHash);
}

everyone.now.submitClick = function(clickX, clickY) {
	var clientId = this.user.clientId,
			userObj	= usersHash[clientId];
	everyone.now.showClick(clickX, clickY, userObj);
}

everyone.now.submitMove = function(moveX, moveY) {
	var clientId = this.user.clientId,
			userObj	= usersHash[clientId];
	everyone.now.showMove(moveX, moveY, userObj);
}

everyone.now.submitAnimation = function(animationInput) {
	var clientId = this.user.clientId,
			userObj	= usersHash[clientId];
	userObj.animationDelay = animationInput;
}

// encode HTML
function encodeHTML(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}

function urlify(text) {
	var urlRegex = /(https?:\/\/[^\s]+)/g;
	return text.replace(urlRegex, function(url) {
		return '<a href="' + url + '" target="_blank">' + url + '</a>';
	});
}

function get_cookie(cookieHash) {
	for (var key in cookieHash) {
		return cookieHash[key];
	}
}