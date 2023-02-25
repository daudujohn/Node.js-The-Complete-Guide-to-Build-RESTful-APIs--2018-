const { expression } = require('joi')
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
    }, 
    genre: {
        type: genreSchema, 
        required: true, 
    }, 
    validate: {
        isAsync: true, 
        validator: async function(value) {
          const existingMovie = await mongoose.model('Movie').findOne({ title: value });
          return !existingMovie;
        },
        message: 'Movie already exists',
    },
    numberInStock: {
        type: Number, 
        required: true, 
        min: 0, 
        max: 255
    }, 
    dailyRentalRate: {
        type: Number, 
        required: true, 
        min: 0, 
        max: 255
    }, 
})

const Movie = mongoose.model('Movie', movieSchema);

function validateMovie(movie){
    const schema = {
        title: Joi.string().min(5).max(50).required(), 
        genreId: Joi.string().required(), 
        numberInStock: Joi.number().min(0).required(), 
        dailyRentalRate: Joi.number().min(0).required()
    }
    return schema.validate(movie)
}

exports.validateMovie = validateMovie;
exports.Movie = Movie;