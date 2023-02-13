const express = require('express');
const router = express.Router();
const authentication = require('../authentication.js');

router.get('/users/:id', (req, res) => {
    const dbConn = require('../database.js');
    const id = req.params.id;
    if (isNaN(id)) {
        res.status(400).send({error: 'Invalid id'});
        return;
    }

    const query = 'SELECT * FROM njs_user WHERE userId = ?';
    dbConn.query(query, [id], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send({error: 'Internal server error'});
        }
        res.status(200).send(result);
    });
});

router.get('/feed', authentication(), (req, res) => {
    const dbConn = require('../database.js');

    // query to get all messages from users that the current user follows, ordered by writedOn, with the number of likes and if the current user liked the message
    const query = `
    SELECT njs_message.messageId, njs_message.userId, njs_user.username, njs_message.writedOn, njs_message.content, COUNT(njs_like.userId) AS likes, SUM(IF(njs_like.userId = ?, 1, 0)) AS liked
    FROM njs_message LEFT JOIN njs_like ON njs_message.messageId = njs_like.messageId 
    LEFT JOIN njs_user ON njs_message.userId = njs_user.userId WHERE njs_message.userId IN (
        SELECT followedUser FROM njs_follow WHERE njs_follow.userId = ?
    ) GROUP BY njs_message.messageId ORDER BY writedOn DESC`;
    dbConn.query(query, [res.locals.authData.userId, res.locals.authData.userId], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send({error: 'Internal server error'});
        }
        res.status(200).send(result);
    });
});

router.get('/search', (req, res) => {
    const dbConn = require('../database.js');
    let toSearch = req.query.q;
    if (typeof toSearch !== 'string') {
        res.status(400).send('Invalid query');
        return;
    }
    
    toSearch = "%" + toSearch + "%";
    const query = 'SELECT * FROM njs_user WHERE username LIKE ? OR name LIKE ? OR surname LIKE ?';
    dbConn.query(query, Array(3).fill(toSearch), (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send({error: 'Internal server error'});
        }
        res.status(200).send(result);
    });
});

router.get('/whoami', authentication(), (req, res) => {
    const dbConn = require('../database.js');
    const query = 'SELECT userId, username, name, surname, bio FROM njs_user WHERE userId = ?';
    dbConn.query(query, [res.locals.authData.userId], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send({error: 'Internal server error'});
        }
        res.status(200).send(result[0]);
    });
});



router.use('/like', require('./social/like.js'));
router.use('/messages', require('./social/messages.js'));
router.use('/followers', require('./social/followers.js'));

module.exports = router;