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
const {
  verifyCustomerBank,
  listBanks,
  createTransferRecipient
} = require('../../utils/paystack');
const orderQueue = require('../../queues/orderQueue');
const organizerBanned = require('../../middleware/organizerBanned');

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
    const userDoc = await User.findById(user, { password: 0 })
    .populate({
      path: 'organizer',
      model: 'Organizer',
    });

    return res.status(200).json({
      user: userDoc
    });
  } catch (error) {
    return res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

router.get('/banks', auth, async (req, res) => {
  try {
    const { data } = await listBanks();
    const banks = []
    for (let bank of data) {
      if (bank.active) {  // include only active banks
        banks.push({
          label: bank.name,
          value: bank.code
        })
      }
    }
    return res.status(200).json({ banks})
  } catch (error) {
    return res.status(400).json({
      error: "Cannot fetch banks from paystack"
    })
  }
});

router.put('/update-bank',
  auth, organizerBanned, async (req, res) => {
  try {
    const userId = req.user._id;
    let update = req.body;
    let { bankAccountNumber, bankName, bankCode } = req.body;

    if (bankAccountNumber && (!bankName || !bankCode)) {
      return res.status(400).json({ error: "incomplete bank details, select a bank name" })
    }

    if (bankAccountNumber && bankName && bankCode) {
      const { data } = await verifyCustomerBank(bankAccountNumber, bankCode);
      const { account_number, account_name } = data;
      if (account_number && account_name) {
        update.bankAccountNumber = account_number
        update.bankName = bankName
        update.bankAccountName = account_name
        const { data } = await createTransferRecipient(
          update.bankAccountName, update.bankAccountNumber, bankCode
        )
        update.recipientId = data.recipient_code
      }
    }
    userDoc = await User.findByIdAndUpdate(userId, update, { new: true })

    if (userDoc.organizer) {
      const organizerUpdate = {};
      if (update.bankAccountNumber && update.bankName && update.bankAccountName) {
        organizerUpdate.bankAccountNumber = update.bankAccountNumber,
        organizerUpdate.bankName = update.bankName,
        organizerUpdate.bankAccountName = update.bankAccountName
        // create a new transfer recipient, collect id from req.data
        const { data } = await createTransferRecipient(
          update.bankAccountName, update.bankAccountNumber, bankCode
        )
        organizerUpdate.recipientId = data.recipient_code
      }
      if (Object.keys(organizerUpdate).length > 0) {
        const organizer = await Organizer.findByIdAndUpdate(userDoc.organizer, organizerUpdate, { new: true });
        // send email to admin that a new organizer has been added to their transfer recipient
        if (update.bankAccountNumber, update.bankName, update.bankAccountName) {
          const adminEmails = await User.find({ role: ROLES.Admin })
          await orderQueue.add('send-admin-email', { adminEmails, organizer, newTransferUserAdded: true } )
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: 'successfully updated!',
      user: userDoc
    });
  } catch (error) {
    if (error.code === 'NETWORK_ERROR') {
      return res.status(400).json({
          error: 'Error verifying bank details, check the bank details and try again'
      });
    } else if (error.code === 'NETWORK_ERROR_RECIPIENT') {
      return res.status(400).json({
          error: 'Error creating transfer recipient'
      });
    } else {
      return res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  }
});

router.put('/',
  auth, organizerBanned,
  upload.single('image'), async (req, res) => {
  try {
    const userId = req.user._id;
    let update = req.body;
    let userDoc;
    update.organizer = update.organizer ? JSON.parse(update.organizer) : null

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

    userDoc = await User.findByIdAndUpdate(userId, update);

    // If user has organizer linked, update that too
    if (userDoc.organizer) {
      const organizerUpdate = {};
      if (update.companyName) {
        organizerUpdate.companyName = update.companyName;
      }
      if (update.phoneNumber) {
        organizerUpdate.phoneNumber = update.phoneNumber;
      }
      if (Object.keys(organizerUpdate).length > 0) {
        await Organizer.findByIdAndUpdate(userDoc.organizer, organizerUpdate);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'successfully updated!',
      user: userDoc
    });
  } catch (error) {
    console.log(error)
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
