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

const Course = mongoose.model('Course', courseSchema);

async function createCourse(){
    const course = new Course({
        name: 'React Course', 
        author: 'Mosh', 
        'tags': ['react', 'frontend'], 
        isPubslished: true
    })
    
    const result = await course.save();
    console.log(result)
}

async function getCourses(){
    const courses = await Course
    .find({author: 'Mosh'})
    .limit(10)
    .sort({name: 1})
    .select({name: 1, tags: 1});
    console.log(courses);
}

async function countCourses(){
    const count = await Course
    .find({ $or: [{tags: {$in: ['frontend']}}]})
    // .or([{tags: ['backend']}, {tags: ['end']}])
    .limit(10)
    .sort({name: 1})
    .countDocuments()

    console.log(count);
}
// countCourses();


// getCourses();

// There are two approaches to update a document
async function updateCourse(id) {
    // Query first approach
    // findById()
    // Modify its properties
    // save()
    const course = await Course.findById(id);
    if (!course) return;

    course.isPublished = true;
    course.author = 'Another author'
    // or
    course.set({
        isPublished: true, 
        author: 'Another author'
    })

    const result = await course.save()
    console.log(result)

    // Update first approach
    // Update database directly
    // Optionally: get the updated document
}

updateCourse();