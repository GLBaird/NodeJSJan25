// imports
const http   = require("http");
const path   = require("path");
const url    = require("url");
const fs     = require('fs');
const colors = require("colors");

// setup fake data
var users = [
    { surname: "Baird",   forename: "Leon" },
    { surname: "Jones",   forename: "Indiana" },
    { surname: "Spencer", forename: "Frank" },
    { surname: "Spencer", forename: "Betty" },
    { surname: "Smith",   forename: "Stan" }
];

// Helper Methods

/**
 * Show a 404 Error to Browser
 * @param {number} status
 * @param {string} message
 * @param {string} reqPath
 * @param {ServerResponse} res
 */
function showError(status, message, reqPath, res) {
    var data = "<h1>Server Error #"+status+"</h1><hr>" +
        "<p>"+message+": "+reqPath+"</p>";
    res.writeHead(status, {
        "Content-Type": "text/html",
        "Content-Length": data.length
    });
    res.end(data);
}

/**
 * Check if file exists and get full path
 * @param {string}                 filePath     Path of file to check
 * @param {function(bool, string)} callback     received (exists, fullFilePath)
 */
function fileExists(filePath, callback) {
    fs.stat(filePath, (err, stats) => {
        if (!err && stats.isFile()) {
            callback(true, filePath);
        } else if (!err && stats.isDirectory()) {
            var newPath = path.join(filePath, "index.html");
            fileExists(newPath, callback);
        } else {
            callback(false);
        }
    });
}

// setup environment
var portnumber = process.env.PORT || 3000;

process.argv.forEach( (arg, index) => {
    if (arg == "-p" || arg == "--port") {
        var value = parseInt( process.argv[index+1] );
        portnumber = isNaN(value) || value < 1000 ? portnumber : value;
    }
});

// make server
const server = http.createServer((req, res) => {

    // Log request details
    console.log(
        new Date().toLocaleString().white + " "+
        req.method.green + " Incoming Request: ".white +
        req.url.blue
    );

    // get URL data
    var reqURL  = url.parse(req.url);
    var reqPath = reqURL.pathname;

    // handle routing

    // User Data Route
    if (reqPath == "/users" && req.method == "GET") {
        var userJSON = JSON.stringify(users);
        res.writeHead(200, {
            "Content-Type": "application/json",
            "Content-Length": userJSON.length
        });
        res.end(userJSON);
    }

    // User Data Search for Surname Route
    else if (reqPath.indexOf("/users/") == 0  && req.method == "GET") {
        var search = reqPath.split("/users/")[1];
        console.log("\tSearching users for: "+search.blue);
        var results = JSON.stringify(
            users.filter(user => user.surname.toLowerCase() == search.toLowerCase())
        );
        res.writeHead(200, {
            "Content-Type": "application/json",
            "Content-Length": results.length
        });
        res.end(results);
    }

    // Static Files and 404 File Not Found
    else {

        var fullPath = path.join(__dirname, "public", reqPath);
        console.log("\tSearching for static file: "+fullPath.blue);

        fileExists(fullPath, (exists, correctPath) => {
            if (exists) {
                fs.readFile(correctPath, (err, data) => {

                    if (!err) {

                        // find mimetype
                        var mimetype;
                        var fileExtension = correctPath.toLowerCase().split(".").pop();

                        switch (fileExtension) {
                            case "jpg":
                            case "jpeg":
                                mimetype = "image/jpeg";
                                break;
                            case "css":
                                mimetype = "text/css";
                                break;
                            case "html":
                                mimetype = "text/html";
                                break;
                            default:
                                mimetype = "text/plain";
                        }

                        res.writeHead(200, {
                            "Content-Type": mimetype,
                            "Content-Length": data.length
                        });

                        res.end(data);

                    } else {
                        showError(500, "Failed to load file", correctPath, res);
                    }

                });
            } else {
                showError(404, "File not found", fullPath, res);
            }
        });

    }


});

// start server
server.listen(portnumber,() => {
    console.log("Server is listening on ".white + ("http://localhost:"+portnumber).green);
});