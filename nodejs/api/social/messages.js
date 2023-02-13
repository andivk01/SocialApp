const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const authentication = require('../../authentication.js');

router.get('/:userId', authentication(required=false), (req, res) => {
    const dbConn = require('../../database.js')
    const id = req.params.userId;
    if (isNaN(id)) {
        res.status(400).send({error: 'Invalid user id'});
        return;
    }

    let columns = 'njs_message.messageId, njs_message.userId, njs_user.username, njs_message.writedOn, njs_message.content, COUNT(njs_like.userId) AS likes';
    // query (without authentication) to get all messages from a user, ordered by writedOn, with the number of likes
    let query = `SELECT ${columns} FROM njs_message 
    LEFT JOIN njs_like ON njs_message.messageId = njs_like.messageId LEFT JOIN njs_user ON njs_message.userId = njs_user.userId WHERE njs_message.userId = ? GROUP BY njs_message.messageId ORDER BY writedOn DESC`;
    let params = [id];

    if (typeof res.locals.authData !== 'undefined') { // if the user is authenticated
        // query to get all messages from a user, ordered by writedOn, with the number of likes and if the current user liked the message
        query = `SELECT ${columns}, SUM(IF(njs_like.userId = ?, 1, 0)) AS liked FROM njs_message 
        LEFT JOIN njs_like ON njs_message.messageId = njs_like.messageId  LEFT JOIN njs_user ON njs_message.userId = njs_user.userId WHERE njs_message.userId = ? GROUP BY njs_message.messageId ORDER BY writedOn DESC`;
        params = [res.locals.authData.userId, id];
    }

    dbConn.query(query, params, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send({error: 'Internal server error'});
            return;
        }
        res.status(200).send(result);
    });
});

router.get('/:userId/:idMsg', (req, res) => {
    const dbConn = require('../../database.js');
    const messageId = req.params.idMsg;
    const userId = req.params.userId;
    if (isNaN(messageId) || isNaN(userId)) {
        res.status(400).send({error: 'Invalid message or user id'});
        return;
    }
    // query to get a message from a user, with the number of likes
    const query = `SELECT njs_message.messageId, njs_message.userId, njs_message.writedOn, njs_message.content, COUNT(njs_like.userId) AS likes FROM njs_message
        LEFT JOIN njs_like ON njs_message.messageId = njs_like.messageId WHERE njs_message.userId = ? AND njs_message.messageId = ? GROUP BY njs_message.messageId ORDER BY writedOn DESC`;
    dbConn.query(query, [userId, messageId], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send({error: 'Internal server error'});
            return;
        }
        res.status(200).send(result);
    });
});

let insertMessageValidator = [
    check('content').trim().escape().isLength({min: 3}).withMessage('Content must be at least 3 character long')
];
router.post('/', authentication(), insertMessageValidator, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).send({error: errors.array()});
        return;
    }
    
    const dbConn = require('../../database.js');
    const userId = res.locals.authData.userId;
    const content = req.body.content;

    const writedOn = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const query = 'INSERT INTO njs_message (userId, writedOn, content) VALUES (?, ?, ?)';
    dbConn.query(query, [userId, writedOn, content], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send({error: 'Internal server error'});
            return;
        }
        res.status(200).send(result);
    });
});

module.exports = router;