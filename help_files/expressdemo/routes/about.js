var router = require("express").Router();

router.use(function(req, res, next) {
    console.log("First set of checks on about");
    next();
});

router.get("/", function(req, res) {
    console.log("Request for main about route.");
    res.render("about", { pageTitle: "About this app..", menuItemSelected: "about" });
});

router.use("/:campus", function(req, res, next) {
    console.log("Checking Campus");
    if (req.params.campus == 42) {
        res.send("Illegal Campus")
    } else {
        next();
    }
});

router.get("/:campus", function(req, res) {
    console.log("Request for about with value: "+req.params.campus);
    res.send("We will let you know about "+req.params.campus);
});

module.exports = router;