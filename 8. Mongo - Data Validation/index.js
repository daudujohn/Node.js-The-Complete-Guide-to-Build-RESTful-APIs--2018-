const config = require('config')
const mongoose = require('mongoose');
mongoose.connect(config.get('database.conn_string'))
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err.message))

const courseSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true, 
        minlength: 3, 
        maxlength: 255
        // match: /pattern/
    }, 
    category: {
        type: String, 
        enum: ['web', 'mobile', 'network'], 
        required: true
    }, 
    author: {type: String, required: true}, 
    tags: {
        type: Array, 
        validate: {
            isAsync: true, 
            validator:  async function(v) {
                setTimeout(() => {
                    const res = typeof(v)==Array && v.length > 0;
                    return res
                }, 3000);
            },
            message: 'A course should have at least one tag'
        }
    }, 
    date: {type: Date, default: Date.now},
    isPublished: Boolean, 
    price: {
        type: Number, 
        required: function() { // an arrow function will not work here
            return this.isPublished
        }, 
        min: 10, 
        max: 200
    }
})

const Course = mongoose.model('Course', courseSchema);

async function createCourse(){
    const course = new Course({
        name: 'Vue Course', 
        category: '-',
        author: 'Jackson', 
        tags: null, 
        isPublished: true, 
        price: 50
    })
    
    try{
        const result = await course.save();
        console.log(result)
    }
    catch(ex){
        for (field in ex.errors){
            console.log(ex.errors[field])
        }
    }
}
createCourse();

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
    const result1 = await Course.update({_id: id}, {
        $set: {
            author: 'Mosh', 
            isPublished: false
        }
    })
    console.log(result1)
}

async function removeCourse(){
    const result = await Course.delete({_id: id})
    console.log(result)
}