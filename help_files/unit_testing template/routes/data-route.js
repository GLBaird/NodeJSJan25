var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next) {
    var dm = req.app.locals.dataManager;
    var newRecord = req.body;
    if (dm.checkDataSheme(newRecord)) {
        dm.addRecord(newRecord, function(success) {
            if (success) {
                res.render("added", {title: "Record added"});
            } else {
                next(new Error("Record failed to be added and saved"));
            }
        });
    } else {
        next(new Error("Record data did not match the database schema"));
    }

});

router.get("/records", function(req, res) {
    var records = req.app.locals.dataManager.getRecords();
    res.json(records);
});

module.exports = router;
