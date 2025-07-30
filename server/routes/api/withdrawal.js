const express = require('express');
const router = express.Router();
const Withdrawal = require('../../models/withdrawal');
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

    let allWithdrawals = await Withdrawal.find({ status: { $ne: 'completed' } })
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
      if (w.canWithdraw === true) { canWithdrawAmount += w.commission }
    });
    const paginated = adminWithdrawals.slice(skip, skip + limit);

    return res.status(200).json({
      withdrawals: paginated,
      earnings,
      canWithdrawAmount,
      total: adminWithdrawals.length,
      page,
      pageCount: Math.ceil(adminWithdrawals.length / limit)
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

    let withdrawals = await Withdrawal.find({ status: { $ne: 'completed' } })
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
        if (w.canWithdraw) { group.canWithdrawAmount += w.amount || 0 }
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

    let allWithdrawals = await Withdrawal.find({ user: id, status: { $ne: 'completed' } })
      .populate('event ticket order user')
      .sort({ requestedAt: -1 });

    allWithdrawals = await Promise.all(allWithdrawals.map(updateCanWithdrawDate));

    let earnings = 0;
    let canWithdrawAmount = 0;

    allWithdrawals.forEach(async (w) => {
      earnings += w.amount;
      if (w.canWithdraw === true) { canWithdrawAmount += w.amount }
    });
    const paginated = allWithdrawals.slice(skip, skip + limit);

    return res.status(200).json({
      withdrawals: paginated,
      earnings,
      canWithdrawAmount,
      total: allWithdrawals.length,
      page,
      pageCount: Math.ceil(allWithdrawals.length / limit)
    });
  } catch (err) {
    return res.status(400).json({ error: 'Failed to load organizer withdrawals' });
  }
});

router.get('/withdrawal/:id', auth, role.check(ROLES.Admin), async (req, res) => {
  try {
    const { id } = req.params;

    const withdrawal = await Withdrawal.findById(id)
      .populate('ticket event user')
      .populate({
        path: 'order',
        populate: {
          path: 'cart'
        }
      });
    if (!withdrawal) return res.status(400).json({ error: 'Withdrawal not found' });

    return res.status(200).json(withdrawal);
  } catch (err) {
    return res.status(400).json({ error: 'Server error fetching withdrawal' });
  }
});

router.get('/history', auth, role.check(ROLES.Admin, ROLES.Organizer), async (req, res) => {
  try {
    const userId = req.user._id;
    const isAdmin = req.user.role === ROLES.Admin;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    let query = { status: 'completed' };

    if (isAdmin) {
      const adminUsers = await User.find({ role: ROLES.Admin }).select('_id');
      const adminUserIds = adminUsers.map(u => u._id);
      query.user = { $in: adminUserIds };
    } else {
      query.user = userId;
    }

    const allCompletedWithdrawals = await Withdrawal.find(query)
      .populate('event ticket order user')
      .sort({ requestedAt: -1 });

    const paginated = allCompletedWithdrawals.slice(skip, skip + limit);
    let withdrawnAmount = 0;
    for (const items of allCompletedWithdrawals) {
      if (isAdmin) {
        withdrawnAmount += items.commission
      } else {
        withdrawnAmount += items.amount
      }
    }

    return res.status(200).json({
      withdrawals: paginated,
      total: allCompletedWithdrawals.length,
      page,
      withdrawnAmount,
      pageCount: Math.ceil(allCompletedWithdrawals.length / limit)
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
        const withdrawal = await Withdrawal.findById(id).populate('user');
        if (!withdrawal) continue;

        // Access control
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

        // Finalize withdrawal
        withdrawal.requestedAt = now;
        withdrawal.reference = uuidv4();
        withdrawal.status = 'processing';
        await withdrawal.save();
        
        const amount = organizerId ? withdrawal.amount : withdrawal.commission;

        await initiateTransfer(amount, withdrawal.reference, organizer.recipientId);

        initiatedWithdrawals.push(withdrawal);
        // Notify admin if initiated by non-admin user
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
        message: `Your withdrawal${initiatedWithdrawals.length > 1 ? 's have' : ' has'} been successfully initiated.
                  You will receive email notifications regarding the status and updates.`,
        withdrawals: initiatedWithdrawals
      });

    } catch (err) {
      return res.status(400).json({ error: 'Server error initializing withdrawal' });
    }
  }
);

// set a withdrawal webhook url to accept withdrawal reference and status
// to update withdrawal status, if withdrawal failed, retry again with same
// reference to avoid duplicate withdrawals
router.post('/verify-endpoint', async(req, res) => {
    try {
        const { data } = req.body;
        const { reference, status, amount } = data.transfers[0];
        const now = new Date();

        const withdrawal = await Withdrawal.findOne({ reference })
          .populate('user');
        const organizer = await Organizer.findById(withdrawal.user.organizer)
        const oppData = {
          withdrawal,
          organizer: organizer ? organizer : null,
          order: { totalExpectedPayout: amount },
        }
        if (status === 'success') {
            // successfuly transfer update withdrwal.status
            if (withdrawal) {
                withdrawal.status = 'completed';
                withdrawal.processedAt = now;
                await withdrawal.save();
            }
            // send success email to organizer
            if (organizer) {
              await mailgun.sendEmail(withdrawal.user.email, 'organizer-withdraw-successful', oppData)
            }
          return res.status(200)
        } else if (status === 'failed' || status === 'reversed') {
            if (withdrawal) {
                withdrawal.status = 'failed';
                await withdrawal.save();
            }
            // send failed email to organizer
            if (organizer) {
              await mailgun.sendEmail(withdrawal.user.email, 'organizer-withdraw-failed', oppData)
            }
          return res.status(400)
        }
        return res.status(200)
    } catch (error) {
        return res.status(400).json({ error: 'error verifying transfer status' })
    }
})

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