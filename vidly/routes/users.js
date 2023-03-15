const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const {User, validateUser} = require('../models/user');
const Joi = require('joi')
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')


router.get('/', async(req, res) => {
        const users = await User.find().sort('name')
        return res.send(users)
})

router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    return res.send(user)
})

router.post('/', validate(validateUser), async(req, res) => {

    let user = await User.findOne({email: req.body.email})
    if (user) return res.status(400).send('User already registered.');

    user = new User(_.pick(req.body, ['name', 'email', 'password']))

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt)

    await user.save();

    const token = user.generateAuthToken();
    res.header("x-auth-token", token).send(_.pick(user, ['_id', 'name', 'email']))
})

router.put('/:id', validate(validateUser), async(req, res) => {
    const updatedUser = _.pick(req.body, ['name', 'email', 'password'])
    
    const user = await User.findByIdAndUpdate(req.params.id, updatedUser, {new: true})
    if (!user) return res.status(400).send('User does not exist')

    return res.send(user)
})

router.delete('/:id', [auth, admin], async(req, res) => {
        const user = await User.findByIdAndRemove(req.params.id)
        return res.send(user)
})

    module.exports = router;