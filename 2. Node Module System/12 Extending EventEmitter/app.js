const EventEmmiter = require('events');
const Logger = require('./logger');
const logger = new Logger();

// a listener is a function that will be called when an event is raised
// Register a listener
logger.on('messageLogged', (arg) => { 
    console.log('listener called', arg)
})

logger.log('Hello there')