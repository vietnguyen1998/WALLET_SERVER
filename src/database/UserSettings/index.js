"use strict";

const utils = require( "../../utils" );

const register = async ( { sql, getConnection } ) => {
    // read in all the .sql files for this folder
    const sqlQueries = await utils.loadSqlQueries( "UserSettings" , "query" );

    const GetUserInfos = async (phone) => {
        const cnx = await getConnection();
        const request = await cnx.request();
        request.input("phone", sql.VarChar(50), phone);
        return request.query(sqlQueries.GetUserInfos );
    };

    const UpdateUsers = async (phone, email, identification, sex, address, birthday, image) => {
        const cnx = await getConnection();
        const request = await cnx.request();
        request.input("phone", sql.VarChar(50), phone);
        request.input("identification", sql.VarChar(20), identification);
        request.input("email", sql.VarChar(128), email);
        request.input("sex", sql.BigInt, sex);
        request.input("address", sql.NVarChar(255), address);
        request.input("image", sql.VarChar(255), image);
        request.input("birthday", sql.VarChar(255), birthday);
        return request.query(sqlQueries.UpdateUsers);
    };

    return {
        GetUserInfos,
        UpdateUsers
    };
};

module.exports = { register };
