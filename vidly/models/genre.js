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
        validate: {
            isAsync: true, 
            validator: async function(value) {
                if(this.parent().isNew){
                    const existingGenre = await mongoose.model('Genre').findOne({ name: value });
                    return !existingGenre;
                }
                return true;
            },
            message: 'Genre already exists',
        }
    }
})
// create a model
const Genre = mongoose.model('Genre', genreSchema);

function validateGenre(genre) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required()
    })
    return schema.validate(genre);
}

exports.Genre = Genre;
exports.validateGenre = validateGenre;
exports.genreSchema = genreSchema;