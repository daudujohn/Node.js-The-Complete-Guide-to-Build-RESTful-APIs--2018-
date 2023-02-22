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

// Get all the published backend courses, 
// sort them by name, 
// pick only their name and author, 
// and display them

const Course = mongoose.model('Course', courseSchema)

async function getCourses(){
    const course = await Course
        .find({tags: {$in: ['backend']}, isPublished: true})
        .sort({name: 1})
        .select({name: 1, author: 1})

    return course
}

async function run(){
    const courses = await getCourses()
    console.log(courses);
}

run();