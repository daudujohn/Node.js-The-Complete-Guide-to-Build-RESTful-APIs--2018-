const Joi = require('joi')
const mongoose = require('mongoose')


const customerSchema = new mongoose.Schema({
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
})

const Customer = mongoose.model('Customer', customerSchema);


function validateCustomer(schema, customer){
    return schema.validate(customer)
}

exports.Customer = Customer;
exports.validateCustomer = validateCustomer;