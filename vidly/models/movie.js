const Joi = require('joi')
const mongoose = require('mongoose')
const Customer = require('./customer')
const {genreSchema} = require('./genre')

const movieSchema = new mongoose.Schema({
    title: {
        type: String, 
        trim: true, 
        minlength: 3, 
        maxlength: 255, 
        lowercase: true, 
        required: true, 
        validate: {
            isAsync: true, 
            validator: async function(value) {
                if(this.parent().isNew){
                    const existingMovie = await mongoose.model('Movie').findOne({ title: value });
                    return !existingMovie;
                }
                return true;
            },
            message: 'Movie already exists',
        } 
    }, 
    genre: {
        type: genreSchema, 
        required: true, 
    },  
    numberInStock: {
        type: Number, 
        required: true, 
        min: 0, 
        max: 2552
    }, 
    dailyRentalRate: {
        type: Number, 
        required: true, 
        min: 0, 
        max: 255
    }
})

const Movie = mongoose.model('Movie', movieSchema);

function validateMovie(movie){
    const schema = Joi.object({
        title: Joi.string().min(5).max(50).required(), 
        genreId: Joi.objectId().required(), 
        numberInStock: Joi.number().min(0).required(), 
        dailyRentalRate: Joi.number().min(0).required()
    })
    return schema.validate(movie)
}

exports.validateMovie = validateMovie;
exports.Movie = Movie;