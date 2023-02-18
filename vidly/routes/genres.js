const express = require('express');
const router = require('../../5. Express- Advanced Topics/routes/courses');
router = express.Router();

const genres = [
    {id: 1, genre: 'pop'},
    {id: 2, genre: 'alternative'}
]

router.get('/', (req, res) => {
    res.send(genres);
    res.end();
})

router.get('/:id', (req, res) => {
    // check if id exists
    const genre = genres.find(g => g.id === parseInt(req.params.id))
    
    // if it doesn't, return 404
    if (!genre) return res.status(404).send('Genre not found')

    // if id exists, return its genre
    return res.send(genre);
})

router.post('/', (req, res) => {
    // check if id already exists
    const genre = genres.find(g => g.id === parseInt(req.params.id))

    // if it does, return 400
    if (genre) return res.status(400).send(`${genre.genre} already exists`);

    // if id doesnt exist, validate
    schema = {
        id: Joi.number(), 
        genre: Joi.string().length(3).required()
    }
    const {error} = validateGenre(schema = schema, req.body)

    // if invalid return 400
    if (error) return res.status(400).send(error)

    // if valid, add it to genres
    genres.push(genre)

    // return added genre
    res.send(genre);
})

router.put('/:id', (req, res) => {
    // check if id exists
    const genre = genres.find(g => g.id === parseInt(req.params.id))

    // if it doesnt, return 404
    if (!genre) return res.status(404).send("Page does not exist")

    // if id exists, validate it
    const {error} = validateGenre(req.body)

    // if invalid, return 400
    if (error) return res.status(400).send(error);

    // if valid, update genre
    if (req.body.id) genre.id = req.body.id
    if (req.body.genre) genre.genre = req.body.genre

    // return updated genre
    res.send(genre)
})

router.delete('/:id', (req, res) => {
    // check if id exists
    const genre = genres.find(g => g.id === parseInt(req.params.id))

    // if it doesnt exist, return 400
    if (!genre) return res.status(400).send("Bad request")

    // if id exists, delete
    const index = genres.indexOf(genre)
    genres.splice(index, 1)

    // return deleted genre
    res.send(genre)
})

function validateGenre(schema = {
    id: Joi.number(), 
    genre: Joi.string().length(3)}, genre) {

    return Joi.validate(genre, schema);
}

module.exports = router;