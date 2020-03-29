var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var utils = require('../utils');
var buyCard = require('../utils/buyCard');

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
        // rea
        console.log("begin paymentPhoneCart...")
        let network = req.body.network;
        let phone = req.body.phone;
        let money = req.body.money;
        let keySource = req.body.keySource;

        // sent money bank
        //if (!utils.checkSendMoneyToAnother(req.body.money)) { // send money = false
        // response 
        //return res.status(500).send({ auth: false, error: true, message: "Thanh toán thất bại" });
        //}

        // update balance
        const db = req.app.get('db');
        if (keySource == 0) {
            db.utilFuncs.updateDecreaseBalance(req.body.phone, Number.parseInt(req.body.money));
            console.log("updating balance...")
        }

        // add transaction
        await db.utilFuncs.addTransaction(req.body.phone, 'Phone01', network, Number.parseInt(req.body.money), 0, "Thanh toán", "Mua thẻ điện thoại", "paidCardPhone", 2);
        console.log("adding transaction...")

        // res
        let seri = '';
        let cardNum = '';
        var i;
        for (i = 0; i < 13; i++) {
            seri += '' + Math.floor(Math.random() * 10) + '';
        }
        for (i = 0; i < 12; i++) {
            cardNum += '' + Math.floor(Math.random() * 10) + '';
        }

        let data = {
            seriNum: seri,
            cardNum: cardNum,
            message: ('Thanh toán thành công thẻ Viettel ' + money),
            money: money,
            phone: phone,
            network: network,
        }
        console.log("return result...")
        return res.status(200).send({ error: false, data: data });
    } catch (error) {
        db.utilFuncs.addTransaction(req.body.phone, 'Phone01', network, Number.parseInt(req.body.money), 0, "Thanh toán", "Mua thẻ điện thoại", "paidCardPhone", 0);
        return res.status(500).send({ auth: false, error: true, message: "Server error" });
    }
});

router.post('/paymentPhone', async function (req, res, next) {
    try {
        // req
        network = req.body.network;
        phone = req.body.phone;
        phoneSend = req.body.phoneSend;
        money = req.body.money;
        let keySource = req.body.keySource;

        // send money bank
        //if (utils.checkSendMoneyToAnother(100)) { // send money = false
        // response 
        //return res.status(500).send({ auth: false, error: true, message: "Thanh toán thất bại" });
        //}

        // send message to client 
        // todo 

        // update balance
        const db = req.app.get('db');
        if (keySource == 0) {
            console.log(keySource)
            db.utilFuncs.updateDecreaseBalance(req.body.phone, Number.parseInt(req.body.money));
        }

        // add transaction
        db.utilFuncs.addTransaction(req.body.phone, null, "VinaPhone", Number.parseInt(req.body.money), 0, "Thanh toán", "Mua thẻ điện thoại", "paidCardPhone", 2);

        // res
        let seri = '';
        let cardNum = '';
        for (var i = 0; i < 13; i++) {
            seri += '' + Math.floor(Math.random() * 10) + '';
        }
        for (var i = 0; i < 12; i++) {
            cardNum += '' + Math.floor(Math.random() * 10) + '';
        }
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


router.post('/paymentCard', async function (req, res, next) {
    let network = req.body.network;
    let phone = req.body.phone;
    let money = req.body.money;
    let source = req.body.source;
    try {
        // rea
        console.log("begin paymentCard...")
        console.log(req.body)
        // update balance
        const db = req.app.get('db');
        const dataCard = await buyCard.payCard(network, 10000, 1);

        console.log(dataCard[0])
        const addingData =
        {
            "Mã thẻ": dataCard[0].PinCode,
            "Số Seri": dataCard[0].Serial,
            "Nhà mạng": network,
        }
        // add transaction
        await db.utilFuncs.addTransaction(req.body.phone, 'Phone01', source, 10000, 0, "Thanh toán", "Mua thẻ điện thoại " + network, "paidCardPhone", 2, utils.getTime(-2), JSON.stringify(addingData));
        console.log("adding transaction...")

        let data = {
            seriNum: dataCard[0].Serial,
            cardNum: dataCard[0].PinCode,
            message: ('Thanh toán thành công thẻ ' + network),
            money: money,
            phone: phone,
            network: network,
        }
        console.log("return result...")
        return res.status(200).send({ error: false, data: data });
    } catch (error) {
        console.log(error)
        const db = req.app.get('db');
        await db.utilFuncs.addTransaction(req.body.phone, 'Phone01', source, 10000, 0, "Thanh toán", "Mua thẻ điện thoại " + network, "paidCardPhone", 0);
        return res.status(500).send({ auth: false, error: true, message: "Server error" });
    }
});

module.exports = router;