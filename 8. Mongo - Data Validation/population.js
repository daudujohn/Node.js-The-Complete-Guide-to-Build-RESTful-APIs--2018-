const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/playground')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err.message))

const authorSchema = new mongoose.Schema({
    name: String, 
    bio: String, 
    website: String
})
const Author = mongoose.model('Author', authorSchema)

const courseSchema = new mongoose.Schema({
    name: String, 
    author: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Author'
    }
})
const Course = mongoose.model('Course', courseSchema)

async function createAuthor(name, bio, website){
    const author = new Author({
        name: name, 
        bio: bio, 
        website: website
    })

    const result = await author.save();
    console.log(result);
}

async function createCourse(name, author){
    const course = new Course({
        name: name, 
        author: author
    })

    const result = await course.save();
    console.log(result);
}

async function listCourses(){
    const courses = await Course
        .find()
        .populate('author', 'name -_id')
        .select('name author');
    console.log(courses);
}

// createAuthor('Mosh', 'My bio', 'My Website');

// createCourse('Node Course', '63f8f16997908931ae1cc209')

listCourses()