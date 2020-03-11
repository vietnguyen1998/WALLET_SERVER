"use strict";

const utils = require( "../../utils" );

const register = async ( { sql, getConnection } ) => {
    // read in all the .sql files for this folder
    const sqlQueries = await utils.loadSqlQueries( "ReceiveTransfer" , "query" );

    const GetListBanks = async () => {
        const cnx = await getConnection();
        const request = await cnx.request();

        return request.query(sqlQueries.listBank );
    };

    const GetListBanksHasntLinked = async (phone) => {
        const cnx = await getConnection();
        const request = await cnx.request();
        request.input( "phone", sql.VarChar( 128 ), phone );
        return request.query(sqlQueries.listBankHasntLinked );
    };

    const GetListBanksLinked = async (phone) => {
        const cnx = await getConnection();
        const request = await cnx.request();
        request.input( "phone", sql.VarChar( 128 ), phone );
        return request.query(sqlQueries.listBanklinked );
    };
    const GetListPeopleSend = async (phone) => {
        const cnx = await getConnection();
        const request = await cnx.request();
        request.input( "phone", sql.VarChar( 128 ), phone );
        return request.query(sqlQueries.getListPeopleSend );
    };
    const AddCard = async (accountID,bankID,bankinfo,time) => {
        const cnx = await getConnection();
        const request = await cnx.request();
        request.input( "accountID", sql.VarChar( 128 ), accountID );
        request.input( "bankID", sql.VarChar( 128 ),bankID );
        request.input( "bankinfo", sql.VarChar( 128 ), bankinfo );
        request.input( "time", sql.VarChar( 128 ),time );
        return request.query(sqlQueries.addCard );
    };

    const GetBankID= async (nameBank) => {
        const cnx = await getConnection();
        const request = await cnx.request();
        request.input( "namebank", sql.VarChar( 128 ), nameBank  );
        return request.query(sqlQueries.findBankWithName );
    };
    const GetBankAccountID= async (bankID,accountID) => {
        const cnx = await getConnection();
        const request = await cnx.request();
        request.input( "bankID", sql.VarChar( 128 ), bankID  );
        request.input( "accountID", sql.VarChar( 128 ), accountID  );
        return request.query(sqlQueries.findBankWithNameAndAccount );
    };

    const removeBankAccount= async (phone,bankName) => {
        const cnx = await getConnection();
        const request = await cnx.request();
        request.input( "BankName", sql.VarChar( 128 ), bankName  );
        request.input( "phone", sql.VarChar( 128 ), phone  );
        return request.query(sqlQueries.removeBankAccount);
    };
    
    return {
        GetListBanks,GetListBanksLinked,GetListPeopleSend,AddCard,GetBankID,GetBankAccountID,GetListBanksHasntLinked, removeBankAccount
    };
};

module.exports = { register };
