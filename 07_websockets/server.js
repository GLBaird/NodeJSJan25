var express = require("express");
var WebSocketServer = require("websocket").server;

var app = express();

app.use(express.static("./public"));

var server = app.listen(3000, function() {
    console.log("Listening on localhost:3000");
});

var wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

var connections = [];

wsServer.on("request", function(request) {

    console.log("Request for a socket");

    var socket = request.accept("echo-protocol", request.origin);

    connections.forEach(function(connection) {
        connection.sendUTF("New Socket Added");
    });

    connections.push(socket);

    socket.on("message", function(message) {
        console.log("Message received: "+message.utf8Data);
        socket.sendUTF("Message Received "+Date.now()/1000);
        connections.forEach(function(connection) {
            if (socket != connection) {
                connection.sendUTF(message.utf8Data);
            }
        });
    });

    socket.on("close", function(reason, description) {
        console.log("Socket Closed: ", reason, description);
        for(var i in connections) {
            //noinspection JSUnfilteredForInLoop
            if (socket === connections[i]) {
                connections.splice(i, 1);
                break;
            }
        }

        connections.forEach(function(connection) {
            connection.sendUTF("Connection Closed");
        });
    })

});
