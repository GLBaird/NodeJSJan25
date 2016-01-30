// load router
const express    = require("express");
const router     = express.Router();
const path       = require("path");
const bodyParser = require("body-parser");
const dm         = require("../modules/data-manager");

// Helper for rendering blog view
function renderBlogs(res) {
    dm.get((err, docs) => {
        res.render("blogs", {
            page: "blogs",
            err: err,
            blogs: docs
        });
    });
}

// Blog List
router.get("/", (req, res) => {
    renderBlogs(res);
});

router.get("/:id", (req, res, next) => {
    if (req.params.id == "add") {
        next();
    } else {
        dm.getBlog(req.params.id, (err, doc) => {
            res.render("details", {
                page: "blogs",
                err: err,
                blog: doc,
                id: req.params.id
            });
        });
    }
});

router.get("/add", (req, res) => {
    res.render("add", { page:"add" });
});

// Handle Post Requests

// parse body data
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

router.post("/", (req, res) => {
    dm.add(req.body);
    renderBlogs(res);
});

// export router
module.exports = router;