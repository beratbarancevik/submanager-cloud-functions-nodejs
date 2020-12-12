/*jslint node: true */
'use strict';

const mySqlConnectionPool = require('./mysql_connection');

const connection = () => {
    return new Promise((resolve, reject) => {
        mySqlConnectionPool.getConnection((err, connection) => {
            if (err) {
                console.error(`MySQL connection error: ${err}`);
                reject(err);
                return;
            } else {
                resolve(connection);
                return;
            }
        });
    });
};

module.exports = {
    connection
};