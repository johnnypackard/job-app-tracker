const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');

const router = express.Router();

// Ajax GET request for user info if user is authenticated
router.get('/', rejectUnauthenticated, (req, res) => {
    // Send back user object from db
    res.send(req.user);
});

// POST request with new user data
// encrypting password with HASH before being inserted into db
router.post('/register', (req, res, next) => {
    console.log('req: ', req.body);
    
    const username = req.body.username;
    const password  = encryptLib.encryptPassword(req.body.password);
    
    const queryText = 'INSERT INTO person (username, password) VALUES ($1, $2) RETURNING id';
    pool.query(queryText, [username, password])
        .then(() => { res.sendStatus(201); })
        .catch((err) => { next(err); });
});

// Login form authentication/login POST
// userStrategy.authenticate('local') is middleware running on this route
// will run POST if successful
// will send 404 if unsuccessful
router.post('/login', userStrategy.authenticate('local'), (req, res) => {
    res.sendStatus(200);
});

// clear server session info about user
router.get('/logout', (req, res) => {
    req.logout(); // <----- PassportJS built-in method of logging user out
    res.sendStatus(200);
});

module.exports = router;