const express = require('express');
const router = express.Router();
const Withdrawal = require('../../models/withdrawal');
const AdminWithdrawal = require('../../models/adminWithdrawal');
const User = require('../../models/user');
const Organizer = require('../../models/organizer');
const Order = require('../../models/order');
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');
const { ROLES } = require('../../utils/constants');
const orderQueue = require('../../queues/orderQueue');
const { initiateTransfer } = require('../../utils/paystack');
const mailgun = require('../../services/mailgun');
const organizerBanned = require('../../middleware/organizerBanned');
const { v4: uuidv4 } = require('uuid');

router.get('/', auth, role.check(ROLES.Admin), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    let allWithdrawals = await AdminWithdrawal.find()
      .populate('event ticket user order')
      .sort({ requestedAt: -1 });
    allWithdrawals = await Promise.all(allWithdrawals.map(updateCanWithdrawDate));

    // const adminWithdrawals = allWithdrawals.filter(w => w.user?.role === ROLES.Admin);
    const adminWithdrawals = allWithdrawals;
    let earnings = 0;
    let canWithdrawAmount = 0;

    adminWithdrawals.forEach(async (w) => {
      earnings += w.commission || 0;
      /*if (w.status === 'completed') {
        withdrawnAmount += w.commission || 0;
      }*/
      if (w.canWithdraw === true && w.status !== 'completed') { canWithdrawAmount += w.commission }
    });
    const paginated = adminWithdrawals.slice(skip, skip + limit);

    return res.status(200).json({
      withdrawals: paginated,
      earnings,
      canWithdrawAmount,
      total: adminWithdrawals.length,
      page,
      pageCount: Math.ceil(adminWithdrawals.length / limit),
      proccessingWithdrawals: adminWithdrawals.filter(i => i.canWithdraw === true && i.status === 'processing')
    });
  } catch (err) {
    return res.status(400).json({ error: 'Failed to load admin withdrawals' });
  }
});

router.get('/organizers', auth, role.check(ROLES.Admin), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    let withdrawals = await Withdrawal.find()
      .populate('event ticket user order')
      .sort({ requestedAt: -1 });
    withdrawals = await Promise.all(withdrawals.map(updateCanWithdrawDate));

    const groupedMap = new Map();

    withdrawals.forEach( async(w) => {
      if (w.user?.role === ROLES.Organizer) {
        const organizerId = w.user._id.toString();

        if (!groupedMap.has(organizerId)) {
          groupedMap.set(organizerId, {
            organizer: w.user,
            withdrawals: [],
            earnings: 0,
            withdrawnAmount: 0,
            canWithdrawAmount: 0
          });
        }

        const group = groupedMap.get(organizerId);
        group.withdrawals.push(w);
        group.earnings += w.amount || 0;
        if (w.status === 'completed') {
          group.withdrawnAmount += w.amount || 0;
        }
        if (w.canWithdraw && w.status !== 'completed') { group.canWithdrawAmount += w.amount || 0 }
      }
    });

    const groupedArray = Array.from(groupedMap.values());

    const paginated = groupedArray.slice(skip, skip + limit);

    return res.status(200).json({
      withdrawals: paginated,
      total: groupedArray.length,
      page,
      pageCount: Math.ceil(groupedArray.length / limit)
    });
  } catch (err) {
    return res.status(400).json({ error: 'Failed to load organizer withdrawals' });
  }
});

router.get('/organizer/:id', auth, role.check(ROLES.Admin, ROLES.Organizer), async (req, res) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    let allWithdrawals = await Withdrawal.find({ user: id })
      .populate('event ticket order user')
      .sort({ requestedAt: -1 });

    allWithdrawals = await Promise.all(allWithdrawals.map(updateCanWithdrawDate));

    let earnings = 0;
    let canWithdrawAmount = 0;

    allWithdrawals.forEach(async (w) => {
      earnings += w.amount;
      if (w.canWithdraw === true && w.status !== 'completed') { canWithdrawAmount += w.amount }
    });
    const paginated = allWithdrawals.slice(skip, skip + limit);

    return res.status(200).json({
      withdrawals: paginated,
      earnings,
      canWithdrawAmount,
      total: allWithdrawals.length,
      page,
      pageCount: Math.ceil(allWithdrawals.length / limit),
      proccessingWithdrawals: allWithdrawals.filter(i => i.canWithdraw === true && i.status === 'processing')
    });
  } catch (err) {
    return res.status(400).json({ error: 'Failed to load organizer withdrawals' });
  }
});

