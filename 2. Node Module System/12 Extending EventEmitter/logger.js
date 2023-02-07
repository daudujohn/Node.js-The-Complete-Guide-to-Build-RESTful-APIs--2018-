const EventEmmiter = require('events');

let url = 'http://mylogger.io/log';

class Logger extends EventEmmiter {
    log(message){
        
    // Send an HTTP request
    console.log(message);

    // Raise an event
    this.emit('messageLogged', {id: 1, url: 'http://'})
    }
}

module.exports = Logger;