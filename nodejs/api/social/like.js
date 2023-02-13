const express = require('express');
const router = express.Router();
const authentication = require('../../authentication.js');

router.post('/:idMessage', authentication(), (req, res) => {
    const dbConn = require('../../database.js');
    const idMessage = req.params.idMessage;
    if (isNaN(idMessage)) {
        res.status(400).send(JSON.stringify({error: 'Invalid message id'}));
        return;
    }

    // query to add the like to the message
    const query = 'INSERT INTO njs_like (userId, messageId) VALUES (?, ?)';
    dbConn.query(query, [res.locals.authData.userId, idMessage], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                res.status(400).send(JSON.stringify({error: 'Already liked'}));
                return;
            }
            console.log(err);
            res.status(500).send(JSON.stringify({error: 'Internal server error'}));
        }
        res.status(200).send(result);
    });
});

router.delete('/:idMessage', authentication(), (req, res) => {
    const dbConn = require('../../database.js');
    const idMessage = req.params.idMessage;
    if (isNaN(idMessage)) {
        res.status(400).send(JSON.stringify({error: 'Invalid message id'}));
        return;
    }

    const query = 'DELETE FROM njs_like WHERE userId = ? AND messageId = ?';
    dbConn.query(query, [res.locals.authData.userId, idMessage], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send(JSON.stringify({error: 'Internal server error'}));
            return;
        }
        res.status(200).send(result);
    });
});

module.exports = router;