// routes/api/organizer.js

const express = require('express');
const router = express.Router();
const Organizer = require('../../models/organizer');
const User = require('../../models/user');
const Event = require('../../models/event');
const { ROLES } = require('../../utils/constants');
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');

// GET all organizers with total event count
router.get('/', auth, role.check(ROLES.Admin), async (req, res) => {
  try {
    const organizersFetch = await Organizer.find().select('-__v');
    const organizers = await Promise.all(organizersFetch.map(async (org) => {
      const organizerUserId = await User.findOne({ organizer: org._id }).select('_id');
      let eventCount = 0
      if (organizerUserId) {
        eventCount = await Event.countDocuments({ user: organizerUserId?._id });
      }
      return {
        ...org._doc,
        eventCount
      };
    }));
    return res.json({ organizers });
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch organizers' });
  }
});

// GET a single organizer by ID, with populated event slugs
router.get('/:id', auth, role.check(ROLES.Admin), async (req, res) => {
  try {
    const organizer = await Organizer.findById(req.params.id).populate('event');
    if (!organizer) return res.status(404).json({ error: 'Organizer not found' });
    return res.json({ organizer });
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch organizer' });
  }
});

// PUT suspend organizer
router.put('/:id/suspend', auth, role.check(ROLES.Admin), async (req, res) => {
  try {
    const organizer = await Organizer.findById(req.params.id).populate('event');
    if (!organizer) return res.status(404).json({ error: 'Organizer not found' });

    organizer.isActive = false;
    await organizer.save();

    // Disable all associated events
    await Event.updateMany(
      { _id: { $in: organizer.event } },
      { $set: { isActive: false } }
    );

    return res.json({ organizer });
  } catch (error) {
    res.status(400).json({ error: 'Failed to suspend organizer' });
  }
});

// PUT resume organizer
router.put('/:id/resume', auth, role.check(ROLES.Admin), async (req, res) => {
  try {
    const organizer = await Organizer.findById(req.params.id).populate('event');
    if (!organizer) return res.status(404).json({ error: 'Organizer not found' });

    organizer.isActive = true;
    await organizer.save();

    // Re-activate all associated events
    await Event.updateMany(
      { _id: { $in: organizer.event } },
      { $set: { isActive: true } }
    );

    return res.json({ organizer });
  } catch (error) {
    res.status(400).json({ error: 'Failed to resume organizer' });
  }
});

// DELETE organizer
router.delete('/:id', auth, role.check(ROLES.Admin), async (req, res) => {
  try {
    const organizer = await Organizer.findById(req.params.id);
    if (!organizer) return res.status(404).json({ error: 'Organizer not found' });

    // Delete all related events or turn off all organizer events
    await Event.updateMany({ _id: { $in: organizer.event } }, { $set: { isActive: false } });

    await Organizer.findByIdAndUpdate(req.params.id, { $set: { banned: true } });
    //set organizer to banned
    await User.findOneAndUpdate({ organizer: req.params.id }, { $set: { banned: true } })

    return res.json({ message: 'Organizer has been banned and related events turned off successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete organizer' });
  }
});

module.exports = router;
