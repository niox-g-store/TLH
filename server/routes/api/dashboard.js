const express = require('express');
const router = express.Router();
const multer = require('multer');
const keys = require('../../config/keys.js');
const crypto = require('crypto');
const path = require("path");
const mailgun = require('../../services/mailgun.js');
const Newsletter = require('../../models/newsletter.js');
const Campaign = require('../../models/campaign.js');
const User = require('../../models/user.js');
const Guest = require('../../models/guest.js');
const Event = require('../../models/event.js');
const Organizer = require('../../models/organizer');

const role = require('../../middleware/role.js');
const auth = require('../../middleware/auth.js');
const { ROLES } = require('../../utils/constants');
const getAnalytics = require('../../utils/analytics.js');

router.get(
    '/first-three',
    auth,
    role.check(ROLES.Admin, ROLES.Organizer),
    async (req, res) => {
    try {
        
    } catch (error) {

    }
})

module.exports = router;
