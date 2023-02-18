const express = require('express');
const router = express.Router();

router.get('/api/courses', (req, res) => {
    res.send(courses);
});

router.post('/api/courses', (req, res) => {
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

router.put('/api/courses/:id', (req, res) => {
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

router.delete('/api/courses/:id', (req, res) => {
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

router.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if (!course) return res.status(404).send(`Course ${req.params.id} was not found.`)
    res.send(course);
})

module.exports = router;