var utils = require('./../../../utils');
const iso8583 = require('iso_8583');

const iso8583Json = (accountNumberOfWallet, CMND) => {
      //mti is 0100 (1987 version,Authorization request)
    const mti = "0100";
    //encodePIN
    // let bData='';
    // for (let i = 0; i < PIN.length; i++) {
    //     bData += PIN[i].charCodeAt(0).toString(2);
    // }
    // const PIN = "123456".toString('base64')
    let data = {
        0: mti,
        2: accountNumberOfWallet,
        7: utils.getTime(7),
        12: utils.getTime(12),
        13: utils.getTime(13),
        18: "4111",
        22: "051",
        23: "001",
        25: "00",
        26: "12",
        41: "00000001",
        42: "TERMINAL_000001",
        43: "TERMINAL  Merchant 1 0000000 NAIROBI KE ",
        48: CMND === undefined ?'000000000':CMND,
        49: "704",
    }
    return data;
}

const parseInto8583 = ( CMND) => {
    let data = iso8583Json(  CMND);
    let isopack = new iso8583(data);
    console.log(data)
    //iso 8583 encode
    return isopack.getBufferMessage();
}
//third server response
const response8583Data = (data) => {
    console.log(data)
    const iso = new iso8583().getIsoJSON(data);
    //if data is not 8583 format(if you want more failed transaction,add it in here)
    if (!(new iso8583(iso).validateMessage())) {
        const response = {
            0: '0110',
            7: utils.getTime(7),
            12: utils.getTime(12),
            13: utils.getTime(13),
            39: "96"
        };
        let isopack = new iso8583(response);
        //iso 8583 encode
        return isopack.getBufferMessage();
    }
    //get iso data
    const new_mess = iso;
    new_mess[0] = `${new_mess[0].slice(0, 2)}10`;
    new_mess[7] = utils.getTime(7);
    new_mess[12] = utils.getTime(12);
    new_mess[13] = utils.getTime(13);
    new_mess[39] = '00';
    return new iso8583(new_mess).getBufferMessage();
}

const parse8583IntoData = (data) => {
    const iso = new iso8583().getIsoJSON(data);
    let date = iso[7].slice(0, 6);
    let time = iso[7].slice(6, iso[7].length);
    return {
        "success": iso[39] === "00" ? true : false,
        "date": date,
        "time": time,
    }
}

const customFormats = {
    '52': {
      ContentType: 'b',
      Label: 'PIN',
      LenType: 'fixed',
      MaxLen: 36
    }
  };

module.exports = {
    parseInto8583,
    response8583Data,
    parse8583IntoData
};
