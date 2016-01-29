var path = require("path");
var fs   = require("fs");
var uuid = require("uuid");

/**
 * Modules to hanlde managing data store file saved in JSON
 * @type {{data: Array, filepath, init: Function, loadDataStore: Function, saveDataStore: Function, addRecord: Function, getRecords: Function, countRecords: Function, getRecordWithParam: Function, getIndexOfItem: Function, checkDataScheme: Function}}
 */
module.exports = {

    /**
     * @param {Object[]}
     */
    data: [],

    /**
     * Filepath of datastore
     * @param {string}
     */
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

    /**
     * Loads and parses datastore from JSON file
     * @param callback {function(Object[])}
     */
    loadDataStore: function(callback) {
        fs.exists(this.filepath, function(exists) {
            if (exists) {
                fs.readFile(this.filepath, function(error, file) {
                    if (error) {
                        callback(null);
                    } else {
                        callback(JSON.parse(file));
                    }
                }.bind(this));
            } else {
                callback(null);
            }
        }.bind(this));
    },

    /**
     * Save datastoe into encoded JSON file
     * @param callback {function(success {bool})
     */
    saveDataStore: function(callback) {
        var data = JSON.stringify(this.data);
        fs.writeFile(this.filepath, data, function(error) {
            if (error) {
                callback(false);
            } else {
                callback(true);
            }
        });
    },

    /**
     * Add record to datastore
     * @param record {Object}
     * @param callback {function(success {bool})}
     */
    addRecord: function(record, callback) {
        record.id = uuid.v1();
        this.data.push(record);
        this.saveDataStore(function(success) {
            callback(success);
        })
    },

    /**
     * Returns array of data
     * @return {Object[]}
     */
    getRecords: function() {
        return this.data;
    },

    /**
     * Counts number of records in data store
     * @return {Number}
     */
    countRecords: function() {
        return this.data.length;
    },

    /**
     * Lookup record using parameter request
     * @param param Object{key {string}: value {string}
     * @param callback {function(Object)}
     */
    getRecordWithParam: function(param, callback) {
        var found = null;
        this.data.forEach(function(item) {
            if (item[param.key] == param.value) {
                found = item;
            }
        });
        callback(found);
    },

    /**
     * Get index of item in array
     * @param searchItem {Object}
     * @param callback {function(index {Number})}
     */
    getIndexOfItem: function(searchItem, callback) {
        var found = -1;
        this.data.forEach(function(item, index) {
            if (searchItem == item) {
                found = index;
            }
        });
        callback(found);
    },

    /**
     * Checks the data structure of a model before adding to data store
     * @param data {Object}
     * @return {boolean}
     */
    checkDataScheme: function(data) {
        return  typeof data.title         === "string"
            &&  typeof data.category      === "string"
            &&  typeof data.publisher     === "string"
            &&  typeof data.cost          === "string"
            &&  typeof data.purchasedDate === "string";
    }

};