const Joi = require('joi')
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const {User} = require('../models/user');
const mongoose = require('mongoose')

router.post('/', async(req, res) => {
    const {error} = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    try{
        // check if the user exists
        let user = await User.findOne({email: req.body.email})
        if (!user) return res.status(400).send('Invalid email or password');
        // if user exists, validate the plain password
        const validPassword = await bcrypt.compare(req.body.password, user.password)
        if (!validPassword) return res.status(400).send('Invalid email or password');

        res.send(true)
    }
    catch(ex) {
        for (field in ex.errors){
            res.send(ex.errors[field].properties.message)
            console.log('Error:', ex.errors[field].properties.message)
        }
    }
})


function validate(req){
    const schema = Joi.object({
        email: Joi.string().email().min(3).max(255).required(), 
        password: Joi.string().min(8).max(255).required()
    })
    return schema.validate(req);
}

module.exports = router;