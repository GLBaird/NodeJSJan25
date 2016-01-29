// load NodeJS Modules
var express    = require("express");
var path       = require("path");
var morgan     = require("morgan");
var fs         = require("fs");
var repl       = require("repl");
var bodyParser = require("body-parser");

// load local modules
var app         = express();
var routes      = require("./routes");
var routesAbout = require("./routes/about");

// setup log stream for morgan
// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(__dirname + '/access.log', {flags: 'a'});

// setup app
app.use(express.static("public"));
app.use("/lib/bootstrap", express.static("node_modules/bootstrap/dist"));
app.use("/lib/jquery", express.static("node_modules/jquery/dist"));
app.use(morgan('combined', {stream: accessLogStream}));
app.set("view engine", "jade");
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// define repl obkect
var serverREPL;

// store every request coming in, so can inspect in case of error
app.all("*", function(req, res, next) {
    serverREPL.context.lastRequest = req;
    next();
});

// handle routes
app.use("/", routes);
app.use("/about", routesAbout);
app.get("*", function(req, res) {
    console.log("Illegal route received");
    res.send("Ilegal route: "+req.url);
});

// get port number from either environment or start command ARGV
var key = process.argv[2];
var value = parseInt(process.argv[3]);
var portnumber = process.env.PORT || 3000;

if (key === "-port"
    && !isNaN(value)
    && value >= 1000) {
    portnumber = value;
} else if (typeof key != "undefined") {
    console.log("Invalid port number!");
}


// setup REPL
serverREPL = repl.start({
    prompt: "NODE =>  "
});
serverREPL.context.app = app;
serverREPL.context.lastRequest = null;
serverREPL.context.portNumber = portnumber;


// start server
app.listen(portnumber);
console.log("Server running on localhost:"+portnumber);

