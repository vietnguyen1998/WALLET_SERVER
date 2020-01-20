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
        if (false) { // send money = false
            // response 
            return res.status(500).send({ auth: false, error: true, message: "server error!" });
        } 
        // update balance

        // return TRUE
        return res.status(200).send({ error: false });
    } catch (error) {
        return res.status(500).send({ auth: false, error: true, message: "some error!" });
    }
});

router.post('/paymentPhone', async function (req, res, next) {
    try {
        if (false) { // send money = false
            // response 
            return res.status(500).send({ auth: false, error: true, message: "server error!" });
        }
        // update balance

        // send message to phone

        // return TRUE
        return res.status(200).send({ error: false });
    } catch (error) {
        return res.status(500).send({ auth: false, error: true, message: "some error!" });
    }
});

module.exports = router;