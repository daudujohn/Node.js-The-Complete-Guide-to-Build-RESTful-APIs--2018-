
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

// get all the published frontend and backend courses, 
// sort them by price in a descending order,
// pick only their name, price and author, 
// and display them

const Course = mongoose.model('Course', courseSchema)

async function getCourses(){
    return await Course
        .find({isPublished: true, tags: {$in: ['backend', 'frontend']}})
        .sort('-price')
        .select('name author price')
}

async function run(){
    const course = await getCourses()
    console.log(course)
}

run();