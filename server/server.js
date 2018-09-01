const express = require('express');
require('dotenv').config();

const app = express();
const bodyParser = require('body-parser');
const sessionMiddleware = require('./modules/session-middleware');

const passport = require('./strategies/user.strategy');

const userRouter = require('./routes/user.router');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Passport session config
app.use(sessionMiddleware);

// start Passport sessions
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/user', userRouter);

// serve static files
app.use(express.static('build'));

// Server port
const PORT = process.env.PORT || 5000;

// spin up server
app.listen(PORT, () => {
    console.log(`spinning server on port: ${PORT}`); 
});
