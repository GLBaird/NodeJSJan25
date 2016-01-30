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
app.use( require("./routes") );

// export app
module.exports = app;