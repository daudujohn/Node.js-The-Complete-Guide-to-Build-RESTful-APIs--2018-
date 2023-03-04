const bcrypt = require('bcrypt');
const _ = require('lodash');
const {User, validateUser} = require('../models/user');
const Joi = require('joi')
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')


router.get('/', async(req, res) => {
    try{
        const users = await User.find().sort('name')
        return res.send(users)
    }
    catch(ex) {
        for (field in ex.errors){
            res.send(ex.errors[field].properties.message)
            console.log(ex.errors[field].properties.message)
        }
    }
})

router.get('/:id', async (req, res) => {
    // check if the user id is valid
    try{
        const user = await User.findById(req.params.id)
        return res.send(user)
    }
    catch(ex) {
        for (field in ex.errors){
            res.send(ex.errors[field].properties.message)
            console.log('Error:', ex.errors[field].properties.message)
        }
    }
})

router.post('/', async(req, res) => {
    const {error} = validateUser(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    try{
        let user = await User.findOne({email: req.body.email})
        if (user) return res.status(400).send('User already registered.');

        user = new User(_.pick(req.body, ['name', 'email', 'password']))

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt)

        await user.save();

        const token = user.generateAuthToken();
        res.header("x-auth-token", token).send(_.pick(user, ['_id', 'name', 'email']))
    }
    catch(ex) {
        for (field in ex.errors){
            res.send(ex.errors[field].properties.message)
            console.log('Error:', ex.errors[field].properties.message)
        }
    }
})

router.put('/:id', async(req, res) => {
    // check if req.body is valid
    const {error} = validateMovie(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const updatedUser = _.pick(req.body, ['name', 'email', 'password'])
    
    const user = await User.findByIdAndUpdate(req.params.id, updatedUser, {new: true})
    if (!user) return res.status(400).send('User does not exist')

    return res.send(user)
})

router.delete('/:id', async(req, res) => {
    try{
        const user = await User.findByIdAndRemove(req.params.id)
        return res.send(user)
    }
    catch(ex) {
        for (field in ex.errors){
            res.send(ex.errors[field].properties.message)
            console.log(ex.errors[field].properties.message)
        }
    }
})

    module.exports = router;