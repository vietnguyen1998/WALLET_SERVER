var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var iso8583data = require('./../database/ReceiveTransfer/iso8583')
var utils = require('./../utils')

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post('/getlistbank', utils.verifyToken, async function (req, res, next) {
    try {
        const db = req.app.get('db');
        const result = await db.receivetransfer.GetListBanks();
        let data = new Array();
        for (let i = 0; i < result.recordset.length; i++) {
            data.push(
                new Object({
                    key: result.recordset[i].BankID,
                    title: result.recordset[i].BankShortName,
                    fullname: result.recordset[i].BankName,
                    bankNumber: result.recordset[i].BankNumber
                })
            );
        }
        res.status(200).send({ error: false, data: data });

    } catch (error) {
        return res.status(500).send({ error: true });
    }
});

router.post('/getlistbankhasntlinked', utils.verifyToken, async function (req, res) {
    try {
        const db = req.app.get('db');
        console.log(req.body.phone)
        const result = await db.receivetransfer.GetListBanksHasntLinked(req.body.phone);
        let data = new Array();
        for (let i = 0; i < result.recordset.length; i++) {
            data.push(
                new Object({
                    key: result.recordset[i].BankID,
                    title: result.recordset[i].BankShortName,
                    fullname: result.recordset[i].BankName,
                    number: result.recordset[i].BankNumber,
                })
            );
        }
        console.log(data)
        res.status(200).send({ error: false, data: data });

    } catch (error) {
        return res.status(500).send({ error: true });
    }
});


router.post('/getlistbanklinked', utils.verifyToken, async function (req, res) {
    try {
        const db = req.app.get('db');
        const phone = req.body.phone;
        const result = await db.receivetransfer.GetListBanksLinked(phone);
        let data = new Array();
        for (let i = 0; i < result.recordset.length; i++) {
            data.push(
                new Object({
                    key: result.recordset[i].BankAccountID,
                    title: result.recordset[i].BankShortName,
                    info: result.recordset[i].BankAccountInfo
                })
            );
        }
        console.log(data)
        res.status(200).send({ error: false, data: data });

    } catch (error) {
        return res.status(500).send({ error: true });
    }
});


router.post('/addcard', utils.verifyToken, async function (req, res, next) {
    try {
        //get data from app
        const data = req.body;
        //this is part of iso 8583
        console.log(data);
        const parseInto8583 = iso8583data.parseInto8583(data.Account, data.CMND);
        const response8583Data = iso8583data.response8583Data(parseInto8583);
        const finalData = iso8583data.parse8583IntoData(response8583Data);
        console.log(finalData)
        if (!finalData.success) {
            return res.status(200).send({ success: false });
        }
        //changeinfocard
        let infoCard = data.Account.slice(-4);
        for (let i = 0; i < data.Account.length - 4; i++) {
            infoCard = 'x' + infoCard;
        }
        //change format date
        let date = finalData.date; let time = finalData.time;
        let currentDate = date.substring(0, 2) + '/' + date.substring(2, 4)
            + '/' + '20' + date.slice(-2) + ' ' + time.substring(0, 2) + ':' + time.slice(-2) + ':00';

        //this is part of db
        const db = req.app.get('db');
        const bankIDsql = await db.receivetransfer.GetBankID(data.namebank);
        const bankID = bankIDsql.recordset[0].BankID;
        const accountIDsql = await db.accounts.getInfo(data.phone);
        const accountID = accountIDsql.recordset[0].AccountID;
        const result = await db.receivetransfer.AddCard(accountID, bankID, infoCard, currentDate);
        console.log(accountID)
        console.log(result.rowsAffected[0])

        if (result.rowsAffected[0] === 1) {
            let dataSend = {};
            dataSend['Account'] = infoCard;
            dataSend['time'] = currentDate;
            dataSend['namebank'] = data.namebank;
            return res.status(200).send({ success: true, data: dataSend })
        }
        return res.status(200).send({ success: false })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: true, success: false });
    }
});

router.post('/getlistpeoplesend', utils.verifyToken, async function (req, res, next) {
    try {
        const db = req.app.get('db');
        const phone = req.body.phone;
        console.log(phone)
        const result = await db.receivetransfer.GetListPeopleSend(phone);
        let data = new Array();
        console.log(result.recordset[0])
        for (let i = 0; i < result.recordset.length; i++) {
            let dataget = result.recordset[i].Param.split("-")[0]
            let nameUser = await db.accounts.getInfo(dataget);
            data.push(
                new Object({
                    key: i,
                    name: nameUser.recordset[0].AccountName,
                    SDT: dataget
                })
            );
        }
        console.log(data)
        res.status(200).send({ error: false, data: data });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: true });
    }
});

