/*jslint node: true */
'use strict';

const mysql = require('mysql');
const keys = require('../keys/connection_keys.js');

const config = {
    connectionLimit: keys.MYSQL_CONNECTION_LIMIT,
    host: keys.MYSQL_HOST,
    user: keys.MYSQL_USER,
    password: keys.MYSQL_PASSWORD,
    database: keys.MYSQL_DATABASE
};

let pool = mysql.createPool(config);

module.exports = pool;