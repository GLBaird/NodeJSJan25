"use strict";

const mongojs = require("mongojs");
const Promise = require("bluebird");

function getDB() {
    return mongojs("blogger", ["blogs"]);
}

function getAllBlogs() {
    return new Promise((resolve, reject) => {
        getDB().blogs.find().sort({ date:-1, title:1 }, (err, docs) => {
            if (err) {
                reject("Error loading blogs");
            } else {
                resolve(docs);
            }
        });
    });
}

function getBlog(id) {
    return new Promise((resolve, reject) => {
        try {
            getDB().blogs.findOne({_id: mongojs.ObjectId(id)}, (err, doc) => {
                if (err || doc == null) {
                    reject(404, "Error - Could not find document");
                } else {
                    resolve(doc);
                }
            });
        } catch (err) {
            console.log("DB Error - Invalid ID");
            reject(500, "Error - Malformed Object ID");
        }
    });
}

function addBlog(newBlog) {
    var nb = {
        title: newBlog.title,
        message: newBlog.message,
        date: Math.floor( Date.now() / 1000 )
    };

    getDB().blogs.insert(nb);
}

function updateBlog(id, update, callback) {
    var changes = {};
    if (update.title)   changes.title   = update.title;
    if (update.message) changes.message = update.message;
    if (update.date)    changes.date    = update.date;

    try {
        getDB().blogs.update(
            { _id: mongojs.ObjectId(id) },
            { $set: changes },
            callback
        );
    } catch (err) {
        callback(true);
    }
}

function deleteBlog(id) {
    try {
        getDB().blogs.remove({ _id: mongojs.ObjectId(id) }, () => {});
    } catch (err) {}
}


// Export public API
module.exports = {
    get: getAllBlogs,
    getBlog: getBlog,
    update: updateBlog,
    add: addBlog,
    delete: deleteBlog
};


