var express = require("express");
var router = express.Router();

var session;

/* GET home page. */
router.get('/', function (req, res, next) {
    session = req.session;
    if (session.validatedState) {
        res.render("admin", {title: "Sessions - validated user"});
    } else {
        res.render("index", {title: "Sessions"});
    }
});

router.post("/validate", function(req, res) {
    session = req.session;
    console.log("POST validiation received: ", req.body);
    if (req.body.username == "leon" && req.body.password == "letmein") {
        session.validatedState = true;
        res.redirect('/');w
    } else {
        session.valudatedState = false;
        res.render("index", {title: "Sessions - failed authentication"});
    }
});

router.get("/logoff", function(req, res) {
    req.session.destroy(function(err){
        if(err){
            console.log(err);
        }
    });

    res.redirect('/');
});

module.exports = router;
