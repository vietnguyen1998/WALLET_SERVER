"use strict";

const utils = require("../../utils");

const register = async ({ sql, getConnection }) => {
    // read in all the .sql files for this folder
    const sqlQueries = await utils.loadSqlQueries("UtilFuncs", "query");

    const addTransaction = async (phone, servicesID, sourceBalance, amount, transactionFee, content, infomationServices, otherInfomation, status,time,param) => {
        // get a connection to SQL Server
        const cnx = await getConnection();
        const request = await cnx.request();

        // get current date
        if(time === undefined || time===null){
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
        if (dd < 10) {dd = '0' + dd}
        if (mm < 10) {   mm = '0' + mm  }
        today = dd + '-' + mm + '-' + yyyy;
        }else today=time;
        
        request.input("phone", sql.VarChar(50), phone);
        request.input("servicesID", sql.VarChar(128), servicesID);
        request.input("sourceBalance", sql.NVarChar(128), sourceBalance);
        request.input("amount", sql.BigInt, amount);
        request.input("transactionFee", sql.BigInt, transactionFee);
        request.input("createDate", sql.VarChar(50), today);
        request.input("content", sql.VarChar(255), content);
        request.input("infomationServices", sql.NVarChar(128), infomationServices);
        request.input("otherInfomation", sql.NVarChar(128), otherInfomation);
        request.input("param", sql.NVarChar(128), param);
        request.input("status", sql.BigInt, status);

        return request.query(sqlQueries.addTransaction);
    };

    const addNotifications = async(name, student_id, money) => {
        // get a connection to SQL Server
        const cnx = await getConnection();
        const request = await cnx.request();
        student_id = student_id.toString();
        request.input("name", sql.NVarChar(128), name);
        request.input("student_id", sql.NVarChar(128), student_id);
        request.input("money", sql.NVarChar(128), money);
        return request.query(sqlQueries.addNotifications);
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

    const addNotify = async (phone, GroupId,Title,Description,DateStart,DateEnd,Status) => {
        // get a connection to SQL Server
        const cnx = await getConnection();
        const request = await cnx.request();

        request.input("phone", sql.VarChar(50), phone); 
        request.input("number", sql.BigInt, number);

        return request.query(sqlQueries.updateDecreaseBalance);
    };

    const updateWaterBalance = async (id, money) => {
        // get a connection to SQL Server
        const cnx = await getConnection();
        const request = await cnx.request();

        request.input("id", sql.VarChar(50), id);
        request.input("money", sql.Int, money);

        return request.query(sqlQueries.updateWaterBalance);

    };
    const updateSchoolFee = async (student_id) => {
        // get a connection to SQL Server
        const cnx = await getConnection();
        const request = await cnx.request();

        request.input("student_id", sql.VarChar(50), student_id);

        return request.query(sqlQueries.updateSchoolFee);
    };

    const getAccountInfo = async (phone) => {
        // get a connection to SQL Server
        const cnx = await getConnection();
        const request = await cnx.request();
        request.input("phone", sql.VarChar(50), phone); 
        return request.query(sqlQueries.getAccountInfo);
    };

    const getLanguage = async (phone) => {
        // get a connection to SQL Server
        const cnx = await getConnection();
        const request = await cnx.request();
        request.input("phone", sql.VarChar(50), phone);
        return request.query(sqlQueries.getLanguage);
    };
    const updateLanguage = async (phone, language) => {
        // get a connection to SQL Server
        console.log("ok111111")
        const cnx = await getConnection();
        const request = await cnx.request();
        console.log("ok1")
        request.input("phone", sql.VarChar(50), phone);
        console.log("ok2")
        request.input("language", sql.VarChar(255), language);
        console.log("ok")
        return request.query(sqlQueries.updateLanguage);
    };
    return {
        addTransaction,
        updateIncreaseBalance,
        updateDecreaseBalance,
        getIDTransaction,
        getTransactionByID,
        updateWaterBalance,
        updateSchoolFee,
        getAccountInfo,
        getLanguage,
        updateLanguage,
        addNotifications
    };
}

module.exports = { register };
