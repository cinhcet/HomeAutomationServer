//server.js

/**
This is the server. Add important things to mentioned here.
**/
var path = require("path");
var express = require('express');
var expressServer = express();

//set EJS as rendering-engine
expressServer.set('view engine', 'ejs');

expressServer.use('/node_modules', express.static(path.join(__dirname, '/node_modules')));


var data = {headerObj : [{name : "Wohnzimmer"}, {name: "Esszimmer"}], buttons : [{name:"Licht 1"},{name:"Licht 2"},{name:"ZettelZ"}]};

//index routing
expressServer.get('/', function(req, res) {
    res.render('index',data);
});


expressServer.listen(8080);
console.log('8080 is the Port');