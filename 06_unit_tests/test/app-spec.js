const assert = require("assert");
const app = require("../app");

describe("Testing App", () => {

    describe("App exists with correct methods", () => {

        it("should be an object", () => {
            assert(typeof app === "object" && app !== null, "App is not declared as an object or is null");
        });

        it("should have the correct methods", () => {
            assert.equal(typeof app.getSettings,   "function", "Missing getSettings Method");
            assert.equal(typeof app.applySettings, "function", "Missing applySettings Method");
            assert.equal(typeof app.incrementPort, "function", "Missing incrementPort Method");
        });

    });

    describe("App has correct defaults", () => {
        var settings = app.getSettings();

        it("should return defaults as an object", () => {
            assert.equal(typeof settings, "object", "returned settings bundle is not an object");
            assert(settings, "settings bundle may be null");
        });

        it("should have settings of correct types", () => {
            assert.equal(typeof settings.username, "string", ".username is not a string");
            assert.equal(typeof settings.portnumber, "number", ".portnumber is not a number");
            assert(!isNaN(settings.portnumber) && isFinite(settings.portnumber), "portnumber may be NaN or finite");
        });
    });

    describe("testing methods", () => {

        it("should apply settings", () => {
            app.applySettings({portnumber:2000, username: "Bob"});
            var settings = app.getSettings();

            assert.equal(settings.portnumber, 2000);
            assert.equal(settings.username, "Bob");

            app.applySettings({portnumber:1000});
            settings = app.getSettings();

            assert.equal(settings.portnumber, 1000);
            assert.equal(settings.username, "Bob");

            app.applySettings({username: "Mary"});
            settings = app.getSettings();

            assert.equal(settings.portnumber, 1000);
            assert.equal(settings.username, "Mary");

            app.applySettings({});
            settings = app.getSettings();

            assert.equal(settings.portnumber, 1000);
            assert.equal(settings.username, "Mary");
        });

        it("should increment portnumber", () => {

            app.applySettings({portnumber: 2000});
            app.incrementPort();
            var settings = app.getSettings();

            assert.equal(settings.portnumber, 2100);

            app.incrementPort();
            settings = app.getSettings();

            assert.equal(settings.portnumber, 2200);

            app.incrementPort();
            settings = app.getSettings();

            assert.equal(settings.portnumber, 2300);

        });

    });

});