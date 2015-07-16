﻿var http = require('http');
var fs = require('fs');
var xmldoc = require('xmldoc');

var contents = fs.readFileSync( __dirname + '/config.xml').toString();
console.log(contents)

var rootNode = new xmldoc.XmlDocument(contents);
var portNumber = rootNode.childWithAttribute("name","portNumber").attr.value; 
console.log("portNumber " + portNumber);

var configuration = rootNode.childWithAttribute("name","configuration").attr.value; 

//We need a function which handles requests and send response
function handleRequest(request, response){
    response.end('<h1> เพื่อยูครับ configuration = ' + configuration + ' </h1><iframe width="853" height="480" src="https://www.youtube.com/embed/Xd_whS596q0??autoplay=1" frameborder="0" allowfullscreen></iframe>');
}


//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(portNumber, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", portNumber);
});



