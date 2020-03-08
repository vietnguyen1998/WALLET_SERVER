"use strict";

const utils = require( "../../utils" );

const register = async ( { sql, getConnection } ) => {
    // read in all the .sql files for this folder
    const sqlQueries = await utils.loadSqlQueries( "Promotions" , "query" );

    const PromotionInfo = async () => {
        // get a connection to SQL Server
        const cnx = await getConnection();
        // create a new request
        const request = await cnx.request();
        // configure sql query parameters
        // return the executed query
        return request.query( sqlQueries.PromotionInfo );
    };

    const PromotionInfoNew = async () => {
        // get a connection to SQL Server
        const cnx = await getConnection();
        // create a new request
        const request = await cnx.request();
        // configure sql query parameters
        // return the executed query
        return request.query(sqlQueries.PromotionInfoNew);
    };

    const CheckCode = async (code) => {
        // get a connection to SQL Server
        const cnx = await getConnection();
        const request = await cnx.request();
        request.input("code", sql.VarChar(50), code);
        return request.query(sqlQueries.CodePromotion);
    };

    return {
        PromotionInfo,
        PromotionInfoNew,
        CheckCode
    };
};

module.exports = { register };
