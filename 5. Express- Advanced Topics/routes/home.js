const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    const context = {
        'title': 'My Express App',
        'message': 'Hello'
    }
    res.render('index', context)
})

module.exports = router;