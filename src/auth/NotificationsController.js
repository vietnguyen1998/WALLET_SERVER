﻿var express = require('express');
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

router.post('/getNotifications', async function (req, res, next) {
    try {
        const db = req.app.get('db');
        const result = await db.notifications.getNotifications(req.body.phone);
        var sample = new Array();
        for (var i = 0; i < result.recordset.length; i++) {
            sample.push(
                new Object({
                    groupID: result.recordset[i].GroupID,
                    title: result.recordset[i].Title,
                    description: result.recordset[i].Description,
                    dateStart: result.recordset[i].DateStart,
                    dateEnd: result.recordset[i].DateEnd,
                    image: result.recordset[i].Image,
                    status: result.recordset[i].Status
                })
            );
        }
        res.status(200).send({ auth: true, error: false, data: sample });
        console.log("getNotifications");
    } catch (error) {
        return res.status(500).send({ auth: false, error: true, errmessage: "some error1!" });
    }
});


router.post('/getTransactions', async function (req, res, next) {
    try {
        console.log("begin get transtion...");
        const db = req.app.get('db');
        const result = await db.notifications.getTransactions(req.body.phone);
        var sample = new Array();
        for (var i = 0; i < result.recordset.length; i++) {
            sample.push(
                new Object({
                    key: i,
                    type: result.recordset[i].OtherInformation,
                    time: result.recordset[i].CreateDate,
                    status: result.recordset[i].Status,
                    branch: result.recordset[i].SourceBalance,
                    value: result.recordset[i].Amount,
                    infomationServices: result.recordset[i].InfomationServices,
                    content: result.recordset[i].Content,
                    transactionFee: result.recordset[i].TransactionFee,
                    servicesID: result.recordset[i].ServicesID,
                    accountID: result.recordset[i].AccountID,
                    transactionID: result.recordset[i].TransactionID,
                })
            );
        }
        console.log("get transtion successfully");
        console.log(sample);
        res.status(200).send({ auth: true, error: false, data: sample });
    } catch (error) {
        console.log("get transtion error");
        return res.status(500).send({ auth: false, error: true, errmessage: "some error1!" });
    }
});

router.post('/getBankNames', async function (req, res, next) {
    try {
        const db = req.app.get('db');
        const result = await db.notifications.getBankNames(req.body.phone);
        var sample = new Array();
        sample.push({ key: 0, name: "me" });

        for (var i = 0; i < result.recordset.length; i++) {
            sample.push({ key: (i + 1), name: result.recordset[i].BankName });
        }

        res.status(200).send({ auth: true, error: false, data: sample });
        console.log("getBankNames TRUE");
    } catch (error) {
        return res.status(500).send({ auth: false, error: true, errmessage: "some error1!" });
    }
});

router.post('/getNotifications2', async function (req, res, next) {
    try {
        const db = req.app.get('db');
        //result = await db.utilFuncs.updateIncreaseBalance(req.body.phone, 100);
        //result = await db.utilFuncs.updateDecreaseBalance(req.body.phone, 100);
        const result = await db.utilFuncs.addTransaction(req.body.phone, 22, "BIDV", 22, 22, "22", "22", "recharge", 1);
        return res.status(200).send({ auth: true, error: false, data: result });
    } catch (error) {
        return res.status(500).send({ auth: false, error: true, errmessage: "some error" });
    }
});

router.post('/getAccountInfo', async function (req, res, next) {
    try {
        const db = req.app.get('db');
        const result = await db.utilFuncs.getAccountInfo(req.body.phone);
        return res.status(200).send({ auth: true, error: false, data: result.recordset[0] });
    } catch (error) {
        return res.status(500).send({ auth: false, error: true, errmessage: "some error" });
    }
});
module.exports = router;