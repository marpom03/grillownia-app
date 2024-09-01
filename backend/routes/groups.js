const express = require('express');
const router = express.Router();

// Define a route for getting groups
router.get('/', (req, res) => {
    res.send('Group list');
});

// Define a route for creating a new group
router.post('/', (req, res) => {
    res.send('Group created');
});

module.exports = router;
