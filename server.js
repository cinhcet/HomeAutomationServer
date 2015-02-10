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


//var data = {headerObj : [{name : "Wohnzimmer"}, {name: "Esszimmer"}], buttons : [{name:"Licht 1",topic:'light/licht1',type:"1"},{name:"Licht 2",topic:"light/licht2",type:"1"},{name:"ZettelZ",topic:"light/zettelz",type:"1"}]};
var data = {headerObj : [{name : "Wohnzimmer", buttons : [{name:"Licht 1",topic:'light/licht1',type:"1"},{name:"Licht 2",topic:"light/licht2",type:"1"},{name:"Licht 2",topic:"light/licht2",type:"1"},{name:"Licht 2",topic:"light/licht2",type:"1"},{name:"Licht 2",topic:"light/licht2",type:"1"}]},{name : "Esszimmer", buttons : [{name:"Licht 3",topic:'light/licht3',type:"1"},{name:"Licht 4",topic:"light/licht4",type:"1"}]}]};
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
		console.log(data.topic);
		client.publish(data.topic, JSON.stringify(data.payload),{retain:true});
	});
  
});
 
client.on('message', function(topic, payload, packet){
	console.log(JSON.parse(payload));
    io.sockets.emit('mqtt', {'topic': String(topic), 'payload':JSON.parse(payload)});   
});


expressServer.listen(8080);
console.log('8080 is the Port');