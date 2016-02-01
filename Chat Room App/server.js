var express = require("express");
var WebsocketServer = require("websocket").server;
var http = require("http");
var path = require("path");
var fs = require("fs");

var app = express();
var server = http.createServer(app);
var avatarlist = fs.readdirSync(path.join(__dirname, "public/images/avatars"));

function getRandomAvatar() {
    do {
        var num = Math.round((avatarlist.length-1) * Math.random());
    } while(this.lastNumber == num || avatarlist[num].substr(0,1) == ".");
    this.lastNumber = num;
    return "/images/avatars/"+avatarlist[num];
}

app.use(express.static( path.join(__dirname, "public") ));
app.use("/lib/jquery", express.static( path.join(__dirname, "node_modules/jquery/dist") ));

app.all("*", function(req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

server.listen(3000, function() {
    console.log("Server running on http://localhost:3000");
});


var socketServer = new WebsocketServer({
    httpServer: server
});

var clients = [];

socketServer.on("request", function(request) {

    var socket = request.accept();

    socket.name = request.resourceURL.query.name;
    socket.avatar = getRandomAvatar();
    socket.id = Math.floor(Date.now()/1000);

    var connectionData = JSON.stringify({
        type: "newClient",
        name: socket.name,
        image: socket.avatar,
        ip: socket.remoteAddress.split(":").pop(),
        id: socket.id
    });

    console.log(connectionData);

    for(var i in clients) {
        clients[i].sendUTF(connectionData);
    }

    socket.sendUTF(connectionData.replace("newClient", "connectionData"));

    if (clients.length > 0) {
        var otherSockets = [];
        for (var i in clients) {
            otherSockets.push({
                id: clients[i].id,
                name: clients[i].name,
                image: clients[i].avatar
            });
        }

        var clientListData = JSON.stringify({
            type: "exisitingClientList",
            clients: otherSockets
        });

        socket.sendUTF(clientListData);
    }

    clients.push(socket);

    socket.on("message", function(message) {
        var messageData = JSON.stringify({
            type: "clientMessage",
            from: socket.name+", "+socket.remoteAddress.split(":").pop(),
            message: message.utf8Data
        });

        for(var i in clients) {
            if (clients[i] == socket) continue;
            clients[i].sendUTF(messageData);
        }
    });



    socket.on("close", function() {
        var index = clients.indexOf(socket);
        clients.splice(index, 1);
        var exitData = JSON.stringify({
            type: "clientLeftChat",
            id: socket.id,
            name: socket.name
        });
        for(var i in clients) {
            clients[i].sendUTF(exitData);
        }
    });

});