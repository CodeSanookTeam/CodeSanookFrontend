// load the things we need
var express = require('express');
var app = express();
var routeConfig = require('./routeConfig');

var fs = require('fs');
var xmldoc = require('xmldoc');

var portNumber = getConfigValue("portNumber");
console.log("portNumber " + portNumber);

var configuration = getConfigValue("configuration");
var apiEndpoint =getConfigValue("apiEndpoint");

function getConfigValue(configName){
    var contents = fs.readFileSync( __dirname + '/config.xml').toString();
    var rootNode = new xmldoc.XmlDocument(contents);
    var config = rootNode.childWithAttribute("name",configName);
    if(!config){
        throw new Error("no config name " + configName);
    }
    return config.attr.value;
}

//*********************** READ MORE ******************************//
//https://scotch.io/tutorials/use-ejs-to-template-your-node-application
//https://scotch.io/tutorials/use-ejs-to-template-your-node-application
//http://robdodson.me/how-to-use-ejs-in-express/
// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file
routeConfig.registerRoute(app,
    {
        //--add new parameter to send to routeConfig.js by adding key-value-by P'Amm--
        configuration : configuration
    });

//for static js/css/img
app.use(express.static('public'));

app.listen(portNumber);
console.log(portNumber + ' is the magic port');



