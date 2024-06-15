const { Router } = require('express');
const { userRegister } = require('../controller/userRegister.js');
const router = Router();

router.route('/register').post(userRegister);
    
module.exports = router