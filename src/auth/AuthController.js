var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var utils = require('../utils');

var otp = require('../utils/otp')

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

/**
 * Configure JWT
 */
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var bcrypt = require('bcryptjs');
var config = require('../../config'); // get config file

router.post('/login', async function (req, res) {
  try {
    const db = req.app.get('db');
    console.log(req.body.phone + req.body.password);
    const result = await db.accounts.auth(req.body.phone, req.body.password);
    if (result.recordset.length > 0) {
      const info = await db.accounts.getInfo(req.body.phone);
      if (info.recordset.length > 0) {
        var token = jwt.sign({ phone: req.body.phone }, config.secret, {
          expiresIn: 86400 // expires in 24 hours
        });
        res.status(200).send({ auth: true, token: token, error: false, data: info.recordset[0] });
      }
      else res.status(200).send({ auth: false, token: null, error: true, errmessage: "Some error when get information. Please try again later!" });
    } else {
      return res.status(200).send({ auth: false, token: null, error: true, errmessage: "User or password wrong" });
    }
  } catch (error) {
    return res.status(500).send({ auth: false, token: null, error: true, errmessage: error });
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
      const accountID = result.recordset[0].AccountID
      const listDevices = await db.accounts.getListDevices(accountID);
      //check number of devices in  db
      if (listDevices.recordset.length <= 3) {

        for (var i = 0; i < listDevices.recordset.length; i++) {
          var obj = listDevices.recordset[i];

          if (uniqueID == obj.UniqueID) {
            return res.status(200).send({ exist: true, error: false, limit: false });
          }
        }
        const resultAdd = await db.accounts.addDevices(accountID, uniqueID);

        //add device successful
        if (resultAdd.rowsAffected == 1)
          return res.status(200).send({ exist: true, error: false, limit: false });
      }
      return res.status(200).send({ exist: true, error: false, limit: true });
    } else {
      return res.status(200).send({ exist: false, error: false });
    }

  } catch (error) {
    return res.status(500).send({ exist: false, error: false, error: true, errmessage: error });
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
router.post('/getnameuser',  async function (req, res, next) {
  try {
    const db = req.app.get('db');
    const result = await db.accounts.getInfo(req.body.phone);
    if (result.recordset.length > 0) {
      let data= result.recordset[0].AccountName 
      res.status(200).send({ error: false, data: data});
    } else {
      return res.status(200).send({ error: true});
    }
  } catch (error) {
    return res.status(500).send({  error: true, errmessage: error });
  }
});

//check password
router.post('/checkpass', async function (req, res, next) {

  try {
    const db = req.app.get('db');
    const result = await db.accounts.auth(req.body.phone,req.body.pass);
      console.log(req.body.pass);
      console.log(req.body.phone);
    if (result.recordset.length > 0) {
     return res.status(200).send({ login:true,error: false });
    } else {
      return res.status(200).send({ login:false });
    }
  } catch (error) {
    return res.status(500).send({ auth: false, error: true, errmessage: error });
  }
});


router.post('/adduser', async function (req, res, next) {
  try {
    const db = req.app.get('db');
    const result = await db.accounts.addUser(req.body);
    if (result.recordset.length > 0) {
      const info = await db.accounts.getInfo(req.body.phone);
      if (info.recordset.length > 0) {
        var token = jwt.sign({ phone: req.body.phone }, config.secret, {
          expiresIn: 86400  //86400 // expires in 24 hours
        });
        res.status(200).send({ auth: true, token: token, error: false, data: info.recordset[0] });
      }
      else res.status(200).send({ auth: false, token: null, error: true, errmessage: "Some error when get information. Please try again later!" });
    } else {
      return res.status(200).send({ auth: false, token: null, error: true, errmessage: "Some error when get information. Please try again later!" });
    }
  } catch (error) {
    return res.status(500).send({ auth: false, token: null, error: true, errmessage: error });
  }
});

module.exports = router;