router.get('/withdrawal/:id', auth, role.check(ROLES.Admin), async (req, res) => {
  try {
    const { id } = req.params;

    let withdrawal = await Withdrawal.findById(id)
      .populate('ticket event user')
      .populate({
        path: 'order',
        populate: {
          path: 'cart',
        },
      });

    if (!withdrawal) {
      withdrawal = await AdminWithdrawal.findById(id)
        .populate('event user')
        .populate({
          path: 'order',
          populate: {
            path: 'cart',
          },
        });
    }

    if (!withdrawal) {
      return res.status(404).json({ error: 'Withdrawal not found' });
    }

    return res.status(200).json(withdrawal);
  } catch (err) {
    return res.status(500).json({ error: 'Server error fetching withdrawal' });
  }
});

router.get('/history', auth, role.check(ROLES.Admin, ROLES.Organizer), async (req, res) => {
  try {
    const userId = req.user._id;
    const organizerId = req.query.organizerId;
    const isAdmin = req.user.role === ROLES.Admin;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    let withdrawals = [];

    if (isAdmin && organizerId) {
      const organizerWithdrawals = await Withdrawal.find({ status: 'completed', user: organizerId })
        .populate('event ticket order user')
        .sort({ requestedAt: -1 });

      withdrawals = organizerWithdrawals;
      const paginated = withdrawals.slice(skip, skip + limit);
      let withdrawnAmount = 0;

      for (const item of withdrawals) {
        withdrawnAmount += item.amount;
      }

      return res.status(200).json({
        withdrawals: paginated,
        total: withdrawals.length,
        page,
        withdrawnAmount,
        pageCount: Math.ceil(withdrawals.length / limit),
      });
    }

    if (isAdmin) {
      const adminWithdrawals = await AdminWithdrawal.find({ status: 'completed' })
        .populate('event order user')
        .sort({ requestedAt: -1 });

      withdrawals = adminWithdrawals;
    } else {
      const organizerWithdrawals = await Withdrawal.find({ status: 'completed', user: userId })
        .populate('event ticket order user')
        .sort({ requestedAt: -1 });

      withdrawals = organizerWithdrawals;
    }

    const paginated = withdrawals.slice(skip, skip + limit);
    let withdrawnAmount = 0;

    for (const item of withdrawals) {
      withdrawnAmount += isAdmin ? item.commission : item.amount;
    }

    return res.status(200).json({
      withdrawals: paginated,
      total: withdrawals.length,
      page,
      withdrawnAmount,
      pageCount: Math.ceil(withdrawals.length / limit),
    });

  } catch (err) {
    return res.status(400).json({ error: 'Failed to load withdrawal history' });
  }
});


