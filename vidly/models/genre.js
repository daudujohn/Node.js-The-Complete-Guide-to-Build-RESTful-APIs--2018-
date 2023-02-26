const mongoose = require('mongoose')
const Joi = require('joi')

// create a valid schema
const genreSchema = mongoose.Schema({
    name: {
        type: String, 
        required: true, 
        minlength: 3, 
        maxlength: 50, 
        trim: true, 
    }
}, {validate: {
    isAsync: true, 
    validator: async function(value) {
      const existingGenre = await mongoose.model('Genre').findOne({ name: value });
      return !existingGenre;
    },
    message: 'Genre already exists',
}})
// create a model
const Genre = mongoose.model('Genre', genreSchema);

function validateGenre(schema, genre) {
    return schema.validate(genre);
}

exports.Genre = Genre;
exports.validateGenre = validateGenre;
exports.genreSchema = genreSchema;