const Joi = require('joi');
const express = require('express');
const app = express();
app.use(express.json());

const courses = [
    {id: 1, name: 'course1'},
    {id: 2, name: 'course2'},
    {id: 3, name: 'course3'},
    {id: 4, name: 'course4'},
]


app.get('/', (req, res) => {
    res.send('Hello world');
})

app.get('/', (req, res) => {
    res.send(courses);
});

app.post('/', (req, res) => {
    const schema = {
        name: Joi.string().min(3).required(), 
        id: Joi.number()
    }

    const result = Joi.validate(req.body, schema)

    if (result.error){
        // 400 Bad request
        res.status(400).send(result.error.details[0].message)
        return;
    }

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
})

app.put('/:id', (req, res) => {
    // look up the course
    // if it doesn't exist, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if (!course) {
        res.status(404).send(`Course ${req.params.id} does not exist`);
        return;
    }

    // if it exists, Validate course input
    const {error} = validateCourse(req.body);
    
    // if invalid, return 400 - Bad request
    if(error) {
        res.status(400).send(error.details[0].message)
        return;
    }
        
    // Update course
    if (req.body.id) course.id = req.body.id;
    if (req.body.name) course.name = req.body.name;

    // Return updated course to client
    res.send(course)
})

app.delete('/:id', (req, res) => {
    // check if id exists
    // if it doesnt, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id))

    if (!course) {
        res.status(404).send(`Course ${req.params.id} does not exist`);
        return;
    }

    // if id exists, remove from list
    const index = courses.indexOf(course)
    courses.splice(index, 1)

    // return deleted course to client
    res.send(course)
})

app.get('/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if (!course) return res.status(404).send(`Course ${req.params.id} was not found.`)
    res.send(course);
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