const config = require('config');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
    name: {
        type: String, 
        minlength: 2, 
        maxlength: 64, 
        required: true
    }, 
    email: {
        type: String, 
        unique: true, 
        minlength: 3, 
        maxlength: 255, 
        required: true 
    }, 
    password: {
        type: String, 
        minlength: 8, 
        maxlength: 1024, 
        required: true
    }
})

userSchema.methods.generateAuthToken = function (){
	const token = jwt.sign({_id: this._id}, config.get('jwtPrivateKey'));
	return token;
}

const User = new mongoose.model('User', userSchema)

function validateUser (user){
    const schema = Joi.object({
        name: Joi.string().min(2).max(64).required(), 
        email: Joi.string().email().min(3).max(255).required(), 
        password: Joi.string().min(8).max(255).required()
    })
    return schema.validate(user);
}

exports.User = User
exports.validateUser = validateUser;