const dbDebug = require('debug')('app:db')
const config = require('config')
const mongoose = require('mongoose');
mongoose.connect(config.get('database.conn_string'))
    .then(() => dbDebug('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err.message))

const courseSchema = new mongoose.Schema({
    name: String, 
    author: String, 
    tags: [String], 
    date: {type: Date, default: Date.now},
    isPublished: Boolean
})

async function createCourse(){
    const Course = mongoose.model('Course', courseSchema);
    const course = new Course({
        name: 'React Course', 
        author: 'Mosh', 
        'tags': ['react', 'frontend'], 
        isPusblished: true
    })
    
    const result = await course.save();
    console.log(result)
}

createCourse();