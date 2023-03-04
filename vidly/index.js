const config = require('config');
const mongoose = require('mongoose');
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi);
const express = require('express');
const app = express();
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies')
const rentals = require('./routes/rentals')
const users = require('./routes/users');
const auth = require('./routes/auth')

if (!config.get('jwtPrivateKey')){
    console.error("FATAL ERROR: jwtPrivateKey is not defined.");
    process.exit(1);
}

mongoose.connect(config.get('database.conn_string'))
    .then(console.log('Connected to MongoDB...'))
    .catch((err) => console.error("Error:", err.message))

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers)
app.use('/api/movies', movies)
app.use('/api/rentals', rentals)
app.use('/api/users', users)
app.use('/api/auth', auth)


const port = process.env.PORT || 3000
app.listen(port, () => console.log(`listening on port ${port}...`))
