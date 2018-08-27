const rejectUnathenticated = (req, res, next) => {
    // checking if logged in
    if (req.isAuthenticated()) {
        // user authenticated, successful login
        next();
    } else {
        // user not authenticated
        res.sendStatus(403);
    }
};

module.exports = { rejectUnathenticated };