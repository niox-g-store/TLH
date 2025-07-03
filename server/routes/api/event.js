const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');
const { ROLES } = require('../../utils/constants');
const Event = require('../../models/event');
const path = require("path");
const { updateEventStatus } = require("../../utils/event");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.cwd() + "/file_manager/uploads");  // ensure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

router.post(
  '/add',
  auth,
  role.check(ROLES.Admin, ROLES.Organizer),
  upload.single('image'),  // changed to single file upload
  async (req, res) => {
    try {
      const {
        name,
        description,
        startDate,
        endDate,
        location,
        category,
        capacity,
        isActive
      } = req.body;

      const user = req.user._id;
      const file = req.file;

      if (!name || !description || !startDate || !endDate || !location || !category || !file) {
        return res.status(400).json({ error: 'All required fields must be filled.' });
      }

      const existingEvent = await Event.findOne({ name });
      if (existingEvent) {
        return res.status(400).json({ error: 'An event with this name already exists.' });
      }

      const imageUrl = `/uploads/${file.filename}`;

      const event = new Event({
        name,
        description,
        startDate,
        endDate,
        location,
        category,
        capacity: capacity || null,
        isActive: isActive !== undefined ? isActive : true,
        imageUrl,
        user
      });

      updateEventStatus(event);

      await event.save();

      return res.status(200).json({
        success: true,
        message: 'Event has been added successfully!',
        event
      });
    } catch (error) {
      console.error(error);
      return res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  }
);

// GET /events
router.get(
  '/',
  auth,
  role.check(ROLES.Admin, ROLES.Organizer),
  async (req, res) => {
    try {
      let events;

      if (req.user.role === ROLES.Organizer) {
        // Organizer: only return their own events
        events = await Event.find({ user: req.user._id }).sort('-createdAt');
      } else {
        // Admin: return all events
        events = await Event.find({}).sort('-createdAt');
      }

      return res.status(200).json({ events });
    } catch (error) {
      console.error(error);
      return res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  }
);

module.exports = router;
