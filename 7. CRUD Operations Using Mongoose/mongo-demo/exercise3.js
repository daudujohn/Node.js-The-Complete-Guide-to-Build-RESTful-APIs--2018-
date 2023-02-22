
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/mongo-exercises')
    .then(() => console.log('connected to db...'))
    .catch(err => console.error('could not connect...', err.message))

const courseSchema = new mongoose.Schema({
    name: String, 
    author: String, 
    tags: [String],
    date: {type: Date, default: Date.now()}, 
    isPublished: Boolean,
    price: Number
})

// Get all the published courses that are $15 or more, 
// or have the word 'by' in their title.

const Course = mongoose.model('Course', courseSchema)

async function getCourses(){
    return await Course
        .find({isPublished: true})
        .or([
            {name: /.*by.*/i}, 
            {price: {$gte: 15}}
        ])
}

async function run(){
    const course = await getCourses()
    console.log(course)
}

run();