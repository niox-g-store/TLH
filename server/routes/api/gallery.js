const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');
const { ROLES } = require('../../utils/constants');
const Gallery = require('../../models/gallery');
const multer = require('multer');
const crypto = require('crypto');
const path = require("path");
const { deleteFilesFromPath } = require("../../utils/deleteFiles");
const { encodeImageToBlurhash } = require('../../utils/encodeMedia');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.cwd() + "/file_manager/uploads/gallery");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + crypto.randomBytes(4).toString('hex');
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

const removeMediaFromGallery = (gallery, removeImageUrls) => {
  if (!gallery || !Array.isArray(gallery.media)) return gallery;

  const normalizedPaths = removeImageUrls.map(url => {
    const parts = url.split('/api/');
    return '/' + parts[1] || url;
  });

  gallery.media = gallery.media.filter(imagePath => {
    return !normalizedPaths.includes(imagePath.replace(/\\/g, '/'));
  });

  return gallery;
}

// GET /gallery - Get all galleries
router.get(
  '/',
  async (req, res) => {
    try {
      let galleries;

      galleries = await Gallery.find()
        .populate('user')
        .sort('-createdAt');
      return res.status(200).json({ galleries });
    } catch (error) {
      return res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  }
);

// GET /gallery/:id - Get single gallery
router.get(
  '/:id',
  auth,
  role.check(ROLES.Admin),
  async (req, res) => {
    try {
      const galleryId = req.params.id;
      const gallery = await Gallery.findById(galleryId)
        .populate('user')

      if (!gallery) {
        return res.status(404).json({ error: 'Gallery not found.' });
      }

      return res.status(200).json({ gallery });
    } catch (error) {
      return res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  }
);

// user view
router.get('/fetch_slug/:slug', async(req, res) => {
  try {
    const slug = req.params.slug;
    if (!slug) {
      return res.status(404).json({
        error: "gallery doesn't exist"
      })
    }
    const gallery = await Gallery.findOne({slug})
    if (gallery) {
      gallery.views += 1
      await gallery.save()
      return res.status(200).json({ gallery });
    } else {
      return res.status(201).json()
    }

  } catch (error) {
    return res.status(400).json({
      error: 'Your request could not be processed. Please try again.',
    });
  }
})

// POST /gallery/add - Add new gallery
router.post(
  '/add',
  auth,
  role.check(ROLES.Admin),
  upload.fields([{ name: 'media', maxCount: 11 }, { name: 'banner', maxCount: 1 }]),
  async (req, res) => {
    try {
      const { name, description, date, active = 'true' } = req.body;
      const user = req.user._id;
      const mediaFiles = req.files.media;
      const bannerFile = req.files.banner ? req.files.banner[0] : null;

      if (!name || !date) {
        // Clean up uploaded files if validation fails
        if (mediaFiles) mediaFiles.forEach(file => deleteFilesFromPath([`/uploads/gallery/${file.filename}`]));
        if (bannerFile) deleteFilesFromPath([`/uploads/gallery/${bannerFile.filename}`]);
        return res.status(400).json({ error: 'All required fields must be filled.' });
      }
      if (!mediaFiles || mediaFiles.length === 0) {
        if (bannerFile) deleteFilesFromPath([`/uploads/gallery/${bannerFile.filename}`]);
        return res.status(400).json({ error: 'At least one media file is required.' });
      }
      if (!bannerFile) {
        if (mediaFiles) mediaFiles.forEach(file => deleteFilesFromPath([`/uploads/gallery/${file.filename}`]));
        return res.status(400).json({ error: 'Banner image is required.' });
      }

      const existingGallery = await Gallery.findOne({ name });
      if (existingGallery) {
        if (mediaFiles) mediaFiles.forEach(file => deleteFilesFromPath([`/uploads/gallery/${file.filename}`]));
        if (bannerFile) deleteFilesFromPath([`/uploads/gallery/${bannerFile.filename}`]);
        return res.status(400).json({ error: 'A gallery with this name already exists.' });
      }

      const mediaItems = [];
      for (const file of mediaFiles) {
        const mediaUrl = `/uploads/gallery/${file.filename}`;
        let mediaType = file.mimetype.startsWith('image/') ? 'image' : (file.mimetype.startsWith('video/') ? 'video' : 'other');
        let blurhash = null;

        if (mediaType === 'image') {
          const fullPath = path.join(process.cwd(), "/file_manager", mediaUrl);
          blurhash = await encodeImageToBlurhash(fullPath);
        } else if (mediaType === 'other') {
          continue;
        }
        mediaItems.push({ mediaUrl, mediaType, blurhash });
      }

      const bannerUrl = `/uploads/gallery/${bannerFile.filename}`; // Banner path

      const gallery = new Gallery({
        name,
        description,
        date,
        media: mediaItems,
        bannerUrl, // Save banner URL
        active: active === 'true',
        user
      });

      await gallery.save();

      return res.status(200).json({
        success: true,
        message: 'Gallery has been added successfully!',
        gallery
      });
    } catch (error) {
      // Clean up all uploaded files in case of error
      if (req.files) {
        if (req.files.media) req.files.media.forEach(file => deleteFilesFromPath([`/uploads/gallery/${file.filename}`]));
        if (req.files.banner) req.files.banner.forEach(file => deleteFilesFromPath([`/uploads/gallery/${file.filename}`]));
      }
      return res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  }
)

// PUT /gallery/:id - Update gallery
router.put(
  '/:id',
  auth,
  role.check(ROLES.Admin),
  upload.fields([{ name: 'media', maxCount: 11 }, { name: 'banner', maxCount: 1 }]),
  async (req, res) => {
    try {
      const galleryId = req.params.id;
      let { name, description, date, removeMedia, removeBanner, active = 'true' } = req.body;
      const mediaFiles = req.files.media;
      const bannerFile = req.files.banner ? req.files.banner[0] : null;

      // Ensure removeMedia is an array
      if (removeMedia && !Array.isArray(removeMedia)) {
          removeMedia = [removeMedia];
      } else if (!removeMedia) {
          removeMedia = [];
      }

      const gallery = await Gallery.findById(galleryId);
      if (!gallery) {
        // Clean up newly uploaded files if gallery not found
        if (mediaFiles) mediaFiles.forEach(file => deleteFilesFromPath([`/uploads/gallery/${file.filename}`]));
        if (bannerFile) deleteFilesFromPath([`/uploads/gallery/${bannerFile.filename}`]);
        return res.status(404).json({ error: 'Gallery not found.' });
      }

      // Update gallery fields
      gallery.name = name;
      gallery.description = description;
      gallery.date = date;
      gallery.active = active === 'true';

      const filesToDeleteFromDisk = [];

      // Handle existing media removal
      if (removeMedia.length > 0) {
        const mediaAfterRemovalFilter = gallery.media.filter(mediaItem => {
            const shouldRemove = removeMedia.includes(mediaItem.mediaUrl);
            if (shouldRemove) {
                filesToDeleteFromDisk.push(mediaItem.mediaUrl);
            }
            return !shouldRemove;
        });
        gallery.media = mediaAfterRemovalFilter;
      }

      // Handle new media uploads
      if (mediaFiles && mediaFiles.length > 0) {
        const newMediaItems = [];
        for (const file of mediaFiles) {
          const mediaUrl = `/uploads/gallery/${file.filename}`;
          let mediaType = file.mimetype.startsWith('image/') ? 'image' : (file.mimetype.startsWith('video/') ? 'video' : 'other');
          let blurhash = null;

          if (mediaType === 'image') {
            const fullPath = path.join(process.cwd(), "/file_manager", mediaUrl);
            blurhash = await encodeImageToBlurhash(fullPath);
          } else if (mediaType === 'other') {
            console.warn(`Unsupported media type uploaded: ${file.mimetype}. Skipping Blurhash.`);
            continue;
          }
          newMediaItems.push({ mediaUrl, mediaType, blurhash });
        }
        gallery.media = [...gallery.media, ...newMediaItems];
      }

      // Handle banner update/removal
      if (bannerFile) {
        // If a new banner is uploaded, delete the old one if it exists
        if (gallery.bannerUrl) {
          filesToDeleteFromDisk.push(gallery.bannerUrl);
        }
        gallery.bannerUrl = `/uploads/gallery/${bannerFile.filename}`;
      } else if (removeBanner === 'true' && gallery.bannerUrl) { // Check if removeBanner flag is true and a banner exists
        filesToDeleteFromDisk.push(gallery.bannerUrl);
        gallery.bannerUrl = undefined; // Remove banner URL from document
      }

      await gallery.save();

      // Delete physical files after successful database update
      if (filesToDeleteFromDisk.length > 0) {
          deleteFilesFromPath(filesToDeleteFromDisk);
      }

      return res.status(200).json({
        success: true,
        message: 'Gallery updated successfully!',
        gallery
      });
    } catch (error) {
      // Clean up newly uploaded files in case of error
      if (req.files) {
        if (req.files.media) req.files.media.forEach(file => deleteFilesFromPath([`/uploads/gallery/${file.filename}`]));
        if (req.files.banner) req.files.banner.forEach(file => deleteFilesFromPath([`/uploads/gallery/${file.filename}`]));
      }
      return res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  }
);

// DELETE /gallery/:id - Delete gallery
router.delete(
  '/:id',
  auth,
  role.check(ROLES.Admin),
  async (req, res) => {
    try {
      const galleryId = req.params.id;
      const gallery = await Gallery.findById(galleryId);

      if (!gallery) {
        return res.status(404).json({ error: 'Gallery not found.' });
      }

      const mediaUrlsToDelete = gallery.media.map(item => item.mediaUrl);
      if (gallery.bannerUrl) {
        mediaUrlsToDelete.push(gallery.bannerUrl);
      }

      await gallery.deleteOne();

      if (mediaUrlsToDelete.length > 0) {
          deleteFilesFromPath(mediaUrlsToDelete);
      }

      return res.status(200).json({
        success: true,
        message: 'Gallery deleted successfully!'
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