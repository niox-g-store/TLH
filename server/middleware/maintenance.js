const Setting = require('../models/setting');
const { ROLES } = require('../utils/constants');

const maintenance = async (req, res, next) => {
  try {
    const setting = await Setting.findOne();

    if (setting && setting.maintenance) {
      if (!req.user || req.user.role !== ROLES.Admin) {
        return res.status(400).json({
          error: 'Site is currently under maintenance.'
        });
      }
    }
    next();
  } catch (error) {
    return res.status(400).json({
      error: 'An unexpected error occurred while checking maintenance status.'
    });
  }
};

module.exports = maintenance;