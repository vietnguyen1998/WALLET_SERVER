"use strict";

const utils = require( "../../utils" );

const register = async ( { sql, getConnection } ) => {
	const sqlQueries = await utils.loadSqlQueries( "WaterOther" , "query" );

    const CustomerInfo = async (makh) => {
		const cnx = await getConnection();
        const request = await cnx.request();
        request.input("makh", sql.VarChar(50), makh);
        return request.query(sqlQueries.CustomerInfo);
    };

    const StudentInfo = async (studentID) => {
        const cnx = await getConnection();
        const request = await cnx.request();
        request.input("studentID", sql.VarChar(50), studentID);
        return request.query(sqlQueries.StudentInfo);
    };

    const ChairInfo = async () => {
        const cnx = await getConnection();
        const request = await cnx.request();
        return request.query(sqlQueries.ChairInfo);
    };

    const UpdateChair = async (num) => {
        const cnx = await getConnection();
        const request = await cnx.request();
        console.log("1")
        request.input("num", sql.Int, num);
        console.log("3")

        return request.query(sqlQueries.UpdateChair);
    };
	return {
        CustomerInfo,
        StudentInfo,
        ChairInfo,
        UpdateChair
	};
};

module.exports = { register };
