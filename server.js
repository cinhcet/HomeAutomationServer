//server.js

/**
This is the server. Add important things to mentioned here.
**/
var mqtt = require('mqtt');
var path = require("path");
var express = require('express');
var expressServer = express();

var server = require('http').Server(expressServer);
var io = require('socket.io')(server);

server.listen(8300);

var client = mqtt.connect('mqtt://localhost:1883',{clientId:'Hans'});

//set EJS as rendering-engine
expressServer.set('view engine', 'ejs');

expressServer.use('/node_modules', express.static(path.join(__dirname, '/node_modules')));


var data = {headerObj : [{name : "Wohnzimmer"}, {name: "Esszimmer"}], buttons : [{name:"Licht 1",topic:'light/licht1'},{name:"Licht 2",topic:"light/licht2"},{name:"ZettelZ",topic:"light/zettelz"}]};

//index routing
expressServer.get('/', function(req, res) {
    res.render('index',data);
});

io.on('connection', function (socket) {
  var clientbb = socket.handshake.address;
  console.log("New connection from " + clientbb.address + ":" + clientbb.port);
  socket.on('subscribe', function (data) {
    console.log('Subscribing to '+data.topic);
    //socket.join(data.topic);
    client.subscribe(data.topic);
  });

	socket.on('publish', function(data) {
		client.publish(data.topic, data.payload);
	});
  
});
 
client.on('message', function(topic, payload, packet){
	console.log(JSON.parse(payload));
    io.sockets.emit('mqtt', {'topic': String(topic), 'payload':JSON.parse(payload)});   
});


expressServer.listen(8080);
console.log('8080 is the Port');