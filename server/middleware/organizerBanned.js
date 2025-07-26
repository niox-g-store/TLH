const Organizer = require('../models/organizer');

const organizerBanned = async (req, res, next) => {
  try {
    if (req.user.banned) {
      return res.status(400).json({
        error: 'Your user account has been disabled and you cannot make this request.'
      });
    }
    let organizerDoc = null;
    const { organizer } = req.user;

    if (organizer) {
      const organizerId = typeof organizer === 'object' && organizer !== null ? organizer._id : organizer;
      if (organizerId) {
        organizerDoc = await Organizer.findById(organizerId);
        if (!organizerDoc) {
          return res.status(404).json({
            error: 'Associated organizer profile not found.'
          });
        }
        if (organizerDoc.banned) {
          return res.status(400).json({
            error: 'Your organizer account has been disabled and you cannot make this request.'
          });
        }
      }
    }

    next();

  } catch (error) {
    return res.status(400).json({
      error: 'An unexpected server error occurred while checking account status.'
    });
  }
};

module.exports = organizerBanned;