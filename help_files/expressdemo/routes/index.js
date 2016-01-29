var router = require("express").Router();

router.get("/", function(req, res) {
    console.log("Request for main index");
    res.render("index", { pageTitle:"Welcome", menuItemSelected: "home" });
});

router.get("/data", function(req, res){
    console.log("Post request");
    res.render("about-data", {
        pageTitle: "Organised Events",
        menuItemSelected: "event",
        data: require("../data")
    } );
});
router.post("/data", function(req, res){
    console.log("Post request no data");
    res.json( require("../data") );
});

router.post("/data/url", function(req, res){
    console.log("Post request JSON body");
    if (!req.body) return res.sendStatus(400);
    console.log("Post BODY data detected:");
    console.log(req.body);
    res.json( require("../data") );
});

router.post("/data/json", function(req, res){
    console.log("Post request URLEncoded body");
    if (!req.body) return res.sendStatus(400);
    console.log("Post BODY data detected:");
    console.log(req.body);
    res.json( require("../data") );
});

module.exports = router;