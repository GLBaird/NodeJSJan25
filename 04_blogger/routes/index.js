// load router
const express = require("express");
const router  = express.Router();
const path    = require("path");

// Main application routes

// Home Page
router.get("/", (req, res) => {
    res.render("home", { page: "home" });
});

// Sub Routes
router.use("/blogs", require("./blogs"));
router.use("/api", require("./api"));

// Static routes
router.use("/jquery", express.static( path.join(__dirname, "..","node_modules", "jquery", "dist") ) );
router.use("/bootstrap", express.static( path.join(__dirname, "..", "node_modules", "bootstrap", "dist") ) );
router.use( express.static( path.join(__dirname, "..", "public") ) );

// 404
router.get("*", (req, res) => {
    res.render("404", { page: null, pageURL: req.originalUrl });
});

// export router
module.exports = router;