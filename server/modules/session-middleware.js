const cookieSession = require('cookie-session');
const warnings = require('../constants/warnings');

// user can enter username and password one time and stay logged in

const serverSessionSecret = () => {
    if (!process.env.SERVER_SESSION_SECRET ||
        process.env.SERVER_SESSION_SECRET.length < 8 ||
        process.env.SERVER_SESSION_SECRET === warnings.exampleBadSecret) {

            // if user doesn't have a good secret, gives warning
        console.log(warnings.badSecret);
    }
    
    return process.env.SERVER_SESSION_SECRET;
};

module.exports = cookieSession({
    secret: serverSessionSecret() || 'secret', // as defined in .env file
    key: 'user',
    resave: 'false',
    saveUninitialized: false,
    cookie: { maxage: 60000, secure: false },
});