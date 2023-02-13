const jwt = require('jsonwebtoken');

let auth = (required=true) => {
    return (req, res, next) => {
        const token = req.cookies.token;
        if (typeof token === 'undefined') {
            const bearerHeader = req.headers['authorization'];
            if (typeof bearerHeader !== 'undefined') {
                token = bearerHeader.split(' ')[1];
            } else {
                if (required) {
                    res.status(403).send({error: "Please, provide a token"});
                } else {
                    next();
                }
                return;
            }
        }

        let secret = require('./private/config.json').secret;
        jwt.verify(token, secret, (err, authData) => {
            if (err) {
                res.clearCookie('token');
                res.status(403).send({error: "Token not valid"});
            } else {
                res.locals.authData = authData;
                next();
            }
        });
    }
}

module.exports = auth;