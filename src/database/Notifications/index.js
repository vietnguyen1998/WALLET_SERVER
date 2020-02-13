"use strict";

const utils = require("../../utils");

const register = async ({ sql, getConnection }) => {
    // read in all the .sql files for this folder
    const sqlQueries = await utils.loadSqlQueries("Notifications", "query");

    const getNotifications = async (phone) => {
        // get a connection to SQL Server
        const cnx = await getConnection();
        // create a new request
        const request = await cnx.request();
        request.input("phone", sql.VarChar(50), phone);

        // configure sql query parameters
        // return the executed query
        return request.query(sqlQueries.getNotifications);
    };

    const getTransactions = async (phone) => {
        const cnx = await getConnection();
        const request = await cnx.request();
        request.input("phone", sql.VarChar(50), phone);
        return request.query(sqlQueries.getTransactions);
    };

    const getBankNames = async (phone) => {
        const cnx = await getConnection();
        const request = await cnx.request();
        request.input("phone", sql.VarChar(50), phone);
        return request.query(sqlQueries.getBankNames);
    };

    return {
        getNotifications,
        getTransactions,
        getBankNames
    };
};

module.exports = { register };
