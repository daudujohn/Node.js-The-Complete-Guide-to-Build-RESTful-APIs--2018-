const auth = require('../middleware/auth');
const admin = require('../middleware/admin')
const mongoose = require('mongoose')
const Joi = require('joi')
const express = require('express');
const router = express.Router();
const {Genre, validateGenre} = require('../models/genre');


router.get('/', async (req, res) => {
    const genres = await Genre.find().sort('name')
    res.send(genres);
    res.end();
});

router.get('/:id', async (req, res) => {
    // check if id exists
    const genre = await Genre.findById(req.params.id);
    
    // if it doesn't, return 404
    if (!genre) return res.status(404).send('Genre not found')

    // if id exists, return its genre
    return res.send(genre);
})

router.post('/', auth, async (req, res) => {
    // if id doesnt exist, validate
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    })
    const {error} = validateGenre(schema, req.body)

    // if invalid return 400
    if (error) return res.status(400).send(error.details[0].message)

    // if valid, add it to genres
    const genre = new Genre({
        name: req.body.name
    })
    await genre.save();

    // return added genre
    res.send(genre);
})

router.put('/:id', auth, async (req, res) => {
    // if id exists, validate it
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    })
    const {error} = validateGenre(schema, req.body)
    
    // if invalid, return 400
    if (error) return res.status(400).send(error.details[0].message);

    // if valid, update genre
    const genre = await Genre.findByIdAndUpdate(req.params.id, {
        name: req.body.name
    }, {
        new: true
    })

    // If invalid, return 404, 
    if(!genre) return res.status(404).send('The genre was not found')

    // else return updated genre
    return res.send(genre)
})

router.delete('/:id', [auth, admin], async(req, res) => {
    // if id exists
    const genre = await Genre.findByIdAndRemove(req.params.id)

    // if it doesnt exist, return 400
    if (!genre) return res.status(400).send("Bad request")

    // return deleted genre
    res.send(genre)
})

module.exports = router;