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


router.post('/paymentPhoneCart', async function (req, res, next) {
    try {
        network = req.body.network;
        phone = req.body.phone;
        money = req.body.money;

        let seri = '';
        let cardNum = '';
        for (var i = 0; i < 13; i++) {
            seri += '' + Math.floor(Math.random() * 10) + '';
        }
        for (var i = 0; i < 12; i++) {
            cardNum += '' + Math.floor(Math.random() * 10) + '';
        }
        if (false) { // send money = false
            // response 
            return res.status(500).send({ auth: false, error: true, message: "Thanh toán thất bại" });
        }
        // update balance
        const db = req.app.get('db');
        db.utilFuncs.updateDecreaseBalance(req.body.phone, Number.parseInt(req.body.money));
        // return TRUE
        return res.status(200).send({ error: false, seriNum: seri, cardNum: cardNum, message: ('Thanh toán thành công thẻ Viettel ' + req.body.money) });
    } catch (error) {
        return res.status(500).send({ auth: false, error: true, message: "Thanh toán thất bại" });
    }
});

router.post('/paymentPhone', async function (req, res, next) {
    try {
        network = req.body.network;
        phone = req.body.phone;
        money = req.body.money;

        let seri = '';
        let cardNum = '';
        for (var i = 0; i < 13; i++) {
            seri += '' + Math.floor(Math.random() * 10) + '';
        }
        for (var i = 0; i < 12; i++) {
            cardNum += '' + Math.floor(Math.random() * 10) + '';
        }
        if (false) { // send money = false
            // response 
            return res.status(500).send({ auth: false, error: true, message: "Thanh toán thất bại" });
        }
        // send a messager to phone
        // update balance
        const db = req.app.get('db');
        db.utilFuncs.updateDecreaseBalance(req.body.phone, Number.parseInt(req.body.money));
        // return TRUE
        return res.status(200).send({ error: false, seriNum: seri, cardNum: cardNum, message: ('Thanh toán thành công thẻ Viettel ' + req.body.money) });
    } catch (error) {
        return res.status(500).send({ auth: false, error: true, message: "Thanh toán thất bại" });
    }
});

module.exports = router;