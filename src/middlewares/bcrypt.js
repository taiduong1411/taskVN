const bcrypt = require('bcrypt');
const hashNumber = 10;

await bcrypt.hash(password, hashNumber, function(err, hash) {
    // Store hash in your password DB.

});