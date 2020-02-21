var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var utils = require('../utils');
var blacklist = require('../utils/wrongpass');
var sendemail = require('../utils/sendemail');
var buycard = require('../utils/buyCard');

var otp = require('../utils/otp')

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

/**
 * Configure JWT
 */
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);
var config = require('../../config'); // get config file

router.post('/login', async function (req, res) {
  try {
    const db = req.app.get('db');
    //check is in black list
    let dataBlackList = await blacklist.isInBlackList(req.body.phone)
    if (dataBlackList !== null) {
      return res.status(200).send({ auth: false, error: 'blacklist', data: dataBlackList });
    }
    // const result = bcrypt.compareSync('my password', hash)
    const result = await db.accounts.auth(req.body.phone);
    if (result.recordset.length > 0) {
      console.log(result.recordset[0].Password + ' ' + req.body.password)
      let check = await bcrypt.compareSync(req.body.password, result.recordset[0].Password);
      //check this user alredy has 3 different device
      console.log(check)
      if (check) {
        const info = await db.accounts.getInfo(req.body.phone);
        if (info.recordset.length > 0) {
          var token = jwt.sign({ phone: req.body.phone }, config.secret, {
            expiresIn: '1h' // expires in 24 hours
          });
          //update last login date
          const uniqueID = req.body.uniqueID;
          const accountID = info.recordset[0].AccountID
          await db.accounts.updateLoginTime(accountID, uniqueID)
          //delete in black list
          await blacklist.deletePhone(req.body.phone);
          delete result.recordset[0]['Password']
          res.status(200).send({ auth: true, token: token, error: false,data :result.recordset[0] });
        }
      }
      else res.status(200).send({ auth: false, token: null, error: true, errmessage: "Some error when get information. Please try again later!" });
    } else {
      return res.status(200).send({ auth: false, token: null, error: true, errmessage: "User or password wrong" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ auth: false, token: null, error: true, errmessage: error });
  }
});
router.post('/addblacklist', async function (req, res) {
  try {

    let data = await blacklist.addIntoBlackList(req.body.phone)
    return res.status(200).send({ success: true, data: data.expireTime.valueOf() });
  } catch (error) {
    return res.status(500).send({ success: false });
  }
});
router.post('/sendnewpassword', async function (req, res) {
  try {
    const newpassword = otp.random6Digits();

    let data = await sendemail.sendMail('lekhangcaltex0811@gmail.com', 'Mat khau moi cua ban la' + newpassword)
    console.log(req.body.phone)
    console.log(data)
    if (data) {
      const db = req.app.get('db');
      let result = await db.accounts.updatePassword(req.body.phone, newpassword);
      if (result.rowsAffected[0] > 0) {
        return res.status(200).send({ success: true, data: newpassword });
      }
    } else return res.status(200).send({ success: false, data: newpassword });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false });
  }
});

//check current phone is limit ( the logined phone is not exceed 3)
router.post('/checkuser', async function (req, res, next) {
  try {

    //     var waitTill = new Date(new Date().getTime() + 3* 1000);
    // while(waitTill > new Date()){}
    const db = req.app.get('db');
    const result = await db.accounts.getInfo(req.body.phone);
    if (result.recordset.length > 0) {
      const uniqueID = req.body.uniqueID;
      const nameDevice = req.body.nameDevice;
      const accountID = result.recordset[0].AccountID
      const listDevices = await db.accounts.getListDevices(accountID);
      //check number of devices in  db
      if (listDevices.recordset.length <= 3) {
        for (var i = 0; i < listDevices.recordset.length; i++) {
          var obj = listDevices.recordset[i];
          if (uniqueID === obj.UniqueID) {
            return res.status(200).send({ exist: true, error: false, limit: false });
          }
        }
        if (listDevices.recordset.length < 3) {
          const resultAdd = await db.accounts.addDevices(accountID, uniqueID, nameDevice);
          //add device successful
          if (resultAdd.rowsAffected[0] == 1)
            return res.status(200).send({ exist: true, error: false, limit: false });
        }
      }
      //if not
      let data = new Array();
      for (let i = 0; i < listDevices.recordset.length; i++) {
        data.push(
          new Object({
            key: listDevices.recordset[i].UniqueID,
            name: listDevices.recordset[i].DeviceName,
            time: listDevices.recordset[i].LastLoginDate
          })
        );
      }
      console.log(data)
      return res.status(200).send({ exist: true, error: false, limit: true, data: data });
    } else {
      return res.status(200).send({ exist: false, error: true });
    }

  } catch (error) {
    console.log(error);
    return res.status(500).send({ exist: false, error: false, error: true, errmessage: error });
  }
});

