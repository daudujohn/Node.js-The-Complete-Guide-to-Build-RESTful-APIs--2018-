const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');
const config = require('config');


module.exports = function () {
    winston.add(
        new winston.transports.File({ 
            filename: 'logfile.log', 
            handleExceptions: true, 
            handleRejections: true
        }, 
        new winston.transports.Console({
            colorize: true, 
            prettyPrint: true, 
            handleExceptions: true, 
            handleRejections: true
        })
    ))
    winston.add(new winston.transports.MongoDB({
        db: config.get('database.conn_string'), 
        level: 'info', 
        handleExceptions: true, 
        handleRejections: true
    }))
}