// routes/api/organizer.js

const express = require('express');
const router = express.Router();
const Organizer = require('../../models/organizer');
const Event = require('../../models/event');
const { ROLES } = require('../../utils/constants');
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');

// GET all organizers with total event count
router.get('/', auth, role.check(ROLES.Admin), async (req, res) => {
  try {
    const organizers = await Organizer.find().select('-__v');
    const result = await Promise.all(organizers.map(async (org) => {
      const eventCount = await Event.countDocuments({ organizer: org._id });
      return {
        ...org._doc,
        eventCount
      };
    }));
    res.json({ organizers: result });
  } catch (error) {
    console.error('Error fetching organizers:', error);
    res.status(500).json({ error: 'Failed to fetch organizers' });
  }
});

// GET a single organizer by ID, with populated event slugs
router.get('/:id', auth, role.check(ROLES.Admin), async (req, res) => {
  try {
    const organizer = await Organizer.findById(req.params.id).populate({
      path: 'event',
      select: 'slug name'
    });
    if (!organizer) return res.status(404).json({ error: 'Organizer not found' });
    res.json({ organizer });
  } catch (error) {
    console.error('Error fetching organizer details:', error);
    res.status(500).json({ error: 'Failed to fetch organizer' });
  }
});

// PUT suspend organizer
router.put('/:id/suspend', auth, role.check(ROLES.Admin), async (req, res) => {
  try {
    const updated = await Organizer.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Organizer not found' });
    res.json({ organizer: updated });
  } catch (error) {
    console.error('Error suspending organizer:', error);
    res.status(500).json({ error: 'Failed to suspend organizer' });
  }
});

// PUT resume organizer
router.put('/:id/resume', auth, role.check(ROLES.Admin), async (req, res) => {
  try {
    const updated = await Organizer.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Organizer not found' });
    res.json({ organizer: updated });
  } catch (error) {
    console.error('Error resuming organizer:', error);
    res.status(500).json({ error: 'Failed to resume organizer' });
  }
});

// DELETE organizer
router.delete('/:id', auth, role.check(ROLES.Admin), async (req, res) => {
  try {
    const deleted = await Organizer.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Organizer not found' });
    res.json({ message: 'Organizer deleted successfully' });
  } catch (error) {
    console.error('Error deleting organizer:', error);
    res.status(500).json({ error: 'Failed to delete organizer' });
  }
});

module.exports = router;
