const EventEmmiter = require('events');
const emmiter = new EventEmmiter();

// a listener is a function that will be called when an event is raised
// Register a listener

emmiter.on('messageLogged', () => {
    console.log('listener called')
})

//emit is to make a noise, produce - signalling an event has occured
// it takes a string arguement that is the name of the event

// Raise an event
emmiter.emit('messageLogged')