var http = require('http');
var fs   = require('fs');
var repl = require('repl');

// setup command prompt
var prompt = repl.start({
    prompt: "Demo Server =>"
});

// add array to REPL environment for storing requests
prompt.context.requests = [];

// create new server
var server = http.createServer(function(request, response) {
    // incomeing request
    console.log("Incoming request");
    
    // check to see if user wants the icon.png file
    if (request.url.split("?")[0] == "/images/icon.png") {
        console.log("Icon Image File Requested");
        
        // load the image into buffer and log to reponse
        fs.readFile("icon.png", function(err, data) {
            if (err){
                response.statusCode = 500;
                response.setHeader("Content-Type", "text/html");
                response.write("<h1>Server Connection Established</h1>\n")
                response.write("<p>Error reading image file</p>\n");
                response.close();
                throw "** ERROR READ - error reading image "+err;
            }
            
            response.statusCode = 200;
            response.setHeader("Content-Type", "image/png");
            response.write(data);
            response.end();
        });
        
    } else {
        
        // set response
        // response.writeHead(200, { "Content-Type" : "text/html" });
        response.statusCode = 200;
        response.setHeader("Content-Type", "text/html");
        response.write("<p style='text-align:center;'><img src='images/icon.png' alt='Network icon' /></p>");
        response.write("<h1>Server Connection Established</h1>\n")
    }
    
    // look for get variables and parse into data object
    var getVariables = {};
    
    if (request.url.indexOf("?") >= 0 && request.url.indexOf("=")>=0) {
        var getArray = request.url.split("?")[1].split("&");
        for(var i in getArray) {
            if (getArray[i].indexOf("=")<0) {
                continue;
            }
            var prop  = getArray[i].split("=")[0];
            var value = decodeURIComponent(getArray[i].split("=")[1]);
            getVariables[prop] = value;
        }
    }
    
    // check for get variable as username, and set if found
    var username = "unknown";
    if (typeof getVariables.username != "undefined" && request.url.split("?")[0] != "/images/icon.png") {
        response.write("<p>Welcome to the server "+getVariables.username+".</p>");
        response.end();
    } else if (typeof getVariables.username != "undefined") {
        username = getVariables.username;
    }
    
    // create a date and update external log file to not log details
    var date = new Date();
    
    // build the string to log into the file
    var logInfo = "** Incoming Request **\n"+
                  date.toLocaleString()+"\n"+
                  "Server accessed by :"+username+"\n"+
                  "URL: "+request.url+"\n"+
                  "Request Type: "+(request.url.split("?")[0] == "/images/icon.png" ? "image/png" : "text/html")+"\n"+
                  "--- End of Request ---\n\n";
                  
    // convert string into a Buffer object for writing to disk
    var buffer = new Buffer(logInfo);
    
    // open log file in append mode, which will create file if not exists, and append data to end of file
    fs.open("requestlog.txt", "a", function(err, fd) {
        if (err) throw "** FS-ERROR "+date.toDateString()+" - There has been an error openning the log file.\n"+err;
        
        // write the Buffer to the file 
        fs.write(fd, buffer, 0, buffer.length, null, function(err) {
            
            if (err) throw "** FS-ERROR "+date.toDateString()+" - There has been an error writing to the file."+err;
            
            // close the file and log to console that logfile has updated
            fs.close(fd, function() {
                console.log("** RESPONSE LOG UPDATED **");
            });
            
        } );
        
    });
    
    // store request in REPL
    var req = {
        date: date,
        username: username,
        url:request.url,
        requestType: request.url.split("?")[0] == "/images/icon.png" ? "image/png" : "text/html"
    }
    
    // add to REPL array
    prompt.context.requests.push(req);

});

// set server to listen to port 8000
server.listen(3000);

// show welcome message for the server
console.log("Server is now running. View localhost:3000 for server connection");