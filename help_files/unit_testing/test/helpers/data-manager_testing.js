var path   = require("path");

var dataManager = require("../../modules/data-manager");
var testData    = require("./testing_data.json");
var testPath    = path.join(__dirname, "../output/test_store.json");

dataManager.init(testData, testPath);

exports.dataManager = dataManager;