const mongoose = require('mongoose')
const Joi = require('joi')
const express = require('express');
const router = express.Router();
const {Movie, validateMovie} = require('../models/movie')
const {Genre} = require('../models/genre')

router.get('/', async(req, res) => {
    try{
        const movies = await Movie.find().sort('name')
        return res.send(movies)
    }
    catch(ex) {
        for (field in ex.errors){
            res.send(ex.errors[field].properties.message)
            console.log(ex.errors[field].properties.message)
        }
    }
})

router.get('/:id', async (req, res) => {
    // check if movie id is valid
    try{
        const movie = await Movie.findById(req.params.id)
        return res.send(movie)
    }
    catch(ex) {
        for (field in ex.errors){
            res.send(ex.errors[field].properties.message)
            console.log(ex.errors[field].properties.message)
        }
    }
})

router.post('/', async(req, res) => {
    const {error} = validateMovie(req.body)

    // if invalid return 400
    if (error) return res.status(400).send(error.details[0].message)

    // if valid, check if the genre of the movie exist before adding the movie
    const genre = Genre.findById(req.body.genreId)
    if (!genre) return res.status(400).send('Genre does not exist')

    let movie = new Movie({
        title: req.body.title, 
        genre: {
            _id: genre._id, 
            name: genre.name
        }, 
        numberInStock: req.body.numberInStock, 
        dailyRentalRate: req.body.dailyRentalRate
    });

    movie = await movie.save();
    return res.send(movie)
})

router.put('/:id', async(req, res) => {
    // check if req.body is valid
    const {error} = validateMovie(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    
    // validate the genre before updating the movie
    const genre = Genre.findById(req.body.genreId)
    if (!genre) return res.status(400).send('Genre does not exist')

    let updatedMovie = {
        name: req.body.name, 
        numberInStock: req.body.numberInStock, 
        dailyRentalRate: req.body.dailyRentalRate, 
        genreId: req.body.genreId
    }
    
    // update movie
    const movie = await Movie.findByIdAndUpdate(req.params.id, updatedMovie, {new: true})
    if (!movie) return res.status(400).send('Movie does not exist')

    return res.send(movie)
})

router.delete('/:id', async(req, res) => {
    // validate req.params.id
    try{
        const movie = await Movie.findByIdAndRemove(req.params.id)
        return res.send(movie)
    }
    catch(ex) {
        for (field in ex.errors){
            res.send(ex.errors[field].properties.message)
            console.log(ex.errors[field].properties.message)
        }
    }
})

module.exports = router;