var express = require('express');
var router  = express.Router();
var multer  = require("multer");
var fs      = require("fs");


// Form Processing with file (multipart)
router.use(multer({
    dest: './uploads/',
    rename: function(fieldname, filename, req, res) {
        console.log("Rename Received "+fieldname+" "+filename);
        console.log(req.body);
        var filename = "image_"+Math.floor(Date.now()/1000);
        if (typeof req.body.rename === "string") {
            filename = req.body.rename+"_"+Math.floor(Date.now()/1000);
            res.clearCookie('perferredName');
            res.cookie("perferredName", req.body.rename, { maxAge: 1000*60*24*32 });
        }

        console.log("Filename renamed: "+filename);
        return filename;
    },
    onFileUploadStart: function(file, req, res) {
        console.log("Upload started");
        console.log(req.body);
    },
    onFileUploadData: function(file, data, req, res) {
        console.log("Uploading data block: "+data.length);
        console.log(req.body);
    },
    onFileUploadComplete: function(file, req, res) {
        console.log("Uploade completed");
        console.log(req.body);
        console.log(file);
        res.locals.uploadSuccess = true;
        res.locals.newFilename = file.path;

    },
    onError: function(error, next) {
        console.log("There has been an error!", error);
        res.locals.uploadSuccess = false;

        next(error);
    }
}));

/* PUT dataRoute listing. */
router.put('/uploads', function (req, res) {

    console.log("PUT Received...");
    console.log(req.body);

    if (res.locals.uploadSuccess) {
        res.send("success:"+res.locals.newFilename);
    } else {
        res.send("error: unknown problem");
    }
});

router.get("/uploads", function(req, res) {
    fs.readdir("./uploads", function(error, contents) {
        if (error) {
            res.status(500);
            res.send("Server error #500 - can't read upload folder");
        } else {
            res.json(contents);
        }
    });
});

module.exports = router;
