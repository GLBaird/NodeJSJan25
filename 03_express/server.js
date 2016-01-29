"use strict";

// imports
const express = require("express");
const morgan  = require("morgan");
const colors  = require("colors");
const path    = require("path");

// setup the app
const app = express();

// load fake data
const users = require("./data/users");

// define routes
app.use(morgan("dev"));

app.get("/home", (req, res) => {
    res.send("<h1>Welcome to Express</h1><p>This is the home page</p>");
});

app.get("/users", (req, res) => {
    res.json(users);
});

app.get("/users/:search", (req, res) => {
    res.json(users.filter(user => user.surname.toLowerCase() == req.params.search.toLowerCase()));
});

// Static Route
app.use( express.static( path.join(__dirname, "public") ) );

// start the server
app.listen(3000, () => console.log("Server is running on "+"http://localhost:3000".green));
