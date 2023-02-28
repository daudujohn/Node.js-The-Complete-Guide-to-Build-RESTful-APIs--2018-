const mongoose = require('mongoose')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi);

const rentalSchema = new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
            name: {
                type: String, 
                minlength: 3, 
                maxlength: 255, 
                trim: true, 
                required: true
            }, 
            isGold: {
                type: Boolean, 
                required: false
            }, 
            phone: {
                type: String, 
                minlength: 8, 
                maxlength: 20, 
                trim: true, 
                required: true
            }
        }), 
        required: true
    }, 
    movie: {
        type: new mongoose.Schema({
            title: {
                type: String, 
                trim: true, 
                minlength: 3, 
                maxlength: 255, 
                lowercase: true, 
                required: true, 
            }, 
            dailyRentalRate: {
                type: Number, 
                required: true, 
                min: 0, 
                max: 255
            }
        }), 
        required: true
    }, 
    dateOut: {
        type: Date, 
        required: true, 
        default: Date.now
    }, 
    dateReturned: {
        type: Date
    }, 
    rentalFee: {
        type: Number, 
        min: 0
    }
})
const Rental = mongoose.model('Rental', rentalSchema)

function validateRental(rental) {
    const schema = Joi.object({
        customerId: Joi.objectId().required(), 
        movieId: Joi.objectId().required()
    })

    return schema.validate(rental)
}

exports.Rental = Rental;
exports.validateRental = validateRental;