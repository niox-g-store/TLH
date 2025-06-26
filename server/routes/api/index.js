const router = require('express').Router();

const getServerStatus = require('./status');


// api status
router.use('/status', getServerStatus)

module.exports = router;
