var co = require("co");
var fs = require("co-fs");

co(function* () {

    var file1 = yield fs.readFile("some-info.data", "utf-8");
    console.log(file1);

    var file2 = yield fs.readFile("more-info.data", "utf-8");
    console.log(file2);

    var contents = yield fs.readdir("./");
    console.log(contents);

});