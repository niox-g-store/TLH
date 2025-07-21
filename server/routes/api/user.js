const express = require('express');
const router = express.Router();

// Bring in Models & Helpers
const User = require('../../models/user');
const Organizer = require('../../models/organizer');
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');
const { ROLES } = require('../../utils/constants');
const multer = require('multer');
const crypto = require('crypto');
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.cwd() + "/file_manager/uploads/profile");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + crypto.randomBytes(4).toString('hex');
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });


router.get('/non-organizers', auth, role.check(ROLES.Admin), async (req, res) => {
  try {
    const users = await User.find({ organizer: null }).select('-password -resetPasswordToken -resetPasswordExpires');
    return res.status(200).json({ users });
  } catch (error) {
    return res.status(400).json({ error: 'Failed to fetch users' });
  }
});

// search users api
router.get('/search', auth, role.check(ROLES.Admin), async (req, res) => {
  try {
    const { search } = req.query;

    const regex = new RegExp(search, 'i');

    const users = await User.find(
      {
        $or: [
          { name: { $regex: regex } },
          { userName: { $regex: regex } },
          { email: { $regex: regex } }
        ]
      },
      { password: 0, _id: 0 }
    ).populate('organizer', 'companyName')
    .sort('-createdAt');

    return res.status(200).json({
      users
    });
  } catch (error) {
    return res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// fetch users api
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const users = await User.find({}, { password: 0, _id: 0, googleId: 0 })
      .populate('organizer', 'companyName')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort('-createdAt');

    const count = await User.countDocuments();

    return res.status(200).json({
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      count
    });
  } catch (error) {
    return res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});


// return all users
router.get('/all_users', auth, role.check(ROLES.Admin), async (req, res) => {
  try {
    const users = await User.find();

    return res.status(200).json({
      users,
    });
  } catch (error) {
    return res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

router.get('/me', auth, async (req, res) => {
  try {
    const user = req.user._id;
    // const userDoc = await User.findById(user, { password: 0 })
    const userDoc = await User.findById(user, { password: 0 });
    /*.populate({
      path: 'organizer',
      model: 'Organizer',
    });*/

    return res.status(200).json({
      user: userDoc
    });
  } catch (error) {
    return res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

router.put('/', auth, upload.single('image'), async (req, res) => {
  try {
    const userId = req.user._id;
    const update = req.body;
    let userDoc;

    if (update.userName) {
      const usernameRegex = /^[a-zA-Z0-9_-]+$/;
      if (!usernameRegex.test(update.userName)) {
        return res.status(400).json({
          error: 'Username may only contain letters, numbers, underscores, and dashes.'
        });
      }

      const existingUser = await User.findOne({ userName: update.userName, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({
          error: 'This username is already taken. Please choose a different one.'
        });
      }
    }


    if (req.file) {
      update.imageUrl = `/uploads/profile/${req.file.filename}`;
    }
    if (update.organizer === 'null') {
     update.organizer = null;
    }

    userDoc = await User.findByIdAndUpdate(userId, update, { new: true });

    if (userDoc.organizer) {
      const organizerUpdate = {};
      if (update.companyName) {
        organizerUpdate.companyName = update.companyName;
      }
      if (update.phoneNumber) {
        organizerUpdate.phoneNumber = update.phoneNumber;
      }
      if (Object.keys(organizerUpdate).length > 0) {
        await Organizer.findByIdAndUpdate(userDoc.organizer, organizerUpdate, { new: true });
      }
    }

    return res.status(200).json({
      success: true,
      message: 'successfully updated!',
      user: userDoc
    });
  } catch (error) {
    console.error("Error updating user:", error); // Log the error for debugging
    return res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

router.get('/:id', async(req, res) => {
  try {
    const id = req.params.id;
    if (id) {
      const user = await User.findById(id).populate('organizer')
      if (user) {
        return res.status(200).json({
          success: true,
          data: {
            _id: user._id,
            name: user.name,
            email: user.email
          }
        })
      }
    } else {
      throw new Error()
    }
  } catch (error) {
    return res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    })
  }
})

module.exports = router;