router.post(
  '/initialise',
  auth,
  role.check(ROLES.Admin, ROLES.Organizer),
  organizerBanned,
  async (req, res) => {
    try {
      let { withdrawalId, orderId, organizerId } = req.body;
      const isAdmin = req.user.role === ROLES.Admin;

      const withdrawalIds = Array.isArray(withdrawalId) ? withdrawalId : [withdrawalId];
      const now = new Date();
      const initiatedWithdrawals = [];

      let organizer = null;
      let orderDoc = {};

      if (organizerId) {
        organizer = await Organizer.findById(organizerId);
      }
      if (!organizer) {
        organizer = await User.findById(req.user._id);
      }

      for (const id of withdrawalIds) {
        let withdrawal;
        if (isAdmin && organizerId && organizer) {
          withdrawal = await Withdrawal.findById(id).populate('user');
        } else if (isAdmin) {
          withdrawal = await AdminWithdrawal.findById(id).populate('user');
        } else {
          withdrawal = await Withdrawal.findById(id).populate('user');
        }

        // Prevent non-admins from initiating someone else’s withdrawal
        if (!isAdmin && !withdrawal.user._id.equals(req.user._id)) {
          return res.status(403).json({ error: 'Unauthorized withdrawal access' });
        }

        // Eligibility check
        if (withdrawal.canWithdrawDate > now || withdrawal.canWithdraw === false) {
          return res.status(400).json({ error: 'Not eligible to withdraw yet' });
        }

        const { bankAccountNumber, bankName, bankAccountName } = withdrawal.user;
        if (!bankAccountNumber || !bankName || !bankAccountName) {
          return res.status(400).json({ error: 'Bank details not set on user profile' });
        }

        // Update and initiate transfer
        withdrawal.requestedAt = now;
        withdrawal.reference = uuidv4();
        withdrawal.status = 'processing';
        await withdrawal.save();

        const amount = isAdmin ? withdrawal.commission : withdrawal.amount;
        await initiateTransfer(amount, withdrawal.reference, organizer.recipientId);
        initiatedWithdrawals.push(withdrawal);

        // Send email to admins if initiated by an organizer
        if (!isAdmin && initiatedWithdrawals.length > 0) {
          const adminEmails = await User.find({ role: ROLES.Admin });
          await orderQueue.add('send-admin-email', {
            adminEmails,
            organizer,
            withdraw: withdrawal,
            order: { expectedPayout: withdrawal.amount }
          });
        }
      }

      return res.status(200).json({
        message: `Your withdrawal${initiatedWithdrawals.length > 1 ? 's have' : ' has'} been successfully initiated. You will receive email notifications regarding the status and updates.`,
        withdrawals: initiatedWithdrawals,
        proccessingWithdrawals: initiatedWithdrawals.filter(w => w.canWithdraw === true && w.status === 'processing')
      });

    } catch (err) {
      return res.status(400).json({ error: 'Server error initializing withdrawal' });
    }
  }
);

// set a withdrawal webhook url to accept withdrawal reference and status
// to update withdrawal status, if withdrawal failed, retry again with same
// reference to avoid duplicate withdrawals
router.post('/verify-endpoint', async (req, res) => {
  try {
    const { data } = req.body;
    if (!data?.transfers || !Array.isArray(data.transfers) || data.transfers.length === 0) {
      return res.status(400).json({ message: 'No transfer data received' });
    }

    const { reference, status, amount } = data.transfers[0];
    const now = new Date();

    let withdrawal = await Withdrawal.findOne({ reference }).populate('user');
    let isAdminWithdrawal = false;

    if (!withdrawal) {
      withdrawal = await AdminWithdrawal.findOne({ reference }).populate('user');
      isAdminWithdrawal = true;
    }

    if (!withdrawal) {
      return res.status(400).json({ message: 'Withdrawal not found' });
    }

    const expectedAmount = isAdminWithdrawal
      ? parseInt(withdrawal?.amount !== withdrawal?.commission ? withdrawal?.commission : withdrawal?.amount)
      : parseInt(withdrawal.amount) || parseInt(withdrawal.commission);

    if (expectedAmount !== amount / 100) {
      return res.status(400).json({ message: 'Amount mismatch — ignoring webhook' });
    }

    let organizer = null;
    if (!isAdminWithdrawal) {
      organizer = await Organizer.findById(withdrawal.user.organizer);
    }

    const oppData = {
      withdrawal,
      organizer,
      order: { totalExpectedPayout: amount },
    };

    if (status === 'received') {
      withdrawal.status = 'processing';
      await withdrawal.save();
      return res.status(200).json({ message: 'Transfer received' });
    }

    if (status === 'success') {
      withdrawal.status = 'completed';
      withdrawal.processedAt = now;
      await withdrawal.save();

      if (!isAdminWithdrawal && organizer) {
        await mailgun.sendEmail(withdrawal.user.email, 'organizer-withdraw-successful', oppData);
      }
    } else if (status === 'failed' || status === 'reversed') {
      withdrawal.status = 'failed';
      await withdrawal.save();

      if (!isAdminWithdrawal && organizer) {
        await mailgun.sendEmail(withdrawal.user.email, 'organizer-withdraw-failed', oppData);
      }
    }

    return res.status(200).json({ message: 'Webhook processed' });

  } catch (error) {
    return res.status(400).json({ message: 'Error processing webhook' });
  }
});



const updateCanWithdrawDate = async (withdrawal) => {
  const now = new Date();
  const target = new Date(withdrawal.canWithdrawDate);

  if (!withdrawal.canWithdraw && now >= target) {
    withdrawal.canWithdraw = true;
    await withdrawal.save();
  }

  return withdrawal;
};


module.exports = router;