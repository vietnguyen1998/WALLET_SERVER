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
        let network = req.body.network;
        let phone = req.body.phone;
        let money = req.body.money;

        let seri = '';
        let cardNum = '';
        for (var i = 0; i < 13; i++) {
            seri += '' + Math.floor(Math.random() * 10) + '';
        }
        for (var i = 0; i < 12; i++) {
            cardNum += '' + Math.floor(Math.random() * 10) + '';
        }
        
        // error
        //if (!utils.checkSendMoneyToAnother(req.body.money)) { // send money = false
            // response 
            //return res.status(500).send({ auth: false, error: true, message: "Thanh toán thất bại" });
        //}

        // update balance
        const db = req.app.get('db');
        db.utilFuncs.updateDecreaseBalance(req.body.phone, Number.parseInt(req.body.money));

        // add transaction
        await db.utilFuncs.addTransaction(req.body.phone, 'Phone01', network, Number.parseInt(req.body.money), 0, "Thanh toán", "Mua thẻ điện thoại", "paidCardPhone", 2);

        // get ID
        var returnTransactionID = await db.utilFuncs.getIDTransaction(req.body.phone);
        console.log(returnTransactionID)
        // return TRUE
        console.log('paymentPhoneCart TRUE')
        let data = {
            seriNum: seri,
            cardNum: cardNum,
            message: ('Thanh toán thành công thẻ Viettel ' + money),
            money: money,
            phone: phone,
            network: network,
            transaction: returnTransactionID.recordset[0].TransactionID
        }
        return res.status(200).send({ error: false, data: data });
    } catch (error) {
        db.utilFuncs.addTransaction(req.body.phone, 'Phone01', network, Number.parseInt(req.body.money), 0, "Thanh toán", "Mua thẻ điện thoại", "paidCardPhone", 0);
        return res.status(500).send({ auth: false, error: true, message: "Server error" });
    }
});

router.post('/paymentPhone', async function (req, res, next) {
    try {
        network = req.body.network;
        phone = req.body.phone;
        phoneSend = req.body.phoneSend;
        money = req.body.money;
        //console.log(network);
        //console.log(phone);
        //console.log(money);
        let seri = '';
        let cardNum = '';
        for (var i = 0; i < 13; i++) {
            seri += '' + Math.floor(Math.random() * 10) + '';
        }
        for (var i = 0; i < 12; i++) {
            cardNum += '' + Math.floor(Math.random() * 10) + '';
        }

        // error
        //if (utils.checkSendMoneyToAnother(100)) { // send money = false
            // response 
            //return res.status(500).send({ auth: false, error: true, message: "Thanh toán thất bại" });
        //}

        console.log(phone);

        // send a messager to phone use phoneSend
        // to do

        // update balance
        const db = req.app.get('db');
        db.utilFuncs.updateDecreaseBalance(req.body.phone, Number.parseInt(req.body.money));

        // add transaction
        db.utilFuncs.addTransaction(req.body.phone, null, "VinaPhone", Number.parseInt(req.body.money), 0, "Thanh toán", "Mua thẻ điện thoại", "paidCardPhone", 1);

        // return TRUE
        console.log('paymentPhones TRUE')
        let data = {
            seriNum: seri,
            cardNum: cardNum,
            message: ('Thanh toán thành công thẻ điện thoại ' + money),
            money: money,
            phone: phone,
            network: network,
            phoneSend: phoneSend
        }
        return res.status(200).send({ error: false, data: data });
    } catch (error) {
        return res.status(500).send({ auth: false, error: true, message: "Server error" });
    }
});

module.exports = router;