const express = require('express');
const router = express.Router();

// Define a route for getting locations
router.get('/', (req, res) => {
    res.send('Location list');
});

// Define a route for adding a new location
router.post('/', (req, res) => {
    res.send('Location added');
});

module.exports = router;
