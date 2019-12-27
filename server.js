var app = require('./app');
var port = process.env.PORT || 3000;

app.use(function (req, res, next) {
  //Enabling CORS 
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
  next();
});

var server = app.listen(port, function() {
  console.log('Express server listening on port ' + port);
});


// upload image
const express = require('express');
const fs = require('fs');
const formidableMiddleware = require('express-formidable');
app.use(formidableMiddleware({ uploadDir: './public' }));
app.post('/upload', (req, res) => {
    fs.rename(req.files.avatar.path, req.files.avatar.path + '.jpg', err => {
        res.send('Upload Failed')
    });
});

// static folder
app.use('/public', express.static('public'))