var express = require('express');
var app = express();
global.__root   = __dirname + '/'; 
const conFigFile = require(__root + '/config.js');
const client = require(__root + 'src/database/index.js');

const setupSQL = async () => {
  const msSQL = await client(conFigFile.sql);
  app.set('db', msSQL);
  console.log(conFigFile.sql);
}

setupSQL();

app.get('/', function (req, res) {
  res.status(200).send('API works.');
});

app.get('/api', function (req, res) {
  res.status(200).send('API works.');
});

var AuthController = require(__root + 'src/auth/AuthController');
app.use('/api/auth', AuthController);

module.exports = app;