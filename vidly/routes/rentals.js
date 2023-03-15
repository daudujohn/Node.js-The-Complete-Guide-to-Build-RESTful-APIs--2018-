const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const mongoose = require('mongoose')
const Joi = require('joi')
const express = require('express');
const router = express.Router();
const {Rental, validateRental} = require('../models/rental');
const { Movie } = require('../models/movie');
const {Customer} = require('../models/customer');
const Fawn = require('fawn');

Fawn.init("mongodb://localhost/vidly")

router.get('/', async(req, res) => {
    const rentals = await Rental.find().sort('-dateOut')
    return res.send(rentals)
})

router.get('/:id', async(req, res) => {
    const rental = await Rental.findById(id)
    if (!rental) return res.status(404).send('Rental record not found')

    return res.send(rental);
})

router.post('/', [auth, validate(validateRental)], async(req, res) => {
    // check if movie exists in the db
    const movie = await Movie.findById(req.body.movieId)
    if (!movie) return res.status(400).send('Movie not found')
    if (movie.numberInStock === 0) return res.status(400).send(`${movie.title} currently unvailable. Check again later.`)

    // check if customer exists in the db
    const customer = await Customer.findById(req.body.customerId)
    if (!customer) return res.status(400).send('Customer not found')
    
    // Create new rental
    const rental = new Rental({
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

    // new Fawn.Task()
    //     .save('rentals', rental)
    //     .update('movies', {_id: movie._id}, {
    //         $inc: {numberInStock: -1}
    //     })
    //     .run();

    movie.numberInStock--;
    movie.save();
    await rental.save()


    res.send(rental);
})


module.exports = router;