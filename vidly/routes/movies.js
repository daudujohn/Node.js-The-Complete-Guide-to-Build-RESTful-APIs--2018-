const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const mongoose = require('mongoose')
const Joi = require('joi')
const express = require('express');
const router = express.Router();
const {Movie, validateMovie} = require('../models/movie')
const {Genre} = require('../models/genre')

router.get('/', async(req, res) => {
    const movies = await Movie.find().sort('name')
    return res.send(movies)
})

router.get('/:id', async (req, res) => {
    // check if movie id is valid
        const movie = await Movie.findById(req.params.id)
        return res.send(movie)
})

router.post('/', auth, async(req, res) => {
    const {error} = validateMovie(req.body)

    // if invalid return 400
    if (error) return res.status(400).send(error.details[0].message)

    // if valid, check if the genre of the movie exist before adding the movie
    const genre = await Genre.findById(req.body.genreId)
    if (!genre) return res.status(400).send('Genre does not exist')

    const movie = new Movie({
        title: req.body.title, 
        genre: genre, 
        numberInStock: req.body.numberInStock, 
        dailyRentalRate: req.body.dailyRentalRate
    });  

    await movie.save();
    return res.send(movie)
})

router.put('/:id', auth, async(req, res) => {
    // check if req.body is valid
    const {error} = validateMovie(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    
    // validate the genre before updating the movie
    const genre = await Genre.findById(req.body.genreId)
    if (!genre) return res.status(400).send('Genre does not exist')

    const updatedMovie = {
        title: req.body.title, 
        numberInStock: req.body.numberInStock, 
        dailyRentalRate: req.body.dailyRentalRate, 
    }
    
    // update movie
    const movie = await Movie.findByIdAndUpdate(req.params.id, updatedMovie, {new: true})
    if (!movie) return res.status(400).send('Movie does not exist')

    return res.send(movie)
})

router.delete('/:id', [auth, admin], async(req, res) => {
    // validate req.params.id
    const movie = await Movie.findByIdAndRemove(req.params.id)
    return res.send(movie)
})

module.exports = router;