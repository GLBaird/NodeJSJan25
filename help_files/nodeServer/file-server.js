    
    
var fileManager = {
    
    serverStartDate: new Date(),
    
    portnumber: 8000,
    
    init: function() {
        if (!this.initialised) {
            this.repl.startREPL();            
            this.nodeModules.http = require('http');
            this.nodeModules.fs = require('fs');
            this.initialised = true;
        }
    },
    
    initialised: false,
    
    startServer: function(portnumber) {
        
        this.init();
        
        if (portnumber) {
            this.portnumber = portnumber;
        }
        
        if (!this.server) {
            var http = this.nodeModules.http;
            this.server = http.createServer(this.requestHanlder);
        }
        
        this.server.listen(this.portnumber);
        
        console.log("\nServer started on port number: "+this.portnumber);
        console.log("Access URL: localhost:"+this.portnumber+"\n");
        return "Server Ready...";
    },
    
    stopServer: function () {
        console.log("Ending server process...");
        process.exit();
    },
    
    nodeModules: {
        http: null,
        repl: null,
        fs: null
    },
    
    server: null,
    
    requestHanlder: function(request, response) {
        console.log("File Request for "+request.url);
        
        var filePath = request.url.substring(1);
        var fs = fileManager.nodeModules.fs;
        
        if (fs.existsSync(filePath)) {
            if (fs.lstatSync(filePath).isDirectory()) {
                if (filePath.substring(filePath.length-1) != "/") {
                    filePath += "/";
                }
                filePath += "index.html";
            }
        } else if (filePath == "") {
            filePath = "index.html";
        }
        
        console.log("SEARCHING = "+filePath);
        
        fs.exists(filePath, function(exists){
            if (!exists) {
                response.writeHead(404, { "Content-Type" : "text/html" });
                response.write("<h1>Server Error #404!</h1>");
                response.write("<p>"+filePath+" cannot be found on server.<br />");
                response.write("For request: http://leonbaird.co.uk/"+request.url+"</p>");
                response.end("<p>Connection closed</p>");
                
                fileManager.logfile.logRequest(request);
                fileManager.logfile.logMessage("     ** ERROR 404 ** File not found\n\n");
            } else {
                
                fs.readFile(filePath, function(err, data) {
                    if (err) {
                        response.writeHead(500, { "Content-Type" : "text/html" });
                        response.write("<h1>Server Error #500!</h1>");
                        response.write("<p>"+filePath+" cannot be streamed due to a file error.<br />");
                        response.write("For request: http://leonbaird.co.uk/"+request.url+"</p>");
                        response.end("<p>Connection closed</p>");
                        fileManager.logfile.logRequest(request);
                        fileManager.logfile.logMessage("     ** File Error Reading!\n\n");
                        throw "File Reading Error "+err;
                    } else {
                        var mimeType = "text/plain";
                        if (filePath.indexOf(".")> 0) {
                            var fExt = filePath.split(".").pop();
                            if (typeof fExt != "undefined") {
                                switch (fExt) {
                                    case "html":
                                        mimeType = "text/html";
                                        break;
                                    case "png":
                                        mimeType = "image/png";
                                        break;
                                    case "jpg":
                                    case "jpeg":
                                        mimeType = "image/jpeg";
                                        break;
                                    case "gif":
                                    case "giff":
                                        mimeType = "image/gif";
                                        break;
                                    case "m1v":
                                    case "m4v":
                                    case "mp4":
                                        mimeType = "video/mpeg";
                                    case "xml":
                                        mimeType = "text/xml";
                                        break;
                                    case "json":
                                        mimeType = "application/json";
                                        break;
                                    case "zip":
                                        mimeType = "application/zip";
                                        break;
                                    case "pdf":
                                        mimeType = "application/pdf";
                                    case "php":
                                        response.writeHead(500, { "Content-Type" : "text/html" });
                                        response.write("<h1>Server Error #500!</h1>");
                                        response.write("<p>"+filePath+" is PHP and is not supported by this server.<br />");
                                        response.write("For request: http://leonbaird.co.uk/"+request.url+"</p>");
                                        response.end("<p>Connection closed</p>");
                                        fileManager.logfile.logRequest(request);
                                        fileManager.logfile.logMessage("     ** File Error as PHP!\n\n");
                                        return;
                                }
                            }
                        }
                        response.writeHead(200, { "Content-Type" : mimeType });
                        response.write(data);
                        response.end();
                        
                        fileManager.logfile.logRequest(request);
                        fileManager.logfile.logMessage("     Request processed as mimetype: "+mimeType+"\n\n");
                    }
                });
            }
        });
        
        
        
    },
    
    repl: {
        prompt: null,
        
        startREPL: function() {
            
            var repl = require('repl'); 
            this.prompt = repl.start({ prompt: "filemanager =>" });
            this.prompt.context.fm = fileManager;
            fileManager.nodeModules.repl = repl;
        }
    },
    
    log: function() {
        var fs = this.nodeModules.fs;
        fs.readFile(this.logfile.logURL, function(err, data) {
            if (err) {
                console.log("ERROR ! Cannot read the log file!!");
                return;
            }
            console.log("\n**** SERVER LOG FILE ***\n");
            console.log(data.toString());
        });
    },
    
    logfile: {
        
        logURL: "fileserver.log",
        
        logMessage: function(msg) {
            var fs = fileManager.nodeModules.fs;
            fs.open(this.logURL, 'a', function(err, fd) {
                if (err) throw "Server Error - Cannot open log file. "+err+"\n";
                var buffer = new Buffer(msg);
                fs.write(fd, buffer, 0, buffer.length, null, function(err, written, buffer) {
                    if (err) throw "Server Error - Cannot write to log file. "+err+"\n";
                    fs.close(fd, function(err){
                        if (err) throw "Server Error - Cannot close log file."+err+"\n";
                    });
                });
            });
        },
        
        logRequest: function(request) {
            
            var reqURL = request.url.split("?")[0];
            var now = new Date();
            var msg = "** "+now.toLocaleString()+": File Request - "+reqURL+"\n";
            if (request.url.split("?").length > 1) {
                msg += "     GET Variables: \n";
                var getVariables = request.url.split("?")[1].split("&");
                for( var i in getVariables) {
                    var varString = getVariables[i];
                    if (varString.indexOf("=")>=0) {
                        var prop = varString.split("=")[0];
                        var val  = decodeURIComponent(varString.split("=")[1]);
                        msg += "          "+prop+":"+val+"\n";
                    }
                }
            }
            
            this.logMessage(msg);
            
        }
        
    }
    
}

fileManager.init();

for (var i in process.argv) {
    if (process.argv[i] == "--start") {
        var portNumber = process.argv[parseInt(i)+1];
        if (!isNaN(portNumber)) {
            fileManager.startServer(portNumber);
        } else {
            fileManager.startServer();
        }
    }
}