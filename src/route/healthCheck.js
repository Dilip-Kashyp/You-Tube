const { Router } = require('express');
const  healthcheck  = require("../controller/healthCheck.js");

const router = Router();

router.route('/').get(healthcheck);

module.exports = router;