// server/routes/api/media.js
const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');
const { ROLES } = require('../../utils/constants');
const Media = require('../../models/media'); // Your Mongoose Media model
const multer = require('multer');
const crypto = require('crypto');
const path = require("path");
const { deleteFilesFromPath } = require("../../utils/deleteFiles");

// Multer setup for media files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure this directory exists
    cb(null, process.cwd() + "/file_manager/uploads/media");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + crypto.randomBytes(4).toString('hex');
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

// GET /api/media - Get all medias
router.get(
  '/',
  auth, // Assuming you want only authenticated users (admins) to view this
  role.check(ROLES.Admin),
  async (req, res) => {
    try {
      const medias = await Media.find().sort('-createdAt');
      return res.status(200).json({ medias });
    } catch (error) {
      console.error(error); // Log the error for debugging
      return res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  }
);

// POST /api/media/add - Add new media
router.post(
  '/add',
  auth,
  role.check(ROLES.Admin),
  upload.single('mediaUrl'), // Expecting a single file under the field name 'mediaUrl'
  async (req, res) => {
    try {
      const { active, default: isDefault } = req.body; // Use 'isDefault' to avoid conflict with JS keyword 'default'
      const file = req.file; // The uploaded file object from multer

      if (!file) {
        return res.status(400).json({ error: 'Media file is required.' });
      }

      const mediaUrl = `/uploads/media/${file.filename}`;

      // If this media is set as default, unset previous default
      if (isDefault === 'true') { // FormData sends boolean as strings
        await Media.updateMany({ default: true }, { default: false });
      }

      const media = new Media({
        mediaUrl,
        active: active === 'true', // Convert string to boolean
        default: isDefault === 'true' // Convert string to boolean
      });

      await media.save();

      return res.status(200).json({
        success: true,
        message: 'Media has been added successfully!',
        media
      });
    } catch (error) {
      console.error(error);
      // If there's an error after file upload but before save, delete the uploaded file
      if (req.file) {
        deleteFilesFromPath([`/uploads/media/${req.file.filename}`]);
      }
      return res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  }
);

// PUT /api/media/:id - Update media (for active/default toggles)
router.put(
  '/:id',
  auth,
  role.check(ROLES.Admin),
  async (req, res) => {
    try {
      const mediaId = req.params.id;
      const updateData = req.body; // This will contain { active: true/false } or { default: true/false }

      const media = await Media.findById(mediaId);
      if (!media) {
        return res.status(404).json({ error: 'Media not found.' });
      }

      // Handle 'default' logic: Only one can be true
      if (updateData.hasOwnProperty('default')) {
        const newDefaultStatus = updateData.default === true || updateData.default === 'true'; // Handle boolean or string from FormData

        if (newDefaultStatus) {
          // If trying to set this one as default, unset any others
          await Media.updateMany({ default: true, _id: { $ne: mediaId } }, { default: false });
        }
        media.default = newDefaultStatus;
      }

      // Handle 'active' logic
      if (updateData.hasOwnProperty('active')) {
        media.active = updateData.active === true || updateData.active === 'true'; // Handle boolean or string
      }

      await media.save();

      return res.status(200).json({
        success: true,
        message: 'Media updated successfully!',
        media // Return the updated media object
      });
    } catch (error) {
      console.error(error);
      return res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  }
);

// DELETE /api/media/:id - Delete media
router.delete(
  '/:id',
  auth,
  role.check(ROLES.Admin),
  async (req, res) => {
    try {
      const mediaId = req.params.id;
      const media = await Media.findById(mediaId);

      if (!media) {
        return res.status(404).json({ error: 'Media not found.' });
      }

      // Get the path to the file on disk
      const filePath = media.mediaUrl; // e.g., '/uploads/media/filename.ext'

      await media.deleteOne(); // Delete from database

      // Delete physical file from server
      if (filePath) {
        deleteFilesFromPath([filePath]); // Ensure deleteFilesFromPath can handle this relative path
      }

      return res.status(200).json({
        success: true,
        message: 'Media deleted successfully!'
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