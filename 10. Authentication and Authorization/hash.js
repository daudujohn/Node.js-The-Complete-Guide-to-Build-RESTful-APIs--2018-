const bcrypt = require('bcrypt');

(async () => {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash('1234', salt)
    console.log(salt)
    console.log(hashed)

})();