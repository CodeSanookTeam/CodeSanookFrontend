// load the things we need
var express = require('express');
var app = express();

var fs = require('fs');
var xmldoc = require('xmldoc');

var contents = fs.readFileSync( __dirname + '/config.xml').toString();
console.log(contents)

var rootNode = new xmldoc.XmlDocument(contents);
var portNumber = rootNode.childWithAttribute("name","portNumber").attr.value; 
console.log("portNumber " + portNumber);

var configuration = rootNode.childWithAttribute("name","configuration").attr.value;


//*********************** READ MORE ******************************//
//https://scotch.io/tutorials/use-ejs-to-template-your-node-application
//https://scotch.io/tutorials/use-ejs-to-template-your-node-application
//http://robdodson.me/how-to-use-ejs-in-express/
// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

// index page
app.get('/', function(req, res) {
    var model = {configuration : configuration};
    res.render('pages/home',model );
});

//read more about path params
app.get('/hello/:name', function(req, res) {
    var model = {name : req.params.name};
    res.render('pages/hello',model );
});

app.get('/about', function(req, res) {
    res.render('pages/about');
});

//for static js/css/img
app.use(express.static('public'));

app.listen(portNumber);
console.log(portNumber + ' is the magic port');



//without express js
//var http = require('http');
////We need a function which handles requests and send response
//function handleRequest(request, response){
//    response.end('<h1> For Sci and You configuration = ' + configuration + ' </h1><iframe width="853" height="480" src="https://www.youtube.com/embed/Xd_whS596q0??autoplay=1" frameborder="0" allowfullscreen></iframe>');
//}
//
//
////Create a server
//var server = http.createServer(handleRequest);
//
////Lets start our server
//server.listen(portNumber, function(){
//    //Callback triggered when server is successfully listening. Hurray!
//    console.log("Server listening on: http://localhost:%s", portNumber);
//});



