const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');

router.use(cookieParser());
router.use(express.json());

router.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
});

router.use('/auth', require('./api/auth.js'));
router.use('/social', require('./api/social.js'));

router.all('/', (req, res) => {
    res.send(require('./public/endpoints.json')); // require(...) returns cached data
});

router.all('*', (req, res) => { // if no route matches, redirect to /api
    res.redirect('/api');
});

module.exports = router;