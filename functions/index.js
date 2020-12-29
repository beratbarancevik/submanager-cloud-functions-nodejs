/*jslint node: true */
'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const mysql = require('./connection/mysql');

exports.automaticallySaveUserToFirestore = functions.auth.user().onCreate(async (user) => {
    try {
        const userId = user.uid;
        const username = generateRandomUsername();
        let userData = {
            id: userId,
            username: username,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };

        // firestore
        await admin.firestore().collection('user').doc(userId).set(userData);

        // mysql
        const connection = await mysql.connection();
        await addUserToMySQL(connection, userData);
        connection.release();
        return;
    } catch (err) {
        console.error(`User sign up error for userId: ${user.userId}`, err);
        return;
    }
});

const generateRandomUsername = () => {
    const allowedChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_';
    let randomUsername = '';
    for (let i = 0; i < 15; i++) {
        randomUsername += allowedChars.charAt(Math.floor(Math.random() * allowedChars.length));
    }
    return randomUsername;
};

const addUserToMySQL = (connection, user) => {
    return new Promise((resolve, reject) => {
        const query = `INSERT INTO user (id, username) VALUES ('${user.userId}', '${user.username}')`;
        connection.query(query, (err, results, fields) => {
            if (err) {
                console.error(`Error creating user in MySQL for userId: ${user.userId}`, err);
                reject(err);
                return;
            } else {
                resolve(results);
                return;
            }
        });
    });
};
