"use strict";

const express = require("express");
const morgan  = require("morgan");
const path    = require("path");

// create and setup app
const app = express();

// define render engine
app.set("view engine", "jade");
app.set("views", path.join(__dirname, "views"));

// add middleware
app.use( morgan("dev") );

// define routes
app.get("/", (req, res) => {
    res.render("home", { page: "home" });
});

app.get("/blogs", (req, res) => {
    res.send("Blog List");
});

app.get("/blogs/:id", (req, res, next) => {
    if (req.params.id == "add") {
        next();
    } else {
        res.send("Blog Details");
    }
});

app.get("/blogs/add", (req, res) => {
    res.send("Add new blog");
});

// Static routes
app.use("/jquery", express.static( path.join(__dirname, "node_modules", "jquery", "dist") ) );
app.use("/bootstrap", express.static( path.join(__dirname, "node_modules", "bootstrap", "dist") ) );
app.use( express.static( path.join(__dirname, "public") ) );

// 404
app.get("*", (req, res) => {
    res.send("404 Error");
});

// export app
module.exports = app;