//delete devices
router.post('/removedevice', async function (req, res) {
  try {
    const db = req.app.get('db');
    let result = await db.accounts.removeDevice(req.body.phone, req.body.uniqueID)
    console.log(req.body)
    if (result.rowsAffected[0] == 1)
      return res.status(200).send({ success: true });
    else return res.status(200).send({ success: false });
  } catch (error) {
    return res.status(500).send({ error: true, errmessage: error });
  }
});

//request OTP
router.post('/requestotp', async function (req, res, next) {

  try {
    // var waitTill = new Date(new Date().getTime() + 12 * 1000);
    // while (waitTill > new Date()) { }
    let numberPhone = req.body.phone.replace('0', '84');
    let uniqueID = req.body.deviceId;

    let otpdata = await otp.createOTP(uniqueID, numberPhone);

    console.log(otpdata.otp)
    if (otpdata) {
      return res.status(200).send({ createOTP: true });
    }
    return res.status(200).send({ createOTP: false });

  } catch (error) {
    return res.status(500).send({ exist: false, error: true, errmessage: error });
  }
});

//check OTP
router.post('/checkotp', async function (req, res, next) {

  try {
    // var waitTill = new Date(new Date().getTime() + 4 * 1000);
    // while (waitTill > new Date()) { }
    let numberPhone = req.body.phone.replace('0', '84');
    let uniqueID = req.body.uniqueID;
    let OTP = req.body.otp;

    console.log(OTP);
    console.log(req.body)
    let result;
    await otp.verifyOTP(numberPhone, uniqueID, OTP).then(response => { result = response });
    console.log(result)
    if (result) {
      const db = req.app.get('db');
      const getName = await db.accounts.getInfo(req.body.phone);
      let nameAccount = null;
      if (getName.recordset.length > 0)
        nameAccount = getName.recordset[0].AccountName
      return res.status(200).send({ exist: true, error: false });
    } else {
      return res.status(200).send({ exist: false, error: false });
    }
  } catch (error) {
    return res.status(500).send({ exist: false, error: true });
  }
});

router.post('/getinfo', utils.verifyToken, async function (req, res, next) {
  try {
    const db = req.app.get('db');
    const result = await db.accounts.getInfo(req.body.phone);
    if (result.recordset.length > 0) {
      res.status(200).send({ auth: true, error: false, data: result.recordset[0] });
    } else {
      return res.status(500).send({ auth: false, error: true, errmessage: "some error!" });
    }
  } catch (error) {
    return res.status(500).send({ auth: false, error: true, errmessage: error });
  }
});
//get name user
router.post('/getnameuser', async function (req, res, next) {
  try {
    const db = req.app.get('db');
    const result = await db.accounts.getInfo(req.body.phone);
    if (result.recordset.length > 0) {
      let data = result.recordset[0].AccountName
      res.status(200).send({ error: false, data: data });
    } else {
      return res.status(200).send({ error: true });
    }
  } catch (error) {
    return res.status(500).send({ error: true, errmessage: error });
  }
});

//check password
router.post('/checkpass', async function (req, res, next) {

  try {
    const db = req.app.get('db');
    const result = await db.accounts.auth(req.body.phone, req.body.pass);
    console.log(req.body.pass);
    console.log(req.body.phone);
    if (result.recordset.length > 0) {
      return res.status(200).send({ login: true, error: false });
    } else {
      return res.status(200).send({ login: false });
    }
  } catch (error) {
    return res.status(500).send({ auth: false, error: true, errmessage: error });
  }
});


router.post('/adduser', async function (req, res, next) {
  try {
    const db = req.app.get('db');
    let cryptedPass = await bcrypt.hash(req.body.password, salt)
    console.log(cryptedPass + ' ' + cryptedPass.length)
    const result = await db.accounts.addUser(req.body, cryptedPass);
    if (result.recordset.length > 0) {
      const info = await db.accounts.getInfo(req.body.phone);
      if (info.recordset.length > 0) {
        var token = jwt.sign({ phone: req.body.phone }, config.secret, {
          expiresIn: '10s'  //86400 // expires in 24 hours
        });
        res.status(200).send({ auth: true, token: token, error: false, data: info.recordset[0] });
      }
      else res.status(200).send({ auth: false, token: null, error: true, errmessage: "Some error when get information. Please try again later!" });
    } else {
      return res.status(200).send({ auth: false, token: null, error: true, errmessage: "Some error when get information. Please try again later!" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ auth: false, token: null, error: true, errmessage: error });
  }
});

module.exports = router;