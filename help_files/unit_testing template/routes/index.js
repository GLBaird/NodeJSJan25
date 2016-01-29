var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Unit Testing' });
});

router.get("/records", function(req, res) {
  var records = req.app.locals.dataManager.getRecords();
  res.render("records", {
    title: "Unit Testing - records",
    data: records
  })
});
module.exports = router;
