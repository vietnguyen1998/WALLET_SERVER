"use strict";

const utils = require( "../../utils" );

const register = async ( { sql, getConnection } ) => {
    // read in all the .sql files for this folder
    const sqlQueries = await utils.loadSqlQueries( "Accounts" , "query" );

    const auth = async (phone, password) => {
        // get a connection to SQL Server
        const cnx = await getConnection();
        // create a new request
        const request = await cnx.request();
        // configure sql query parameters
        request.input( "phone", sql.VarChar( 50 ), phone );
        request.input( "password", sql.VarChar( 128 ), password );
        // return the executed query
        return request.query( sqlQueries.auth );
    };

    const getInfo = async (phone) => {
        // get a connection to SQL Server
        const cnx = await getConnection();
        // create a new request
        const request = await cnx.request();
        // configure sql query parameters
        request.input( "phone", sql.VarChar( 50 ), phone );
        // return the executed query
        return request.query( sqlQueries.getInfo );
    };

    const addUser = async (body) => {
        // get a connection to SQL Server
        const cnx = await getConnection();
        // create a new request
        const request = await cnx.request();
        // configure sql query parameters
        request.input( "phone", sql.VarChar( 50 ), body.phone );
        request.input( "password", sql.VarChar( 128 ), body.password );
        request.input( "group", sql.VarChar( 50 ), '1' );
        request.input( "accname", sql.VarChar( 128 ), 'NO NAME');
        request.input( "balances", sql.Decimal( 18, 2), 0 );
        request.input( "status", sql.Bit(), 1 );
        // return the executed query
        return request.query( sqlQueries.addUser );
    };

    const updateBalance = async (phone, balances) => {
        // get a connection to SQL Server
        const cnx = await getConnection();
        // create a new request
        const request = await cnx.request();
        // configure sql query parameters
        request.input( "phone", sql.VarChar( 50 ), phone );
        request.input( "phone", sql.Decimal( 18, 2), balances );
        // return the executed query
        return request.query( sqlQueries.updateBalance );
    };

    return {
        auth, getInfo, addUser, updateBalance
    };
};

module.exports = { register };