router.post('/checklistphone', utils.verifyToken, async function (req, res, next) {
    try {
        const db = req.app.get('db');
        console.log(req.body.list)
        const listphone = req.body.list;
        let data = new Array();
        for (let i = 0; i < listphone.length; i++) {
            const result = await db.accounts.getInfo(listphone[i].SDT);
            if (result.recordset.length > 0) {
                let name = result.recordset[0].AccountName;
                data.push(
                    new Object({
                        name: listphone[i].name,
                        nameinwallet: name,
                        SDT: listphone[i].SDT,
                    })
                );
            }
        }
        console.log(data)
        res.status(200).send({ error: false, data: data });

    } catch (error) {
        // console.log(error);
        return res.status(500).send({ error: true });
    }
});

router.post('/removecard', utils.verifyToken, async function (req, res) {
    try {
        const db = req.app.get('db');
        let data = req.body;
        console.log(req.phone)
        const result = await db.receivetransfer.removeBankAccount(req.phone, data.bankname);
        if (result.rowsAffected[0] === 1)
            res.status(200).send({ status: 'ok', error: false });
        else return res.status(200).send({ status: 'error', error: false });
    } catch (error) {
        console.log(error);
        return res.status(403).send({ error: true });
    }
});


router.post('/recharge', utils.verifyToken, async function (req, res, next) {
    try {
        //get data from app( money,phone,bankname)
        const db = req.app.get('db');
        const data = req.body;
        console.log(data);
        //this is part of db
        const accountIDsql = await db.accounts.getInfo(data.phone);
        const accountID = accountIDsql.recordset[0].AccountID;
        const bankIDsql = await db.receivetransfer.GetBankID(data.namebank);
        const bankID = bankIDsql.recordset[0].BankID;
        const bankName = bankIDsql.recordset[0].BankShortName;
        const bankAccountIDsql = await db.receivetransfer.GetBankAccountID(bankID, accountID);
        const bankAccountID = bankAccountIDsql.recordset[0].BankAccountID;
        //this is part of iso 8583
        const finalData = utils.checkSendMoneyToAnother(data.money);


        //change format date
        let date = finalData.date; let time = finalData.time;
        let currentDate = date.substring(0, 2) + '-' + date.substring(2, 4)
            + '-' + '20' + date.slice(-2) + ' ' + time.substring(0, 2) + ':' + time.slice(-2) + ':00';
        if (!finalData.success) {
            let dataSend = {};
            dataSend['time'] = currentDate;
            dataSend['namebank'] = bankName;
            dataSend['money'] = data.money;
            await db.utilFuncs.addTransaction(data.phone, null, bankName, data.money, 0, data.content, 'Nạp tiền', 'recharge', 1, currentDate)
            return res.status(200).send({ success: false, data: dataSend });
        }
        const addTrans = await db.utilFuncs.addTransaction(data.phone, null, bankName, data.money, 0, data.content, 'Nạp tiền', 'recharge', 2, currentDate)
        const addMoney = await db.utilFuncs.updateIncreaseBalance(data.phone, data.money)

        if (addTrans.rowsAffected[0] > 0
            && addMoney.rowsAffected[0] > 0) {

            let dataSend = {};
            dataSend['time'] = currentDate;
            dataSend['namebank'] = bankName;
            dataSend['money'] = data.money;
            return res.status(200).send({ success: true, data: dataSend })
        }
        return res.status(200).send({ success: false })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: true, success: false });
    }
});

