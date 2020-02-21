var express = require('express');
var router = express.Router();
var utils = require('./../utils');
var bodyParser = require('body-parser');

router.use(bodyParser.json());

//response json is 
//"success": boolean,
//"money" :number,
//"fee" :"number" (always 0)
//"date" : string,
//"time" :string,
// }
//Format date is dd/mm/yy (response string is DDMMYY)
//Format time is HH:mm(response string is HHmm)
router.post('/', async function (req, res, next) {
    try {

        let money = req.body.money;
        let data = utils.parseInto8583(money);
        let dataResponse = utils.response8583Data(data);
        //parse response data (this is final reponse json)
        let finalData = utils.parse8583IntoData(dataResponse);
        //do sth here
        //
        //
        return res.status(200).send(finalData);

    } catch (error) {
        console.log(error);
        return res.status(500).send({ auth: false, error: true });
    }
});

module.exports = router;