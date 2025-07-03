const express = require('express');
const router = express.Router();
const multer = require('multer');
const crypto = require('crypto');
const path = require("path");
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');
const { ROLES } = require('../../utils/constants');
const Event = require('../../models/event');
const { updateEventStatus } = require("../../utils/event");
const { deleteFilesFromPath } = require("../../utils/deleteFiles");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.cwd() + "/file_manager/uploads/events");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + crypto.randomBytes(4).toString('hex');
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

const removeImagesFromEvent = (event, removeImageUrls) => {
  if (!event || !Array.isArray(event.imageUrls)) return event;

  const normalizedPaths = removeImageUrls.map(url => {
    const parts = url.split('/api/');
    return '/' + parts[1] || url;
  });

  event.imageUrls = event.imageUrls.filter(imagePath => {
    return !normalizedPaths.includes(imagePath.replace(/\\/g, '/'));
  });

  return event;
}


router.post(
  '/add',
  auth,
  role.check(ROLES.Admin, ROLES.Organizer),
  upload.array('images', 6),
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
      const files = req.files;

      if (!name || !description || !startDate || !endDate || !location || !category) {
        return res.status(400).json({ error: 'All required fields must be filled.' });
      }

      if (!files || files.length === 0) {
        return res.status(400).json({ error: 'At least one image file is required.' });
      }

      const existingEvent = await Event.findOne({ name });
      if (existingEvent) {
        return res.status(400).json({ error: 'An event with this name already exists.' });
      }

      // const imageUrl = `/uploads/${file.filename}`;
      const imageUrls = files.map((file) => `/uploads/events/${file.filename}`);

      const event = new Event({
        name,
        description,
        startDate,
        endDate,
        location,
        category,
        capacity: capacity || null,
        isActive: isActive !== undefined ? isActive : true,
        imageUrls,
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
      return res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  }
);

router.get(
  '/:id',
  auth,
  role.check(ROLES.Admin, ROLES.Organizer),
  async (req, res) => {
    try {
      const eventId = req.params.id;

      // Validate ObjectId format if you want (optional)
      if (!eventId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ error: 'Invalid event ID.' });
      }

      const event = await Event.findById(eventId);

      if (!event) {
        return res.status(404).json({ error: 'Event not found.' });
      }

      // Optional: If Organizer, only allow access to their own event
      if (req.user.role === ROLES.Organizer && !event.user.equals(req.user._id)) {
        return res.status(403).json({ error: 'Access denied.' });
      }

      return res.status(200).json({ event });
    } catch (error) {
      console.error(error);
      return res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  }
);


router.put(
  '/:id',
  auth,
  role.check(ROLES.Admin, ROLES.Organizer),
  upload.array('images', 6),
  async (req, res) => {
    try {
      const eventId = req.params.id;
      let {
        name,
        description,
        startDate,
        endDate,
        location,
        category,
        capacity,
        isActive,
        removeImage
      } = req.body;

      const files = req.files;
      if (!Array.isArray(removeImage)) { removeImage = Array(removeImage) }

      // Validate required fields if necessary
      if (!name || !description || !startDate || !endDate || !location || !category) {
        return res.status(400).json({ error: 'All required fields must be filled.' });
      }

      // Find the event by id
      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ error: 'Event not found.' });
      }

      // Organizer can only update their own events
      if (req.user.role === ROLES.Organizer && !event.user.equals(req.user._id)) {
        return res.status(403).json({ error: 'Access denied.' });
      }

      // Update event fields
      event.name = name;
      event.description = description;
      event.startDate = startDate;
      event.endDate = endDate;
      event.location = location;
      event.category = category;
      event.capacity = capacity || null;
      event.isActive = isActive !== undefined ? isActive : event.isActive;

      if (!removeImage.includes(undefined) && removeImage.length > 0) {
        removeImagesFromEvent(event, removeImage);
          const normalizedPaths = removeImage.map(url => {
            const parts = url.split('/api/');
            return '/' + parts[1] || url;
          });
        deleteFilesFromPath(normalizedPaths)
      }

      // If new images are uploaded, replace imageUrls
      if (files && files.length > 0) {
        const newImagePaths = files.map(file => `/uploads/events/${file.filename}`);
        event.imageUrls = [...event.imageUrls, ...newImagePaths];
      }

      // Update status using your utility
      updateEventStatus(event);

      await event.save();

      return res.status(200).json({
        success: true,
        message: 'Event updated successfully!',
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


router.delete(
  '/:id',
  auth,
  role.check(ROLES.Admin, ROLES.Organizer),
  async (req, res) => {
    try {
      const eventId = req.params.id;

      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ error: 'Event not found.' });
      }

      // Organizer can only delete their own events
      if (req.user.role === ROLES.Organizer && !event.user.equals(req.user._id)) {
        return res.status(403).json({ error: 'Access denied.' });
      }

      deleteFilesFromPath(event.imageUrls)
      await event.deleteOne();

      return res.status(200).json({
        success: true,
        message: 'Event deleted successfully!'
      });
    } catch (error) {
      console.error(error);
      return res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  }
);


module.exports = router;
