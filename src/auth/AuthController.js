var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var utils = require('../utils');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

/**
 * Configure JWT
 */
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var bcrypt = require('bcryptjs');
var config = require('../../config'); // get config file

router.post('/login',async function(req, res) {
  try {
    const db = req.app.get('db');
    console.log(req.body.phone +   req.body.password);
    const result = await db.accounts.auth( req.body.phone,  req.body.password );
    if(result.recordset.length > 0){
      const info = await db.accounts.getInfo(req.body.phone);
      if(info.recordset.length > 0){
        var token = jwt.sign({ phone: req.body.phone }, config.secret, {
          expiresIn: 86400 // expires in 24 hours
        });
        res.status(200).send({ auth: true, token: token, error: false, data: info.recordset[0] });
      }
      else res.status(200).send({ auth: false, token: null, error: true, errmessage: "Some error when get information. Please try again later!" });
    }else{
      return res.status(200).send({ auth: false, token: null, error: true, errmessage: "User or password wrong" });
    }
  } catch (error) {
    return res.status(500).send({ auth: false, token: null, error: true, errmessage: error });
  }
});

router.post('/checkuser', async function(req, res, next) {
  try {
    const db = req.app.get('db');
    const result = await db.accounts.getInfo(req.body.phone);
    if(result.recordset.length > 0){
      res.status(200).send({ exist: true, error: false });
    }else{
      return res.status(200).send({ exist: false, error: false });
    }
  } catch (error) {
    return res.status(500).send({ exist: true, error: false, error: true, errmessage: error });
  }
});

router.post('/getinfo', utils.verifyToken, async function(req, res, next) {
  try {
    const db = req.app.get('db');
    const result = await db.accounts.getInfo(req.body.phone);
    if(result.recordset.length > 0){
      res.status(200).send({ auth: true, error: false, data: result.recordset[0] });
    }else{
      return res.status(500).send({ auth: false, error: true, errmessage: "some error!" });
    }
  } catch (error) {
    return res.status(500).send({ auth: false, error: true, errmessage: error });
  }
});


router.post('/adduser', async function(req, res, next) {
  try {
    const db = req.app.get('db');
    const result = await db.accounts.addUser(req.body);
    if(result.recordset.length > 0){
      const info = await db.accounts.getInfo(req.body.phone);
      if(info.recordset.length > 0){
        var token = jwt.sign({ phone: req.body.phone }, config.secret, {
          expiresIn: 86400  //86400 // expires in 24 hours
        });
        res.status(200).send({ auth: true, token: token, error: false, data: info.recordset[0]});
      }
      else res.status(200).send({ auth: false, token: null, error: true, errmessage: "Some error when get information. Please try again later!" });
    }else{
      return res.status(200).send({ auth: false, token: null, error: true, errmessage: "Some error when get information. Please try again later!" });
    }
  } catch (error) {
    return res.status(500).send({ auth: false, token: null, error: true, errmessage: error });
  }
});

module.exports = router;