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
    console.log("begin update image...", req.files.avatar.path)
    fs.rename(req.files.avatar.path, req.files.avatar.path + '.jpg', err => {
        if (err == null) {
            try {
                var image = '/' + req.files.avatar.path + '.jpg';
                const db = req.app.get('db');
                db.usersettings.UpdateImg(image, req.fields.info);
                return res.status(200).send({ auth: true, error: false, imgUrl: image });
            } catch (error) {
                return res.status(500).send({ auth: false, error: true });
            }
        }
    });
});

// static folder
app.use('/public', express.static('public'))