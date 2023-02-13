const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {check, validationResult} = require('express-validator');

let signupValidator = [
    check('username').trim().escape().isLength({min: 3, max: 32}).withMessage('Username must be between 3 and 32 characters long'),
    check('name').trim().escape().isLength({min: 3, max: 32}).withMessage('Name must be between 3 and 32 characters long'),
    check('surname').trim().escape().isLength({min: 3, max: 32}).withMessage('Surname must be between 3 and 32 characters long'),
    check('bio').trim().escape().isLength({min: 3, max: 255}).withMessage('Bio must be between 3 and 255 characters long'),
    check('password').trim().escape().isLength({min: 3, max: 32}).withMessage('Password must be between 3 and 32 characters long')
];
router.post('/signup', signupValidator, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).send({error: errors.array()});
        return;
    }

    const dbConn = require('../database.js');
    const {username, name, surname, bio, password} = req.body;
    const query = 'INSERT INTO njs_user (username, name, surname, bio, password) VALUES (?, ?, ?, ?, ?)';
    dbConn.query(query, [username, name, surname, bio, password], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                res.status(400).send({error: "Username already exists"});
                return;
            }
            console.log(err);
            res.status(500).send({error: "Internal server error"});
            return;
        }
        res.send({success: "User created"});
    });
});

router.post('/signin', (req, res) => {
    const dbConn = require('../database.js');
    const {username, password} = req.body;
    if (typeof username !== 'string' || typeof password !== 'string') {
        res.status(400).send({error: `Invalid given types: username: ${typeof username}, password: ${typeof password}`});
        return;
    }

    const query = 'SELECT * FROM njs_user WHERE username = ? AND password = ?';
    dbConn.query(query, [username, password], (err, result) => {
        if (err) {
            res.status(500).send({error: "Internal server error"});
            return;
        }
        if (result.length === 0) {
            res.send({error: "Invalid credentials"});
            return;
        } else {
            const tokenData = {userId: result[0].userId};
            let secret = require('../private/config.json').secret;
            const token = jwt.sign(tokenData, secret, {expiresIn: '1d'});
            res.cookie('token', token, {httpOnly: true});
            res.send({token: token});
        }
    });

});

module.exports = router;