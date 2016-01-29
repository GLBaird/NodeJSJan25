var path = require("path");
var fs   = require("fs");
var uuid = require("uuid");


module.exports = {

    data: [],

    filepath: path.join(__dirname, "../data/store.json"),

    /**
     * Setup datastore, if no values given, will load from default store location:
     * /data/store.json, or will parse dataobject or change store path
     * @param [data_store] {Object[]}
     * @param [storePath] {string}
     */
    init: function(data_store, storePath) {
        if (typeof storePath === "string") {
            this.filepath = storePath;
        }
        if (data_store instanceof Array) {
            this.data = data_store;
        } else {
            this.loadDataStore(function(store) {
                if (store != null)
                    this.data = store;
            }.bind(this));
        }
    },

    loadDataStore: function(callback) {
        fs.exists(this.filepath, function(exists) {
            if (exists) {
                fs.readFile(this.filepath, function(err, file) {
                    if (error) {
                        callback(null);
                    } else {
                        callback(file);
                    }
                }.bind(this));
            } else {
                callback(null);
            }
        }.bind(this));
    },

    saveDataStore: function(callback) {
        console.log("Saveing data");
        var data = JSON.stringify(this.data);
        fs.writeFile(this.filepath, data, function(error) {
            console.log("Finshed writing to "+this.filepath+" With result "+error);
            if (error) {
                callback(false);
            } else {
                callback(true);
            }
        });
    },

    addRecord: function(record, callback) {
        record.id = uuid.v1();
        this.data.push(record);
        console.log("ADDING", record);
        this.saveDataStore(function(success) {
            callback(success);
        })
    },

    getRecords: function() {
        return this.data;
    },

    countRecords: function() {
        return this.data.length;
    },

    getRecordWithParam: function(param, callback) {
        this.data.some(function(item) {
            if (item[param.key] == param.value) {
                callback(item);
                return false;
            }
            return true;
        });
    },

    getIndexOfItem: function(searchItem, callback) {
        this.date.some(function(item, index) {
            if (searchItem == item) {
                callback(index);
                return false;
            }
            return true;
        });
    },

    checkDataSheme: function(data) {
        console.log("TESTING", data);
        return  typeof data.title         === "string"
            &&  typeof data.category      === "string"
            &&  typeof data.publisher     === "string"
            &&  typeof data.cost          === "string"
            &&  typeof data.purchasedDate === "string";
    }

}