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
        try {
            await db.usersettings.UpdateUsers(req.body.phone, req.body.email, req.body.password, req.body.accountName, req.body.identification, req.body.sex, req.body.address, req.body.birthday);
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

//http://localhost:8080/api/user/GetUserInfos/
//{
//    "phone": "0999999999"
//}
router.post('/GetUserInfos', async function (req, res) {
    try {
        const db = req.app.get('db');
        const result = await db.usersettings.GetUserInfos(req.body.phone);
        var sample = new Array();
        sample.push(
            new Object({
                username: result.recordset[0].CustomerName,
                accountName: result.recordset[0].AccountName,
                password: result.recordset[0].Password,
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
            console.log("GetUserInfos");
            res.status(200).send({ auth: true, error: false, data: sample });
        } else {
            return res.status(500).send({ auth: false, error: true, errmessage: "some error2!" });
        }
    } catch (error) {
        return res.status(500).send({ auth: false, error: true, errmessage: "some error1!" });
    }
});

// http://localhost:8080/api/user/GetLanguage/
router.post('/GetLanguage', async function (req, res, next) {
    console.log("Begin GetLanguage");
    try {
        const db = req.app.get('db');
        const result = await db.utilFuncs.getLanguage(req.body.phone);
        return res.status(200).send({ auth: true, error: false, data: result.recordsets[0] });
    } catch (error) {
        return res.status(500).send({ auth: false, error: true, errmessage: "Connect database failed" });
    }
});

// http://localhost:8080/api/user/UpdateLanguage/
router.post('/UpdateLanguage', async function (req, res, next) {
    try {
        const db = req.app.get('db');
        await db.utilFuncs.updateLanguage(req.body.phone, req.body.language);
        return res.status(200).send({ auth: true, error: false});
    } catch (error) {
        return res.status(500).send({ auth: false, error: true, errmessage: "Connect database failed" });
    }
});
module.exports = router;