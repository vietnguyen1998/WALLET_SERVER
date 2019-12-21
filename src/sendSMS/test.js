/**
 * Created by NLK.
 */
var http = require('http');
const dotenv = require('dotenv');

var builder = require('xmlbuilder');

dotenv.config();

const API_KEY = process.env.API_KEY
const SECRET_KEY = process.env.SECRET_KEY
const SMS_TYPE = process.env.SMS_TYPE
const URL = process.env.URL
const PATH_NAME = process.env.PATH_NAME

const sendSMS = function (phone, content) {

    var doc = builder.begin().ele('RQST').
        ele('APIKEY').txt(API_KEY).up().
        ele('SECRETKET').txt(SECRET_KEY).up().
        ele('CONTENT').txt(content).up().
        ele('SMSTYPE').txt(SMS_TYPE).up().
        ele('BRANDNAME').txt('QCAO_ONLINE').up().
        ele('CONTACTS').
        ele('CUSTOMER').
        ele('PHONE').txt(phone).up()
        .up()
        .up().end({ pretty: true })


    const options = {
        hostname: URL,
        path: PATH_NAME,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body : doc.toString()
    };

    
    const req = http.request(options, function (res) {
        res.setEncoding('utf8');
        var body = '';
        res.on('data', function (d) {
            body += d;
        });
        res.on('end', function () {
            var json = JSON.parse(body);
            if (json.CodeResult == '100') {
                console.log("send sms success")
            }
            else {
                console.log("send sms failed " + body);
            }
        });
    });

    req.end();
}


module.exports = {
    sendSMS: sendSMS
}

//send test sms
//sendSMS(['your phone number'], "test ná»™i dung sms", 2, '');