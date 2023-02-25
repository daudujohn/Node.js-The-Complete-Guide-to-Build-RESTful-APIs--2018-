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
    authors: [authorSchema]
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

async function createCourse(name, authors){
    const course = new Course({
        name: name, 
        authors: authors
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

async function updateAuthor(courseId){
    const course = await Course.updateOne({_id: courseId}, {
        $set: {
            'author.name': 'John Smith'
        }
    })
}

async function addAuthor (courseId, author){
    const course = await Course.findById(courseId)
    course.authors.push(author);
    course.save();
}

async function removeAuthor(courseId, authorId){
    const course = await Course.findById(courseId)
    const author = course.authors.id(authorId);
    author.remove();
    course.save();
}

// createCourse('Angular Course', [
//     new Author({name: 'Paulo'}), 
//     new Author({name: 'Ursela'}), 
//     new Author({name: 'Mitch'})
// ])

// addAuthor('63f93b76fedce95f76703d28', new Author({
//     name: 'swgIndigrwrgo', 
//     bio: 'Hi there. No, I do not like purple', 
//     website: 'www.indiegoes.com'
// }))

removeAuthor('63f93b76fedce95f76703d28', '63f95f9677e4c14a98d5027d')

// updateAuthor('63f937efc8c0dd4ced5bc5a7')

// listCourses()