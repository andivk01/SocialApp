const express = require('express');
const router = express.Router();
const authentication = require('../../authentication.js');

router.get('/:id', (req, res) => {
    const dbConn = require('../../database.js');
    const id = req.params.id;
    if (isNaN(id)) {
        res.status(400).send({error: 'Invalid id'});
        return;
    }

    // query to get all the followers of the user
    const query = 'SELECT userId, username, name, surname, bio FROM njs_user WHERE userId IN (SELECT userId FROM njs_follow WHERE followedUser = ?)';
    dbConn.query(query, [id], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send({error: 'Internal server error'});
            return;
        }
        res.status(200).send(result);
    });
});

router.post('/:id', authentication(), (req, res) => {
    const dbConn = require('../../database.js');
    const id = req.params.id;
    if (isNaN(id)) {
        res.status(400).send({error: 'Invalid id'});
        return;
    }
    if (id == res.locals.authData.userId) {
        res.status(400).send({error: 'You cant follow yourself'});
        return;
    }

    const query = 'INSERT INTO njs_follow (userId, followedUser) VALUES (?, ?)';
    dbConn.query(query, [res.locals.authData.userId, id], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send({error: 'Internal server error'});
            return;
        }
        res.status(200).send(result);
    });
});

router.delete('/:id', authentication(), (req, res) => {
    const dbConn = require('../../database.js');
    const id = req.params.id;
    if (isNaN(id)) {
        res.status(400).send({error: 'Invalid id'});
        return;
    }

    const query = 'DELETE FROM njs_follow WHERE userId = ? AND followedUser = ?';
    dbConn.query(query, [res.locals.authData.userId, id], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send({error: 'Internal server error'});
            return;
        }
        res.status(200).send(result);
    });
});

module.exports = router;