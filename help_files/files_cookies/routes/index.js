var express = require('express');
var router = express.Router();

/* GET home page. */
router.get("*", function (req, res) {
    console.log(req.cookies);
    res.render('index', {
        title: 'Express',
        preferredName: req.cookies.perferredName
    });
});

module.exports = router;
