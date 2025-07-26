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
const initiateTransfer = require('../../utils/paystack');
const mailgun = require('./services/mailgun');
const organizerBanned = require('../../middleware/organizerBanned');

router.get('/', auth, role.check(ROLES.Admin, ROLES.Organizer), async (req, res) => {
  try {
    let withdrawals;

    if (req.user.role === ROLES.Admin) {
      withdrawals = await Withdrawal.find()
        .populate('event ticket user order')
        .sort({ requestedAt: -1 });
    } else {
      withdrawals = await Withdrawal.find({ user: req.user._id })
        .populate('event ticket order')
        .sort({ requestedAt: -1 });
    }

    let earnings = 0;
    let withdrawnAmount = 0;

    withdrawals.forEach(w => {
      if (req.user.role === ROLES.Admin) {
        earnings += w.order?.total || 0;
      } else {
        earnings += w.amount;
      }

      if (w.status === 'completed') {
        withdrawnAmount += w.amount;
      }
    });

    return res.status(200).json({
      withdrawals,
      earnings,
      withdrawnAmount
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: 'Server error loading withdrawals' });
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
    const isAdmin = req.user.role === ROLES.Admin
    const withdrawal = await Withdrawal.findById(withdrawalId).populate('user');

    if (!withdrawal) return res.status(400).json({ error: 'Withdrawal not found' });

    if (!isAdmin && !withdrawal.user._id.equals(req.user._id)) {
      return res.status(400).json({ error: 'You are not authorized to access this withdrawal' });
    }

    const now = new Date();
    //if (withdrawal.canWithdrawDate > now || withdrawal.canWithdraw === false) {
      //return res.status(400).json({ error: 'Not eligible to withdraw yet' });
    //}

    const { bankAccountNumber, bankName, bankAccountName } = withdrawal.user;
    if (!bankAccountNumber || !bankName || !bankAccountName) {
      return res.status(400).json({ error: 'Bank details not set on user profile' });
    }

    // find order
    const orderDoc = await Order.findById(orderId)
      .populate('events')
      .populate('tickets')
      .populate({
        path: 'cart',
        populate: {
          path: 'tickets.eventId',
        }
      })
    // === Organizer Logic === to filter events and tickets from order that belong to organizer
    // admin can initiate withdrawal using organizerId
    organizerId = organizerId ? organizerId.toString() : req.user._id.toString();
    const organizer = await Organizer.findById(organizerId ? organizerId : req.user._id);

    /*const filteredEvents = orderDoc.events.filter(
        (event) => event.user.toString() === organizerId
    );*/

    const filteredTickets = orderDoc.cart?.tickets?.filter(
        (ticket) =>
            ticket.eventId &&
            ticket.eventId.user &&
            ticket.eventId.user.toString() === organizerId
    );
    // get all expected payout from order.cart.tickets
    const expectedPayout = filteredTickets.reduce((sum, item) => {
        const itemPrice = item.expectedPayout
        return sum + itemPrice;
    }, 0);
    orderDoc.expectedPayout = expectedPayout

    withdrawal.requestedAt = now;
    withdrawal.reference = UUID.uuidv4()

    withdrawal.status = 'processing';
    await withdrawal.save();
    // call paystack here to handle sending money to the recipient
    await initiateTransfer( expectedPayout, withdrawal.reference, organizer.recipientId )

    // send email to admin that organizer has requested a withdrawal
    const adminEmails = await User.find({ role: ROLES.Admin })
    await orderQueue.add( 'send-admin-email', { adminEmails, organizer, orderDoc } )


    return res.status(200).json(
        { message: `Your withdrawal has been successfully initiated.
                    You will receive email notifications regarding the
                    status and updates of your withdrawal`,
          withdrawal
        });
  } catch (err) {
    console.log(err)
    return res.status(400).json({ error: 'Server error initializing withdrawal' });
  }
});

// set a withdrawal webhook url to accept withdrawal reference and status
// to update withdrawal status, if withdrawal failed, retry again with same
// reference to avoid duplicate withdrawals
router.post('/verify-endpoint', async(req, res) => {
    try {
      console.log("ENDPOINT STARTED")
      console.log(req.body)
        const { data } = req.body;
        const { reference, status, amount } = data;
        const now = new Date();

        const withdrawal = await Withdrawal.findOne({ reference })
          .populate('user.organizer')
        const oppData = {
          withdrawal,
          organizer: withdrawal.user.organizer,
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
            await mailgun.sendEmail(withdrawal.user.email, 'organizer-withdraw-successful', oppData)
            return;
        } else if (status === 'failed' || status === 'reversed') {
            if (withdrawal) {
                withdrawal.status = 'failed';
                await withdrawal.save();
            }
            // send failed email to organizer
            await mailgun.sendEmail(withdrawal.user.email, 'organizer-withdraw-failed', oppData)
            return;
        }
        
    } catch (error) {
        return res.status(400).json({ error: 'error verifying transfer status' })
    }
})

module.exports = router;