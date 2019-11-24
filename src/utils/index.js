"use strict";

const fse = require( "fs-extra" );
const { join } = require( "path" );
var jwt = require('jsonwebtoken');
var config = require('../../config');

const loadSqlQueries = async (module, folderName) => {
    // determine the file path for the folder
    const filePath = join( process.cwd(), "src" ,"database", module , folderName );

    // get a list of all the files in the folder
    const files = await fse.readdir( filePath );

    // only files that have the .sql extension
    const sqlFiles = files.filter( f => f.endsWith( ".sql" ) );

    // loop over the files and read in their contents
    const queries = {};
    for ( let i = 0; i < sqlFiles.length; i++ ) {
        const query = fse.readFileSync( join( filePath, sqlFiles[ i ] ), { encoding: "UTF-8" } );
        queries[ sqlFiles[ i ].replace( ".sql", "" ) ] = query;
    }
    return queries;
};

const verifyToken = (req, res, next) => {

  // check header or url parameters or post parameters for token
  var token = req.headers['x-access-token'];
  if (!token) 
    return res.status(403).send({ auth: false, errmessage: 'No token provided.' });

  // verifies secret and checks exp
  jwt.verify(token, config.secret, function(err, decoded) {      
    if (err) 
      return res.status(500).send({ auth: false, errmessage: err });    

    // if everything is good, save to request for use in other routes
    req.phone = decoded.phone;
    next();
  });
}

module.exports = {
    loadSqlQueries,
    verifyToken
};
