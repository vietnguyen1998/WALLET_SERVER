"use strict";

const fse = require("fs-extra");
const { join } = require("path");
var jwt = require('jsonwebtoken');
var config = require('../../config');
const formatd = require('date-fns/format');
const iso8583 = require('iso_8583');

const loadSqlQueries = async (module, folderName) => {
    // determine the file path for the folder
    const filePath = join(process.cwd(), "src", "database", module, folderName);

    // get a list of all the files in the folder
    const files = await fse.readdir(filePath);

    // only files that have the .sql extension
    const sqlFiles = files.filter(f => f.endsWith(".sql"));

    // loop over the files and read in their contents
    const queries = {};
    for (let i = 0; i < sqlFiles.length; i++) {
        const query = fse.readFileSync(join(filePath, sqlFiles[i]), { encoding: "UTF-8" });
        queries[sqlFiles[i].replace(".sql", "")] = query;
    }
    return queries;
};

const verifyToken = (req, res, next) => {

    // check header or url parameters or post parameters for token
    var token = req.headers['x-access-token'];
    if (!token)
        return res.status(403).send({ auth: false, errmessage: 'No token provided.' });

    // verifies secret and checks exp
    jwt.verify(token, config.secret, function (err, decoded) {
        if (err)
            return res.status(500).send({ auth: false, errmessage: err });

        // if everything is good, save to request for use in other routes
        req.phone = decoded.phone;
        next();
    });
}

//create iso_8583 json based on money
const iso8583Json = (money) => {
    //mti is 0100 (1987 version,Authorization request)
    console.log(money)
    const mti = "0100";
    //accont number of wallet
    const accontNumberOfWallet = "4321123443211234"
    //parse money into string (12 digits)
    let money_value = typeof money === "number" ? money.toString() : money;
    while (money_value.length < 12) {
        money_value = "0" + money_value;
    }
    // //PIN of wallet's card 
    // const PIN = "123456".toString('base64')
    let data = {
        0: mti,
        2: accontNumberOfWallet,
        4: money_value,
        7: getTime(7),
        12: getTime(12),
        13: getTime(13),
        18: "4111",
        22: "051",
        23: "001",
        25: "00",
        26: "12",
        41: "00000001",
        42: "TERMINAL_000001",
        43: "TERMINAL  Merchant 1 0000000 NAIROBI KE ",
        49: "704",
        83: "000000000000"
    }
    return data;
}
//parse json into 8583 data
const parseInto8583 = (money) => {
    let data = iso8583Json(money);
    let isopack = new iso8583(data);
    //iso 8583 encode
    return isopack.getBufferMessage();
}
//third server response
const response8583Data = (data) => {
    const iso = new iso8583().getIsoJSON(data);
    //if data is not 8583 format(if you want more failed transaction,add it in here)
    if (!(new iso8583(iso).validateMessage())) {
        const response = {
            0: '0110',
            7: getTime(7),
            12: getTime(12),
            13: getTime(13),
            39: "96"
        };
        let isopack = new iso8583(response);
        //iso 8583 encode
        return isopack.getBufferMessage();
    }
    //get iso data
    const new_mess = iso;
    new_mess[0] = `${new_mess[0].slice(0, 2)}10`;
    new_mess[7] = getTime(7);
    new_mess[12] = getTime(12);
    new_mess[13] = getTime(13);
    new_mess[39] = '00';
    return new iso8583(new_mess).getBufferMessage();
}

const parse8583IntoData = (data) => {
    const iso = new iso8583().getIsoJSON(data);
    let date = iso[7].slice(0, 6);
    let time = iso[7].slice(6, iso[7].length);
    return {
        "success": iso[39] === "00" ? true : false,
        "money": iso[4],
        "fee": iso[83],
        "date": date,
        "time": time,
    }
}
//response json is 
//"success": boolean,
//"money" :number,
//"fee" :"number" (always 0)
//"date" : string,
//"time" :string,
// }
//Format date is dd/mm/yy (response string is DDMMYY)
//Format time is HH:mm(response string is HHmm)
const checkSendMoneyToAnother = (money) => {
    let data = utils.parseInto8583(money);
    let dataResponse = utils.response8583Data(data);
    //parse response data (this is final reponse json)
    let finalData = utils.parse8583IntoData(dataResponse);
    return finalData;
}
//get current time and parse it into iso_8583 format 
const getTime = (fieldNumber) => {
    const time = new Date();
    let result;
    if (fieldNumber == 7) result = formatd(time, 'DDMMYYHHmm');
    if (fieldNumber == 12) result = formatd(time, 'HHmmss');
    if (fieldNumber == 13) result = formatd(time, 'DDMM');
    return result;
};

module.exports = {
    loadSqlQueries,
    verifyToken,
    parseInto8583,
    response8583Data,
    parse8583IntoData,
    checkSendMoneyToAnother
};
