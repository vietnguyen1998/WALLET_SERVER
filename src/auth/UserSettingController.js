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

router.post('/UpdateUsers', async function (req, res, next) {
    try {
        const db = req.app.get('db');
        console.log(req.body.phone)
        console.log(req.body.email)
        console.log(req.body.identification)
        console.log(req.body.sex)
        console.log(req.body.address)
        console.log(req.body.birthday)
        try {
            await db.usersettings.UpdateUsers(req.body.phone, req.body.email,req.body.identification,  req.body.sex, req.body.address, req.body.birthday);
        } catch (e) {
            return res.status(500).send({ auth: false, error: true, errmessage: "Not updated" });
        }
        return res.status(200).send({ auth: true, error: false });
    } catch (error) {
        return res.status(500).send({ auth: false, error: true, errmessage: "Connect database failed" });
    }
});


router.get('/getUserSettingInfomation', async function (req, res) {
    try {
        const db = req.app.get('db');
        var sample = new Array();
        const result = await db.promotions.PromotionInfo();
        res.send('getUserInfomation');
        if (result.recordset.length > 0) {
            res.status(200).send({ auth: true, error: false, data: sample });
        } else {
            return res.status(500).send({ auth: false, error: true, errmessage: "some error2!" });
        }
    } catch (error) {
        return res.status(500).send({ auth: false, error: true, errmessage: "some error1!" });
    }
});

router.post('/GetUserInfos', async function (req, res) {
    try {
        const db = req.app.get('db');
        const result = await db.usersettings.GetUserInfos(req.body.phone);
        var sample = new Array();
        sample.push(
            new Object({
                username: result.recordset[0].CustomerName,
                phone: result.recordset[0].Phone,
                email: result.recordset[0].Email,
                status: result.recordset[0].Status,
                sex: result.recordset[0].Sex,
                identification: result.recordset[0].Identification,
                address: result.recordset[0].Address,
                birthday: result.recordset[0].Birthday,
                image: result.recordset[0].Image,
            })
        );
        if (result.recordset.length > 0) {
            res.status(200).send({ auth: true, error: false, data: sample });
        } else {
            return res.status(500).send({ auth: false, error: true, errmessage: "some error2!" });
        }
    } catch (error) {
        return res.status(500).send({ auth: false, error: true, errmessage: "some error1!" });
    }
});

module.exports = router;