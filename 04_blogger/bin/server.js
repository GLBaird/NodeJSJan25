#!/usr/bin/env node

const http   = require("http");
const colors = require("colors");
const app    = require("../app");


var portnumber = process.env.PORT || 3000;

// setup server
const server = http.createServer(app);

// start server
server.listen(portnumber, () => console.log("Server is running on ".white + ("http://localhost:"+portnumber).green)  );
