const config = require('config');
const mongoose = require('mongoose');
const Joi = require('joi');
const express = require('express');
const app = express();
const genres = require('./routes/genres');
const customers = require('./routes/customers');

mongoose.connect(config.get('database.conn_string'))
    .then(console.log('Connected to MongoDB...'))
    .catch((err) => console.error("Error:", err.message))

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers)


const port = process.env.PORT || 3000
app.listen(port, () => console.log(`listening on port ${port}...`))
