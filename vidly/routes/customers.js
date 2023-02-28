const Joi = require('joi')
const {Customer, validateCustomer} = require('../models/customer')
const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')

router.get('/', async(req, res) => {
    try{
        const customers = await Customer.find().sort('name')
        return res.send(customers)
    }
    catch(ex) {
        for (field in ex.errors){
            res.send(ex.errors[field].properties.message)
            console.log(ex.errors[field].properties.message)
        }
    }
})

router.get('/:id', async(req, res) => {
    const customer = await Customer.findById(req.params.id)
    if (!customer) return res.status(404).send('customer does not exist')

    return res.send(customer);
})

router.post('/', async(req, res) => {
    // validate the request body
    const schema = Joi.object({
        name: Joi.string().min(3).required(), 
        isGold: Joi.boolean(), 
        phone: Joi.string().min(8).required()
    })
    const { error } = validateCustomer(schema, req.body)

    if (error) return res.status(400).send(error.details[0].message);

    try{
        const customer = new Customer({
            name: req.body.name, 
            phone: req.body.phone
        })
        if(req.body.isGold || !req.body.isGold) customer.isGold = req.body.isGold;

        await customer.save()

        res.send(customer);
    }
    catch(ex){
        for (field in ex.errors){
            res.status(400).send(ex.errors[field].properties.message)
            console.error('Error:', ex.errors[field].properties.message)
        }
    }
})

router.put('/:id', async(req, res) => {
    // validate the request body
    const schema = Joi.object({
        name: Joi.string().min(3), 
        isGold: Joi.boolean(), 
        phone: Joi.string().min(8)
    })
    const { error } = validateCustomer(schema, req.body)

    if (error) return res.status(400).send(error.details[0].message);

    let updatedField = {}
    if(req.body.isGold || !req.body.isGold) {updatedField.isGold = req.body.isGold}
    if(req.body.name) {updatedField.name = req.body.name}
    if(req.body.phone) {updatedField.phone = req.body.phone}

    console.log(req.body)
    console.log(updatedField)

    const customer = await Customer.findByIdAndUpdate(req.params.id, updatedField, {new: true})

    if (!customer) return res.status(400).send('Customer does not exist')

    return res.send(customer)
})

router.delete('/:id', async(req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id)

    if(!customer) return res.status(400).send('Customer not found')

    res.send(customer)
})

module.exports = router