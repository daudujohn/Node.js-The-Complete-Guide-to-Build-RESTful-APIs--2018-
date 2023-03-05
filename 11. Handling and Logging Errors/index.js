const express = require('express');
const app = express();
const winston = require('winston');
require('express-async-errors');
const error = require('./middleware/error');

app.use(error)

const port = process.env.PORT || 3000
app.listen(port, () => winston.info(`listening on port ${port}...`))