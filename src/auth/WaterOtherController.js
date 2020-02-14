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

// Water + Elect
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
        // req
        let customerID = req.body.customerID;
        let money = req.body.money;
        let phone = req.body.phone;
        let keySource = req.body.keySource;
        let nameProducer = req.body.nameProducer;
        console.log(nameProducer)
        // send money
        //if (utils.checkSendMoneyToAnother(100)) { // send money = false
        //return res.status(500).send({ auth: false, error: true, message: "Thanh toán thất bại" });
        //}
        
        // update balance
        const db = req.app.get('db');
        if (keySource == 0) {
            db.utilFuncs.updateDecreaseBalance(req.body.phone, Number.parseInt(req.body.money));
        }
        db.utilFuncs.updateWaterBalance(customerID, Number.parseInt(money));

        // add transaction
        db.utilFuncs.addTransaction(req.body.phone, 'Bill01', "", Number.parseInt(req.body.money), 0, "Thanh toán", "Thanh toán tiền hóa đơn", nameProducer.includes("nước") ? "paidWater" : "paidElec", 2);

        // res
        console.log('paymentWater TRUE')
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


// School
router.post('/StudentInfo', async function (req, res, next) {
    try {
        // get cus info
        const db = req.app.get('db');
        const result = await db.waterOther.StudentInfo(req.body.studentID);
        // return
        console.log("StudentInfo TRUE");
        let arr1 = new Array();
        if (result.recordset.length > 0) {
            for (var i = 0; i < result.recordset.length; i++) {
                arr1.push(new Object({ yearSemi: ('Năm học: ' + result.recordset[i].Year + ', Học kỳ: ' + result.recordset[i].Semester), money: (result.recordset[i].Fee) }))
            }
            let data = new Object({ name: result.recordset[0].Name, studentID: result.recordset[0].StudentID, lsFee: arr1 });

            res.status(200).send({ error: false, data: data });
        } else {
            return res.status(500).send({ error: true, errmessage: "Không tìm thấy thông tin sinh viên" });
        }
    } catch (error) {
        return res.status(500).send({ error: true, errmessage: "server error" });
    }
});
router.post('/paymentSchoolFee', async function (req, res, next) {
    try {
        // req
        console.log('1');

        let studentID = req.body.studentID;
        let keySource = req.body.keySource;
        console.log('1');

        let money = req.body.money;
        let phone = req.body.phone;
        console.log('1');

        // send money
        //if (utils.checkSendMoneyToAnother(100)) { // send money = false
        //return res.status(500).send({ auth: false, error: true, message: "Thanh toán thất bại" });
        //}
        console.log('2');

        // update balance
        const db = req.app.get('db');
        if (keySource == 0) {
            db.utilFuncs.updateDecreaseBalance(req.body.phone, Number.parseInt(req.body.money));
        }
        db.utilFuncs.updateSchoolFee(studentID);
        console.log('3');

        // add transaction
        db.utilFuncs.addTransaction(req.body.phone, "Fee", "ĐH Nông Lâm HCM", Number.parseInt(req.body.money), 0, "Thanh toán", "Thanh toán học phí", "paidSchool", 2);

        console.log('4');
        // res
        console.log('paymentSchoolFee TRUE')
        let data = {
            message: ('Thanh toán thành công học phí ' + money),
            money: money,
            phone: phone
        }
        return res.status(200).send({ error: false, data: data });
    } catch (error) {
        console.log('111');

        return res.status(500).send({ auth: false, error: true, message: "Server error" });
    }
});

// game
router.post('/paymentGame', async function (req, res, next) {
    try {
        let money = req.body.money;
        let phone = req.body.phone;
        let keySource = req.body.keySource;

        // send money
        //if (utils.checkSendMoneyToAnother(100)) { // send money = false
        //return res.status(500).send({ auth: false, error: true, message: "Thanh toán thất bại" });
        //}

        // update balance
        const db = req.app.get('db');
        if (keySource == 0) {
            db.utilFuncs.updateDecreaseBalance(req.body.phone, Number.parseInt(req.body.money));
        }

        // add transaction
        db.utilFuncs.addTransaction(req.body.phone, "Game", "", Number.parseInt(req.body.money), 0, "Thanh toán", "Thanh toán thẻ game", "paidGameCard", 2);

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
            message: ('Thanh toán thành công thẻ game ' + money),
            money: money,
            phone: phone,
            cardNum: cardNum,
            seri: seri
        }
        return res.status(200).send({ error: false, data: data });
    } catch (error) {
        return res.status(500).send({ auth: false, error: true, message: "Server error" });
    }
});

// movie
router.post('/ChairInfo', async function (req, res, next) {
    try {
        // get cus info
        const db = req.app.get('db');
        const result = await db.waterOther.ChairInfo();
        // return
        console.log("ChairInfo TRUE");
        if (result.recordset.length > 0) {
            res.status(200).send({ error: false, data: result.recordset });
        } else {
            return res.status(500).send({ error: true, errmessage: "Không tìm thấy thông tin" });
        }
    } catch (error) {
        return res.status(500).send({ error: true, errmessage: "server error" });
    }
});
router.post('/paymentMovie', async function (req, res, next) {
    console.log("paymentMovie");
    try {
        // req
        let money = req.body.money;
        let phone = req.body.phone;
        let lsRow = req.body.lsRow;
        let keySource = req.body.keySource;
        // send money
        //if (utils.checkSendMoneyToAnother(100)) { // send money = false
        //return res.status(500).send({ auth: false, error: true, message: "Thanh toán thất bại" });
        //}

        // update balance + chair
        let lsNum = new Array();
        for (var i = 0; i < lsRow.length; i++) {
            if (lsRow[i].row == 'A') {
                lsNum.push(Number.parseInt(lsRow[i].numCol));
            } else if (lsRow[i].row == 'B') {
                lsNum.push(Number.parseInt(lsRow[i].numCol) + 10);
            } else if (lsRow[i].row == 'C') {
                lsNum.push(Number.parseInt(lsRow[i].numCol) + 20);
            } else if (lsRow[i].row == 'D') {
                lsNum.push(Number.parseInt(lsRow[i].numCol) + 30);
            } else {
                continue;
            }
        }
        const db = req.app.get('db');
        for (var i = 0; i < lsNum.length; i++) {
            db.waterOther.UpdateChair(lsNum[i]);
        }
        if (keySource == 0) {
            db.utilFuncs.updateDecreaseBalance(req.body.phone, Number.parseInt(req.body.money));
        }

        // add transaction
        db.utilFuncs.addTransaction(req.body.phone, "Movie", "", Number.parseInt(req.body.money), 0, "Thanh toán", "Thanh toán vé xem phim", "paidMovie", 2);

        console.log('3')

        // res
        console.log('paymentMovie TRUE')
        let data = {
            message: ('Thanh toán thành công vé xem phim ' + money),
            money: money,
            phone: phone
        }
        return res.status(200).send({ error: false, data: data });
    } catch (error) {
        console.log('paymentMovie FALSE')
        return res.status(500).send({ auth: false, error: true, message: "Server error" });
    }
});

// transaction
router.post('/getTransactionByID', async function (req, res, next) {
    try {
        // get cus info
        const db = req.app.get('db');
        const result = await db.utilFuncs.getTransactionByID(req.body.transaction_id);
        // return
        console.log("getTransactionByID TRUE");

        res.status(200).send({ error: false, data: result.recordset[0] });
    } catch (error) {
        return res.status(500).send({ error: true, errmessage: "server error" });
    }
});

module.exports = router;