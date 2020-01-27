"use strict";

const utils = require( "../../utils" );

const register = async ( { sql, getConnection } ) => {
	const sqlQueries = await utils.loadSqlQueries( "WaterOther" , "query" );

    const CustomerInfo = async (makh) => {
		const cnx = await getConnection();
        const request = await cnx.request();
        console.log(makh)
        request.input("makh", sql.VarChar(50), makh);
        return request.query(sqlQueries.CustomerInfo);
	};
	return {
        CustomerInfo
	};
};

module.exports = { register };