router.post('/transfertoanotherbank', utils.verifyToken, async function (req, res, next) {
    try {
        //get data from app( money,phone,bankname)
        const db = req.app.get('db');
        const data = req.body;
        console.log(data);
        //this is part of iso 8583
        const parseInto8583 = iso8583data.parseInto8583(data.Account);
        const response8583Data = iso8583data.response8583Data(parseInto8583);
        const finalData = iso8583data.parse8583IntoData(response8583Data);
        //changeinfocard
        let infoCard = data.Account.slice(-4);
        for (let i = 0; i < data.Account.length - 4; i++) {
            infoCard = 'x' + infoCard;
        }
        //change format date
        let date = finalData.date; let time = finalData.time;
        let currentDate = date.substring(0, 2) + '-' + date.substring(2, 4)
        + '-' + '20' + date.slice(-2) + ' ' + time.substring(0, 2) + ':' + time.slice(-2) + ':00';
        if (!finalData.success) {
            let dataSend = {};
            dataSend['time'] = currentDate;
            dataSend['namebank'] = data.namebank;
            dataSend['source'] = data.source;
            dataSend['money'] = data.money;
            dataSend['messenge'] = data.content;
            dataSend['infocard'] = infoCard;
            await db.utilFuncs.addTransaction(data.phone, null, data.source, data.money, 0, data.content, 'Chuyển tiền', 'transfer-bank', 1, currentDate, data.namebank + '-' + infoCard)
            return res.status(200).send({ success: false, data: dataSend });
        }

        if (data.source !== 'ThisWallet') {
            const accountIDsql = await db.accounts.getInfo(data.phone);
            const accountID = accountIDsql.recordset[0].AccountID;
            const bankIDsql = await db.receivetransfer.GetBankID(data.source);
            const bankID = bankIDsql.recordset[0].BankID;

            const bankAccountIDsql = await db.receivetransfer.GetBankAccountID(bankID, accountID);
            console.log(bankID);
            console.log(accountID);
            const bankAccountID = bankAccountIDsql.recordset[0].BankAccountID;
        } else {
            //this is part of iso 8583
            const finalData2 = utils.checkSendMoneyToAnother(data.money);
            if (!finalData2.success) {
                await db.utilFuncs.addTransaction(data.phone, null, data.source, data.money, 0, data.content, 'Chuyển tiền', 'transfer-bank', 1, currentDate, data.namebank + '-' + infoCard)
                return res.status(200).send({ success: false });
            }
            let addMoney = await db.utilFuncs.updateDecreaseBalance(data.phone, data.money)

            if (addMoney.rowsAffected[0] !== 1) {
                return res.status(200).send({ success: false });
            }
        }
        const addTrans = await db.utilFuncs.addTransaction(data.phone, null, data.source, data.money, 0, data.content, 'Chuyển tiền', 'transfer-bank', 2, currentDate, data.namebank + '-' + infoCard)

        if (addTrans.rowsAffected[0] === 1) {
            let dataSend = {};
            dataSend['time'] = currentDate;
            dataSend['namebank'] = data.namebank;
            dataSend['source'] = data.source;
            dataSend['money'] = data.money;
            dataSend['messenge'] = data.content;
            dataSend['infocard'] = infoCard;
            return res.status(200).send({ success: true, data: dataSend })
        }
        return res.status(200).send({ success: false })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: true, success: false });
    }
});
router.post('/transfertofriend', utils.verifyToken, async function (req, res, next) {
    try {
        console.log('sss')
        //get data from app( money,phone,bankname)
        const db = req.app.get('db');
        const data = req.body;
        if (data.source !== 'ThisWallet') {
            const accountIDsql = await db.accounts.getInfo(data.phone);
            const accountID = accountIDsql.recordset[0].AccountID;
            const bankIDsql = await db.receivetransfer.GetBankID(data.source);
            const bankID = bankIDsql.recordset[0].BankID;
            const bankAccountIDsql = await db.receivetransfer.GetBankAccountID(bankID, accountID);
            const bankAccountID = bankAccountIDsql.recordset[0].BankAccountID;

            //get name of recived user
            const receiveUser=  await db.auth.getInfo(req.body.phone)
            //this is part of iso 8583
            const finalData2 = utils.checkSendMoneyToAnother(data.phoneReceive);

            //change format date
            let date = finalData2.date; let time = finalData2.time;
            let currentDate = date.substring(0, 2) + '-' + date.substring(2, 4)
            + '-' + '20' + date.slice(-2) + ' ' + time.substring(0, 2) + ':' + time.slice(-2) + ':00';
            if (!finalData2.success) {
                let dataSend = {};
                dataSend['time'] = currentDate;
                dataSend['money'] = data.money;
                dataSend['source'] = data.source;
                await db.utilFuncs.addTransaction(data.phone, null, data.source, data.money, 0, data.content,'Chuyển tiền' , 'transfer-tofriend', 1, currentDate, data.phoneReceive +'-' +data.name)
                return res.status(200).send({ success: false, data: dataSend });
            }
            const addTrans1 = await db.utilFuncs.addTransaction(data.phone, null, data.source, data.money, 0, data.content,'Chuyển tiền' , 'transfer-tofriend', 2, currentDate, data.phoneReceive+'-' +data.name)
            const addMoney1 = await db.utilFuncs.updateIncreaseBalance(data.phoneReceive, data.money)
            if (addTrans1.rowsAffected[0] === 1 && addMoney1.rowsAffected[0] === 1) {
                let dataSend = {};
                dataSend['time'] = currentDate;
                dataSend['money'] = data.money;
                dataSend['source'] = data.source;
                dataSend['phoneReceive'] = data.phoneReceive;
                dataSend['messenge'] = data.content;
                return res.status(200).send({ success: true, data: dataSend })
            }
            return res.status(200).send({ success: false })
        } else {
            let currentDate = utils.getTime(0);

            const minusMoney = await db.utilFuncs.updateDecreaseBalance(data.phone, data.money)
            const addTrans2 = await db.utilFuncs.addTransaction(data.phone, null, 'ThisWallet', data.money, 0, data.content,'Chuyển tiền', 'transfer-tofriend', 2, currentDate, data.phoneReceive+'-' +data.name)
            const addMoney2 = await db.utilFuncs.updateIncreaseBalance(data.phoneReceive, data.money)
            if (addTrans2.rowsAffected[0] === 1 && minusMoney.rowsAffected[0] === 1 && addMoney2.rowsAffected[0] === 1) {
                let dataSend = {};
                dataSend['time'] = currentDate;
                dataSend['source'] = data.source;
                dataSend['phoneReceive'] = data.phoneReceive;
                dataSend['money'] = data.money;
                dataSend['messenge'] = data.content;
                dataSend['name'] = data.name;
                return res.status(200).send({ success: true, data: dataSend })
            }
            return res.status(200).send({ success: false })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: true, success: false });
    }
});
module.exports = router;