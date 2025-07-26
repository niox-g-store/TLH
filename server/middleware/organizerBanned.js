const Organizer = require('../models/organizer');

const organizerBanned = async (req, res, next) => {
  try {
    const { id } = req.user.organizer
    const organizer = await Organizer.findById(id ? req.user.organizer._id : req.user.organizer)
    if (req.user.banned || organizer.banned) {
        return res.status(400).json({
            error: 'Your account has been disabled and you cannot make this request'
        });
    }
    next();
  } catch (error) {
    return res.status(400).json({
      error: 'An unexpected error occurred while checking maintenance status.'
    });
  }
};

module.exports = organizerBanned;