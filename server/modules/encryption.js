const bcrypt = require('bcrypt');

const SALT_WORK_FACTOR = 10;

const publicAPI = {
    encryptPassword(password) {
        const salt = bcrypt.genSaltSync(SALT_WORK_FACTOR); 
        // generating a random salt
        return bcrypt.hashSync(password, salt);
    },
    comparePassword(candidatePassword, storedPassword) {
        // stored password and user entered password are compared
        return bcrypt.compareSync(candidatePassword, storedPassword);
    },
};

module.exports = publicAPI;