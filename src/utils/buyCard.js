var http = require('http');
var https = require('https');

const dotenv = require('dotenv');
dotenv.config();

const USERNAME = process.env.BUY_CARD_USERNAME;
const PASSWORD = process.env.BUY_CARD_PASSWORD;
//kq tra ve dang  [{
//    PinCode: '78832061223024', (ma nap)
//   Telco: 'VNP', (day la ten ma cuar nha mang)
//   Serial: '59000010435809', (so seri the)
//   Amount: 10000, (so tien cua the)
//   Trace: '121557' (?)
// }]
const payCard = async function (nameNetwork, money, number) {
    //get token
    var url = 'banthe247.com';
    const options = {
        host: url,
        path: `/v2/PayCard/DangNhap?userName=${USERNAME}&password=${PASSWORD}`,
        method: 'POST'
    };
    let token = null;
    await httpPost(options).then(res => token = res);
    token = token.slice(1, token.length - 1) //remove "" in start and end of string
    console.log(token)
    //buy card
    const shortNameNetwork = getShortNameNetwork(nameNetwork);
    const msg = shortNameNetwork + ':' + money + ':' + number;
    const options2 = {
        host: url,
        path: `/v2/PayCards/TelcoPay/GetCards?msg=${msg}`,
        method: 'POST',
        headers: {
            'Token': token
        }
    };
    console.log('Token :' +msg)
    let jsonRes = null;
    await httpPost(options2).then(res => jsonRes = res);

    let parseIntoJson =JSON.parse(jsonRes)
    let finalResult = JSON.parse(parseIntoJson.Data);
    return finalResult;
}

const getShortNameNetwork = (nameNetwork) => {
    nameNetwork = nameNetwork.toLowerCase();
    let data = {
        viettel: 'VTT',
        vinaphone: 'VNP',
        mobiphone: 'VMS',
        vietnammoblie: 'VNM'
    }
    return data[nameNetwork];
}

const httpPost = options => {
    let body = '';
    return new Promise((resolve, reject) => {
        https.request(options, function (res) {
            res.setEncoding('utf8');
            res.on('data', function (d) {
                body += d;
            });
            res.on('end', function () {
                var json = JSON.parse(body);
                if (json.Success === 0) {
                    resolve(json)
                }
                else {
                    resolve(body)
                }

            });
        }).end();
    })
}

module.exports = {
    payCard
}
