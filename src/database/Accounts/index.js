"use strict";

const utils = require("../../utils");
var bcrypt = require('bcryptjs');

const register = async ({ sql, getConnection }) => {
    // read in all the .sql files for this folder
    const sqlQueries = await utils.loadSqlQueries("Accounts", "query");

    const auth = async (phone, password) => {
        // get a connection to SQL Server
        const cnx = await getConnection();
        // create a new request
        const request = await cnx.request();
        // configure sql query parameters
        request.input("phone", sql.VarChar(50), phone);
        request.input("password", sql.VarChar(128), password);
        // return the executed query
        return request.query(sqlQueries.auth);
    };

    const getInfo = async (phone) => {
        // get a connection to SQL Server
        const cnx = await getConnection();
        // create a new request
        const request = await cnx.request();
        // configure sql query parameters
        request.input("phone", sql.VarChar(50), phone);
        // return the executed query
        return request.query(sqlQueries.getInfo);
    };

    const addUser = async (phone,password) => {
        // get a connection to SQL Server
        const cnx = await getConnection();
        // create a new request
        const request = await cnx.request();
        // configure sql query parameters
        request.input("phone", sql.VarChar(50), phone);

        request.input("password", sql.VarChar(100), password);
        request.input("group", sql.VarChar(50), '1');
        request.input("accname", sql.VarChar(128), '');
        request.input("cmnd", sql.VarChar(50), '');
        request.input("balances", sql.Decimal(18, 2), 0);
        request.input("status", sql.Bit(), 1);


        // return the executed query
        return request.query(sqlQueries.addUser);
    };

    const addDevices = async (accountID, uniqueID, DeviceName) => {
        // get a connection to SQL Server
        const cnx = await getConnection();
        // create a new request
        const request = await cnx.request();
        //get current date
        let currentDate = utils.getTime(-1);
        // configure sql query parameters
        request.input("accountID", sql.VarChar(128), accountID);
        request.input("uniqueID", sql.VarChar(128), uniqueID);
        request.input("DeviceName", sql.VarChar(128), DeviceName);
        request.input("time", sql.VarChar(128), currentDate);
        request.input("status", sql.Bit(), 1);
        // return the executed query
        return request.query(sqlQueries.addDevices);
    };

    const updateBalance = async (phone, balances) => {
        // get a connection to SQL Server
        const cnx = await getConnection();
        // create a new request
        const request = await cnx.request();
        // configure sql query parameters
        request.input("phone", sql.VarChar(50), phone);
        request.input("phone", sql.Decimal(18, 2), balances);
        // return the executed query
        return request.query(sqlQueries.updateBalance);
    };

    const updatePassword = async (phone, password) => {
        // get a connection to SQL Server
        const cnx = await getConnection();
        // create a new request
        const request = await cnx.request();
        // configure sql query parameters
        request.input("phone", sql.VarChar(50), phone);
        // return the executed query
        return request.query(sqlQueries.changePass);
    };

    const getListDevices = async (accountID) => {
        // get a connection to SQL Server
        const cnx = await getConnection();
        // create a new request
        const request = await cnx.request();
        // configure sql query parameters
        request.input("AccountID", sql.VarChar(128), accountID);
        // return the executed query
        return request.query(sqlQueries.getListDevices);
    };

    const updateLoginTime = async (accountID, uniqueID) => {
        // get a connection to SQL Server
        const cnx = await getConnection();
        // create a new request
        const request = await cnx.request();
        //get current date
        let currentDate = utils.getTime(-1);
        console.log(accountID +" " + uniqueID +" "+currentDate)
        // configure sql query parameters
        request.input("AccountID", sql.VarChar(128), accountID);
        request.input("UniqueID", sql.VarChar(128), uniqueID);
        request.input("date", sql.VarChar(128), currentDate);
        // return the executed query
        return request.query(sqlQueries.updateLoginTime);
    };

    const removeDevice = async (phone, uniqueID) => {
        // get a connection to SQL Server
        const cnx = await getConnection();
        // create a new request
        const request = await cnx.request();
        // configure sql query parameters
        request.input("phone", sql.VarChar(128), phone);
        request.input("UniqueID", sql.VarChar(128), uniqueID);
        // return the executed query
        return request.query(sqlQueries.removeDevice);
    };

    const getInfoAccountID = async (accountID) => {
        // get a connection to SQL Server
        const cnx = await getConnection();
        // create a new request
        const request = await cnx.request();
        // configure sql query parameters
        request.input("AccountID", sql.VarChar(128), accountID);
        // return the executed query
        return request.query(sqlQueries.getInfoBasedAccountID);
    };

    return {
        auth, getInfo, addUser, updateBalance, addDevices, updatePassword, getListDevices, updateLoginTime, removeDevice,getInfoAccountID
    };
};

module.exports = { register };
