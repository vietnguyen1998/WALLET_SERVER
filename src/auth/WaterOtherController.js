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


router.post('/customerInfo', async function (req, res, next) {
    try {
        // get cus info
        const db = req.app.get('db');
        const result = await db.waterOther.CustomerInfo(req.body.makh);
        // return
        console.log("customerInfo TRUE");
        if (result.recordset.length > 0) {
            res.status(200).send({ error: false, data: result.recordset[0] });
        } else {
            return res.status(500).send({ error: true, errmessage: "Không tìm thấy thông tin khách hàng" });
        }
    } catch (error) {
        return res.status(500).send({ error: true, errmessage: "server error" });
    }
});

router.post('/paymentWater', async function (req, res, next) {
    try {
        let customerID = req.body.customerID;
        let money = req.body.money;
        let phone = req.body.phone;
        // send money
        //if (utils.checkSendMoneyToAnother(100)) { // send money = false
            //return res.status(500).send({ auth: false, error: true, message: "Thanh toán thất bại" });
        //}
        // update balance
        const db = req.app.get('db');
        db.utilFuncs.updateDecreaseBalance(req.body.phone, Number.parseInt(req.body.money));
        // add transaction
        db.utilFuncs.addTransaction(req.body.phone, null, "BIDV", Number.parseInt(req.body.money), 0, "Thanh toán", "Thanh toán tiền nước", "paidWater", 1);
        // return
        console.log('paymentPhones TRUE')
        let data = {
            message: ('Thanh toán thành công tiền nước ' + money),
            money: money,
            phone: phone
        }
        return res.status(200).send({ error: false, data: data });
    } catch (error) {
        return res.status(500).send({ auth: false, error: true, message: "Server error" });
    }
});

module.exports = router;