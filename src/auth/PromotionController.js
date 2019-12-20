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

router.get('/getPromotionInfo', async function(req, res, next) {
  try {
    console.log("1")

    const db = req.app.get('db');
    console.log("2")

    const result = await db.promotions.PromotionInfo();
    console.log("3")

    if(result.recordset.length > 0){
      res.status(200).send({ auth: true, error: false, data: result.recordset[0] });
    }else{
      return res.status(500).send({ auth: false, error: true, errmessage: "some error2!" });
    }
  } catch (error) {
    return res.status(500).send({ auth: false, error: true, errmessage: "some error1!" });
  }
});

module.exports = router;