const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db')
const config = require('config')
const Joi = require('joi');
const logger = require("./logger")
const express = require('express');
const app = express();
const helmet = require('helmet');
const morgan = require('morgan');

app.set('view engine', 'pug');
app.set('views', './views'); // This is usually the default, so its optional

app.use(express.json());
app.use(logger);
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(helmet());

// Configuration
console.log(`Application Name: ${config.get('name')}`)
console.log(`Mail Server: ${config.get('mail.host')}`)
console.log(`Mail password: ${config.get('mail.password')}`)

if (app.get('env') === 'development'){
    app.use(morgan('tiny'));
    startupDebugger('Morgan enabled...')
    console.log(app.get('env'))
}

// Some db work
dbDebugger('Connected to database...')

const courses = [
    {id: 1, name: 'course1'},
    {id: 2, name: 'course2'},
    {id: 3, name: 'course3'},
    {id: 4, name: 'course4'},
]


app.get('/', (req, res) => {
    const context = {
        'title': 'My Express App',
        'message': 'Hello'
    }
    res.render('index', context)
})


// To get route parameters as an object. Route parameters are used for mandatory route information
app.get('/api/posts/:year/:month', (req, res) => {
    res.send(req.params);
})
 
// To get query parameters as an object. Route parameters are used for optional information
// http://api/posts/2019/3?sortBy=name 
app.get('/api/posts/:year/:month/:day', (req, res) => {
    res.send(req.query);
})

function validateCourse(course){
    const schema = {
        id: Joi.number(), 
        name: Joi.string().min(3)
    }
    return Joi.validate(course, schema)
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));