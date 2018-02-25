'use strict';
const crypto = require('crypto');

/* Generates random string of characters i.e salt. */
const genRandomString = function (length) {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex') /** convert to hexadecimal format */
        .slice(0, length);
    /** return required number of characters */
};

/* Hash password with pbkdf2 and sha512. */
const generateHash = function (password, salt) {
    let hashValue = crypto.pbkdf2Sync(password, salt, 2048, 32, 'sha512').toString('hex');
    /** Hashing algorithm */
    return hashValue;
};

const createHash = function (userPassword) {
    let salt = genRandomString(16);
    /** Gives us salt of length 16 */
    return {
        hash: generateHash(userPassword, salt),
        salt: salt
    };
};

module.exports = {generateHash, createHash};
