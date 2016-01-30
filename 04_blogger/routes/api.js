// load router
const express = require("express");
const router  = express.Router();
const path    = require("path");
const bodyParser = require("body-parser");
const dm = require("../modules/data-manager");

// helper methods
function sendError(status, message, res) {
    res.status(status).send(message);
    console.log("Server error "+status+" "+message);
}


// routes for blogs
router.get("/blogs", (req, res) => {
    dm.get((err, docs) => {
        if (err) {
            sendError(500, "Server Error, failed to load blogs.", res);
        } else  {
            res.json(docs);
        }
    });
});

router.get("/blogs/:id", (req, res) => {
    dm.getBlog(req.params.id, (err, doc) => {
        if (err) {
            sendError(404, "Blog not found", res);
        } else {
            res.json(doc);
        }
    });
});

router.delete("/blogs/:id", (req, res) => {
    dm.delete(req.params.id);
    res.send();
});

// parse body data
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

router.post("/blogs", (req, res) => {
    dm.add(req.body);
    res.send();
});

router.put("/blogs/:id", (req, res) => {
    dm.update(req.params.id, req.body, (err) => {
        console.log(arguments);
        if (err === true) {
            sendError(500, "Failed to update blog", res);
        } else {
            res.send();
        }
    });
});

router.use("*", (req, res) => {
    sendError(404, "API not found", res);
});

// export router
module.exports = router;