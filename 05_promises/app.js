const Promise = require("bluebird");
const fs = Promise.promisifyAll( require("fs") );

// METHOD 1 Callbacks

var method1Data = "";
fs.readFile("./text1.txt", (err, data) => {
    if (err) {
        console.log("Error!");
    } else {
        method1Data += data;
        fs.readFile("./text2.txt", (err, data) => {
            if (err) {
                console.log("Error!");
            } else {
                method1Data += data;
                fs.readFile("./text3.txt", (err, data) => {
                    if (err) {
                        console.log("Error!");
                    } else {
                        method1Data += data;
                        console.log("Loaded with method 1: "+method1Data);
                    }
                });
            }
        });
    }
});

// METHOD 2 Promises - sequence

var method2Data = "";
fs.readFileAsync("./text1.txt")
    .then(data => {
        method2Data += data;
        return fs.readFileAsync("./text2.txt");
    })
    .then(data => {
        method2Data += data;
        return fs.readFileAsync("./text3.txt");
    })
    .then(data => {
        method2Data += data;
        console.log("Data loaded from method 2: "+method2Data);
    })
    .catch(err => {
        console.log("Error loading "+err);
    });


Promise.join(
    fs.readFileAsync("./text1.txt", "utf-8"),
    fs.readFileAsync("./text2.txt", "utf-8"),
    fs.readFileAsync("./text3.txt", "utf-8"),
    (txt1, txt2, txt3) => {
        console.log(txt1, txt2, txt3);
    }
);

Promise.all([
    fs.readFileAsync("./text1.txt", "utf-8"),
    fs.readFileAsync("./text2.txt", "utf-8"),
    fs.readFileAsync("./text3.txt", "utf-8")
])
    .then(data => {
        console.log("From Array: ", data);
    })
    .catch(err => {
       console.log("Error "+err);
    });




//dm.get()
//    .then(docs => {
//        console.log("Here are the docs: ", docs);
//    })
//    .catch((status, err) => {
//        console.log("Error "+status+" "+err);
//    });


var loadtext = Promise.coroutine(function*() {
    try {
        var txt1 = yield fs.readFileAsync("./text1.txt", "utf-8");
        var txt2 = yield fs.readFileAsync("./text2.txt", "utf-8");
        var txt3 = yield fs.readFileAsync("./text3.txt", "utf-8");

        console.log("Loaded from YIELD ", txt1, txt2, txt3);
    } catch (err) {
        console.log("Failed to load ", err);
    }
});

loadtext();