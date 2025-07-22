const express = require('express');
const router = express.Router();
const Setting = require('../../models/setting');
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');
const { ROLES } = require('../../utils/constants');

// Get settings
router.get('/', async (req, res) => {
  try {
    const settings = await Setting.findOne();
    return res.json(settings);
  } catch (err) {
    return res.status(400).json({ error: 'Error fetching settings' });
  }
});

   // Update settings
router.put('/', auth, role.check(ROLES.Admin), async (req, res) => {
  try {
    const settings = await Setting.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    return res.json(settings);
  } catch (err) {
    return res.status(400).json({ error: 'Error updating settings' });
  }
});

module.exports = router;