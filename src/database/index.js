"use strict";

const accounts = require( "./Accounts" );
const sql = require( "mssql" );
const sqlServer = async ( config ) => {
    let pool = null;

    const closePool = async () => {
        try {
            // try to close the connection pool
            await pool.close();
            await sql.close();
            // set the pool to null to ensure
            // a new one will be created by getConnection()
            pool = null;
        } catch ( err ) {
            // error closing the connection (could already be closed)
            // set the pool to null to ensure
            // a new one will be created by getConnection()
            console.log(err);
            pool = null;
        }
    };

    const getConnection = async () => {
        try {
            if ( pool ) {
                return pool;
            }
            // create a new connection pool
            pool =await new sql.ConnectionPool( config );
            await pool.connect();
            // catch any connection errors and close the pool
            pool.on('error', err => {
                closePool();
              });          
            return pool;
        } catch ( err ) {
            console.log(err);
            // error connecting to SQL Server
            pool = null;
        }
    };

    // this is the API the client exposes to the rest
    // of the application
    return {
        accounts: await accounts.register( { sql, getConnection } )
    };
};

module.exports = sqlServer;
