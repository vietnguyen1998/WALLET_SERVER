var app = require('./app');
var port = process.env.PORT || 3000;

app.use(function (req, res, next) {
    //Enabling CORS 
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
    next();
});

var server = app.listen(port, function () {
    console.log('Express server listening on port ' + port);
});


// upload image
const express = require('express');
const fs = require('fs');
const formidableMiddleware = require('express-formidable');
app.use(formidableMiddleware({ uploadDir: './public' }));
app.post('/upload', async (req, res) => {
    console.log("begin update image...")
    fs.rename(req.files.avatar.path, req.files.avatar.path + '.jpg', err => {
        res.send('Upload Failed');
    });
    console.log("rename image...");
    try {
        const db = req.app.get('db');
        var image = '/' + req.files.avatar.path + '.jpg';
        try {
            await db.usersettings.UpdateImg(image, req.fields.info);
        res.status(200).send({ auth: true, error: false, image: image });
        } catch (e) {
            //   return res.status(500).send({ auth: false, error: true, errmessage: "some error2!" });
        }
        console.log("return image...")
    } catch (error) {
        // return res.status(500).send({ auth: false, error: true, errmessage: "error" });
    }
});

// static folder
app.use('/public', express.static('public'))