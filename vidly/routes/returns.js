const express = require('express');
const { Rental } = require('../models/rental');
const router = express.Router();
const auth = require('../middleware/auth');
const { Movie } = require('../models/movie');
const Joi = require('joi');
const validate = require('../middleware/validate');

router.post('/', [auth, validate(validateReturn)], async(req, res) => {
    
    const rental = await Rental.lookup(req.body.customerId, req.body.movieId)

    if (!rental) return res.status(404).send('Rental not found')

    if (rental.dateReturned)
        return res.status(400).send('Rental has already been processed')

    rental.return();

    await rental.save();

    await Movie.updateOne({_id: req.body.movieId}, {
        $inc: {numberInStock: 1}
    })
    

    return res.status(200).send(rental)

})

function validateReturn(req) {
    const schema = Joi.object({
        customerId: Joi.objectId().required(), 
        movieId: Joi.objectId().required()
    })

    return schema.validate(req)
}

module.exports = router;