const router = require('express').Router();

const getServerStatus = require('./status');
const auth = require('./auth');
const user = require('./user');


// api status
router.use('/status', getServerStatus);
router.use('/auth', auth);
router.use('/user', user);

module.exports = router;
