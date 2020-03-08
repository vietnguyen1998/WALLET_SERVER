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

router.get('/getPromotionInfo', async function (req, res, next) {
    try {
        const db = req.app.get('db');
        var sample = new Array();
        const result = await db.promotions.PromotionInfo();
        for (var i = 0; i < result.recordset.length; i++) {
            sample.push(
                new Object({
                    title: result.recordset[i].Title,
                    subtitle: result.recordset[i].ShortDescription,
                    illustration: result.recordset[i].Image,
                    description: result.recordset[i].Description,
                })
            );
        }
        if (result.recordset.length > 0) {
            res.status(200).send({ auth: true, error: false, data: sample });
        } else {
            return res.status(500).send({ auth: false, error: true, errmessage: "some error2!" });
        }
    } catch (error) {
        return res.status(500).send({ auth: false, error: true, errmessage: "some error1!" });
    }
});

router.get('/getPromotionInfoNew', async function (req, res, next) {
    try {
        const db = req.app.get('db');
        var sample = new Array();
        const result = await db.promotions.PromotionInfoNew();
        console.log(result);
        for (var i = 0; i < result.recordset.length; i++) {
            sample.push(
                new Object({
                    title: result.recordset[i].Title,
                    subtitle: result.recordset[i].ShortDescription,
                    illustration: result.recordset[i].Image,
                    description: result.recordset[i].Description,
                })
            );
        }
        res.status(200).send({ auth: true, error: false, data: sample });
    } catch (error) {
        return res.status(500).send({ auth: false, error: true, errmessage: "some error1!" });
    }
});

// http://localhost:8080/api/promotion/CheckCode
router.post('/CheckCode', async function (req, res, next) {
    console.log("begin check code...");
    try {
        const db = req.app.get('db');
        console.log("return check code...");
        const result = await db.promotions.CheckCode(req.body.code);
        res.status(200).send({ auth: true, error: false, data: result.recordsets[0] });
    } catch (error) {
        console.log("return catch check code...");
        return res.status(500).send({ auth: false, error: true, errmessage: "some error1!" });
    }
});

module.exports = router;