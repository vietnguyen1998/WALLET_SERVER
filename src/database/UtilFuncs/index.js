"use strict";

const utils = require("../../utils");

const register = async ({ sql, getConnection }) => {
    // read in all the .sql files for this folder
    const sqlQueries = await utils.loadSqlQueries("UtilFuncs", "query");

    const addTransaction = async (phone, servicesID, sourceBalance, amount, transactionFee, content, infomationServices, otherInfomation, status) => {
        // get a connection to SQL Server
        const cnx = await getConnection();
        const request = await cnx.request();

        // get current date
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
        if (dd < 10) {dd = '0' + dd}
        if (mm < 10) {   mm = '0' + mm  }
        today = dd + '-' + mm + '-' + yyyy;
        request.input("phone", sql.VarChar(50), phone);
        request.input("servicesID", sql.VarChar(128), servicesID);
        request.input("sourceBalance", sql.NVarChar(128), sourceBalance);
        request.input("amount", sql.BigInt, amount);
        request.input("transactionFee", sql.BigInt, transactionFee);
        request.input("createDate", sql.VarChar(50), today);
        request.input("content", sql.VarChar(255), content);
        request.input("infomationServices", sql.NVarChar(128), infomationServices);
        request.input("otherInfomation", sql.NVarChar(128), otherInfomation);
        request.input("status", sql.BigInt, status);

        return request.query(sqlQueries.addTransaction);
    };

    const getIDTransaction = async (phone) => {
        // get a connection to SQL Server
        const cnx = await getConnection();
        const request = await cnx.request();
        request.input("phone", sql.VarChar(50), phone);
        return request.query(sqlQueries.getIDTransaction);
    };

    const getTransactionByID = async (phone) => {
        // get a connection to SQL Server
        const cnx = await getConnection();
        const request = await cnx.request();
        request.input("transaction_id", sql.Int, phone);
        return request.query(sqlQueries.getTransactionByID);
    };

    const updateIncreaseBalance = async (phone, number) => {
        // get a connection to SQL Server
        const cnx = await getConnection();
        const request = await cnx.request();
        request.input("phone", sql.VarChar(50), phone); 
        request.input("number", sql.BigInt, number);
        return request.query(sqlQueries.updateIncreaseBalance);
    };

    const updateDecreaseBalance = async (phone, number) => {
        // get a connection to SQL Server
        const cnx = await getConnection();
        const request = await cnx.request();

        request.input("phone", sql.VarChar(50), phone); 
        request.input("number", sql.BigInt, number);

        return request.query(sqlQueries.updateDecreaseBalance);
    };

    return {
        addTransaction,
        updateIncreaseBalance,
        updateDecreaseBalance,
        getIDTransaction,
        getTransactionByID
    };
}

module.exports = { register };
