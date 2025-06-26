const express = require('express');
const router = express.Router();
// const Setting = require('../../models/settings');

router.get('/', async (req, res) => {
    try {
      // const isActive = await Setting.findById("settings");
      const isActive = true;
      if (isActive) {
        return res.status(200).json({ status: 'active', message: 'Server is active' });
      } else {
        return res.status(500).json({ status: 'inactive', message: 'Server is not active' });
      }
    } catch (error) {
      return res.status(500).json({ status: 'error', message: 'Server is not active' });
    }
});

module.exports = router;
