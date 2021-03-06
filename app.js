var express = require('express');
var app = express();
const rateLimit = require("express-rate-limit");

global.__root   = __dirname + '/'; 
const conFigFile = require(__root + '/config.js');
const client = require(__root + 'src/database/index.js');


const timeCheckWasteOTP =1000 *10 ;//10s
var otp= require(__root +'src/utils/otp.js');
var blacklistPhone= require(__root +'src/utils/wrongpass.js');

const setupSQL = async () => {

  const msSQL = await client(conFigFile.sql);
  app.set('db', msSQL);
  console.log(conFigFile.sql);
  
}

setupSQL();
setInterval(otp.cleanUpStore,timeCheckWasteOTP);
setInterval(blacklistPhone.cleanUpStore,1000);


app.get('/', function (req, res) {
  res.status(200).send('API works.');
});


app.use('/img/bankimg', express.static('./public/bank_image'))

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 15 // limit each IP to 15 requests per windowMs
});

app.get('/api',limiter, function (req, res) {
  res.status(200).send('API works.');
});

var AuthController = require(__root + 'src/auth/AuthController');
app.use('/api/auth', AuthController);


var PromotionController = require(__root + 'src/auth/PromotionController');
app.use('/api/promotion', PromotionController);

var UserSettingController = require(__root + 'src/auth/UserSettingController');
app.use('/api/user', UserSettingController);

var UserSettingController = require(__root + 'src/auth/AuthMoney');
app.use('/api/paymoney', UserSettingController);


var NotificationsController = require(__root + 'src/auth/NotificationsController');
app.use('/api/notifications', NotificationsController);

var PhoneController = require(__root + 'src/auth/PhoneController');
app.use('/api/phone', PhoneController);

var WaterOtherController = require(__root + 'src/auth/WaterOtherController');
app.use('/api/water', WaterOtherController);

var ReceiveTransfer = require(__root + 'src/auth/ReceiveTransferController');
app.use('/api/receivetrans', ReceiveTransfer);

module.exports = app;