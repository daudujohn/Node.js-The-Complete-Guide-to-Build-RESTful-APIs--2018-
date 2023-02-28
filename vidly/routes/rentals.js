const mongoose = require('mongoose')
const Joi = require('joi')
const express = require('express');
const router = express.Router();
const {Rental, validateRental} = require('../models/rental');
const { Movie } = require('../models/movie');
const {Customer} = require('../models/customer');
const { custom } = require('joi');

router.get('/', async(req, res) => {
    const rentals = await Rental.find().sort('-dateOut')
    return res.send(rentals)
})

router.get('/:id', async(req, res) => {
    const rental = await Rental.findById(id)
    if (!rental) return res.status(404).send('Rental record not found')

    return res.send(rental);
})

router.post('/', async(req, res) => {
    // Validate request body
    const {error} = validateRental(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    // check if movie exists in the db
    const movie = await Movie.findById(req.body.movieId)
    if (!movie) return res.status(400).send('Movie not found')
    if (movie.numberInStock === 0) return res.status(400).send(`${movie.title} currently unvailable. Check again later.`)

    // check if customer exists in the db
    const customer = await Customer.findById(req.body.customerId)
    if (!customer) return res.status(400).send('Customer not found')
    
    // Create new rental
    try{
        let rental = new Rental({
        customer: {
            _id: customer._id, 
            name: customer.name, 
            phone: customer.phone
        }, 
        movie: {
            _id: movie._id, 
            title: movie.title, 
            dailyRentalRate: movie.dailyRentalRate
        }
    })
    if ('isGold' in req.body && 'isGold' in customer) rental.customer.isGold = customer.isGold

    rental = await rental.save();

    movie.numberInStock--;
    movie.save();

    res.send(rental);
    }

    catch(ex){
        for (field in ex.errors){
            res.status(400).send(ex.errors[field].properties.message)
            console.error('Error:', ex.errors[field].properties.message)
        }
    }
})


module.exports = router;