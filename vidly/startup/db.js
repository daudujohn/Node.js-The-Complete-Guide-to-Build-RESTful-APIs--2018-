const config = require('config');
const mongoose = require('mongoose');
const winston = require('winston');

module.exports = function () {
    const db = config.get('database.conn_string');
    mongoose.connect(db)
        .then(() => {winston.info(`Connected to ${db}...`)})
}