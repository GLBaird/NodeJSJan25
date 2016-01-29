var should = require("should");
var dm = require("./helpers/data-manager_testing").dataManager;
var fm = require("fs");
var path = require("path");
var request = require("supertest");
var app = require("../app")(dm, true);

// test objects
var goodTestObject = {
    title: "title",
    category: "category",
    publisher: "publisher",
    cost: "cost",
    purchasedDate: "date"
};

var badTestObject = {
    title: "title",
    publisher: "publisher",
    cost: 50,
    purchasedDate: "date"
};

describe("data-manager", function() {

    it ("Shoud be ready", function(done) {
        dm.data.should.be.an.instanceOf(Array);
        dm.data.length.should.equal(3);
        dm.filepath.indexOf("/output/test_store.json").should.be.above(0);
        done()
    });

    it ("checkDataScheme should pass", function(done) {
        dm.checkDataScheme(goodTestObject).should.be.equal(true);
        done();
    });

    it ("checkDataScheme should fail", function(done) {
        dm.checkDataScheme(badTestObject).should.be.equal(false);
        done();
    });

    it ("indexOfItem returns the correct index", function(done) {
        function doTest(record) {
            return new Promise(function(resolve, reject) {
                dm.getIndexOfItem(record, function (result) {
                    resolve(result);
                });
            });
        }

        doTest(dm.data[1]).then(function(res) {
            res.should.be.equal(1);
            return doTest(dm.data[2]);
        }).then(function(res) {
            res.should.be.equal(2);
            return doTest(dm.data[0]);
        }).then(function(res) {
            res.should.be.equal(0);
            done();
        });
    });

    it ("Get record with a paramater object", function(done) {
        var param = { key: "publisher", value:"Naxos" };
        dm.getRecordWithParam(param, function(found) {
            found.should.equal(dm.data[1]);
            done();
        })
    });

    it ("Should return 3 when counting records", function(done) {
        dm.countRecords().should.be.equal(3);
        done();
    });

    it ("Should return array of records", function(done) {
        dm.getRecords().should.be.equal(dm.data);
        done();
    });

    it ("will add a new record to the database", function(done) {
        var start = dm.countRecords();
        dm.addRecord(goodTestObject, function(success) {
            success.should.equal(true);
            var end = dm.countRecords();
            end.should.equal(start+1);
            done();
        });
    });

    it ("should save data store to disk", function(done) {
        dm.saveDataStore(function(successs) {
            successs.should.equal(true);
            fm.exists(path.join(__dirname, "output/test_store.json"), function(exists) {
                exists.should.equal(true);
                done();
            });
        });

    });

});

describe("Test restful APIs", function() {
    it("Get records returns JSON data", function(done) {
        request(app)
            .get("/data/records")
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res){
                if (err) throw err;
                done();
            });
    });

    it("Post reports error with no document", function(done) {
        request(app)
            .post("/data")
            .expect('Content-Type', /text\/html/)
            .expect(500)
            .end(function(err, res){
                done();
            });
    });
});

describe("Test routes", function() {

    it("Main index route should send data", function(done) {
        request(app)
            .get("/")
            .expect('Content-Type', /text\/html/)
            .expect(200)
            .end(function(err, res){
                if (err) throw err;
                done();
            });
    });

    it("Display records route should send data", function(done) {
        request(app)
            .get("/records")
            .expect('Content-Type', /text\/html/)
            .expect(200)
            .end(function(err, res){
                if (err) throw err;
                done();
            });
    });

});