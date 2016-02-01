var MessageTypeLocal = "local";
var MessageTypeRemote = "remote";

var client = {

    name: null,
    ip: null,

    sounds: {
        join: null,
        leave: null,
        message: null,

        play: function(sound) {
            if (typeof this[sound] != "undefined" && this[sound] != null) {
                this[sound].play();
            } else {
                console.error("That sound does not exist!");
            }
        }
    },

    init: function() {
        this.ui.init();

        this.sounds.join = $("audio#joinSound")[0];
        this.sounds.leave = $("audio#leaveSound")[0];
        this.sounds.message = $("audio#messageSound")[0];
    },

    socket: {
        /**
         * @property websocket {WebSocket}
         */
        websocket: null,

        setupSocket: function(clientName) {
            try {
                this.websocket = new WebSocket(location.href.replace("http", "ws") + "?name=" + encodeURI(clientName));
                this.websocket.addEventListener("message", this.messageRecevied.bind(this));
                this.websocket.addEventListener("error", this.handleError.bind(this));
            } catch(securityError) {
                console.log("Web Socket Security Error",securityError);
                client.ui.alert("Security Error", "The socket has been refused a connection!<br>"+securityError);
            }
        },

        handleError: function(error) {
            console.log("Error on websocket", error);
            client.ui.alert("Web Socket Error", "There has been a socket error<br>"+error);
        },

        sendMessage: function(message) {
            this.websocket.send(message);
        },

        messageRecevied: function(message) {
            var data = JSON.parse(message.data);
            switch (data.type) {
                case "newClient":
                    client.ui.addClient({
                        id: data.id,
                        image: data.image,
                        name: data.name
                    });
                    $("main article").append(data.name+" has joined the chat.");
                    client.sounds.play("join");
                    break;
                case "connectionData":
                    client.ui.showConntected(data.name, data.ip);
                    client.ui.addMessage(MessageTypeRemote, "Git Chat", "You are connected with id: "+data.id);
                    client.ip   = data.ip;
                    client.name = data.name;
                    client.ui.addClient({
                        id: data.id,
                        image: data.image,
                        name: data.name
                    });
                    break;
                case "exisitingClientList":
                    var clients = data.clients;
                    for(var i in clients) {
                        client.ui.addClient({
                            id: clients[i].id,
                            image: clients[i].image,
                            name: clients[i].name
                        });
                    }
                    break;
                case "clientMessage":
                    client.ui.addMessage(MessageTypeRemote, data.from, data.message);
                    client.sounds.play("message");
                    break;
                case "clientLeftChat":
                    client.ui.removeClient(data.id);
                    $("main article").append(data.name+" has left the chat.<br>");
                    client.sounds.play("leave");
                    break;
            }
        }
    },

    ui: {

        /**
         * setup UI
         */
        init: function() {
            $("button#alertButton").click(function(e) {
                e.preventDefault();
                $("section#alert")
                    .removeClass("show")
                    .attr("aria-hidden", "true");
            });

            $("button#showChats").click(function(e) {
                e.preventDefault();
                this.toggleChatRoom();
            }.bind(this));

            $("form#join").submit(this.joinFormSubmitted.bind(this));
            $("form#chat").submit(this.chatFormSubmitted.bind(this));
        },

        joinFormSubmitted: function(e) {
            e.preventDefault();
            var name = $("input#joinName").val();
            client.socket.setupSocket(name);
        },

        chatFormSubmitted: function(e) {
            e.preventDefault();
            var message = $("input#chatText").val();
            $("input#chatText").val("");
            this.addMessage(MessageTypeLocal, client.name+", "+client.ip, message);
            client.socket.sendMessage(message);
        },

        /**
         * Show custom alert box
         * @param title {string}
         * @param message {string}
         * @param [button] {string}
         */
        alert: function(title, message, button) {
            $("section#alert h2").html(title);
            $("section#alert p").html(message);
            if (typeof button === "string") {
                $("section#alert button").html(button);
            } else {
                $("section#alert button").html("ok");
            }
            $("section#alert")
                .addClass("show")
                .attr("aria-hidden", "false");
        },

        toggleChatRoom: function() {
            $("section#list").toggleClass("show");
            $("header button").toggleClass("show");
        },

        /**
         * Add message to chat window
         * @param type {MessageTypeLocal|MessageTypeRemote}
         * @param clientInfo {string}
         * @param message {string}
         */
        addMessage: function(type, clientInfo, message) {
            $("main article").append(
                $("<p/>")
                    .addClass(type)
                    .html("<span>"+clientInfo+"</span>"+message)
            );
        },

        /**
         * Adds a list of messages to the UI
         * @param messages { { type:MessageTypeLocal|MessageTypeRemote, clientInfo:string, message:string }[] }
         */
        setMessages: function(messages) {
            messages.forEach(function(val) {
                this.addMessage(val.type, val.clientInfo, val.message);
            }.bind(this));
        },

        /**
         * Add client in chat room list
         * @param clientDetails {{ id: string, image: string, name: string }}
         */
        addClient: function(clientDetails) {
            $("section#list ul.userlist").append(
                $("<li />")
                    .attr("id", clientDetails.id)
                    .html(
                        clientDetails.name + (
                            $("<img />")
                                .attr("src", clientDetails.image)
                                .attr("alt", "avatar")[0].outerHTML
                        )

                )
            );
        },

        /**
         * Remove client from chatroom list
         * @param clientID {string}
         */
        removeClient: function(clientID) {
            $("li#"+clientID).remove();
        },

        /**
         * Change status in app header to connected
         * @param name {string}
         * @param ip {string}
         */
        showConntected: function(name, ip) {
            $("span#connection").addClass("connected");
            $("p#joinInfo span.username").html(name);
            $("p#joinInfo span.ip").html(ip);
            $("form#join").hide();
            $("p#joinInfo").show();
        }
    }
};

