const express = require('express');
const router = express.Router();
const QRCode = require('../../models/qrCode');
const Event = require('../../models/event');
const Coupon = require('../../models/coupon');
const Organizer = require('../../models/organizer');
const { ROLES } = require('../../utils/constants');
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');
const orderQueue = require('../../queues/orderQueue');

// GET all used QR codes (Admin and Organizer only)
router.get('/used', auth, role.check(ROLES.Admin, ROLES.Organizer), async (req, res) => {
  try {
    if (req.user.role === ROLES.Admin) {

      // Get array of event IDs only
      const userEvents = await Event.find({ user: req.user._id }).select('_id');
      const eventIds = userEvents.map(e => e._id);

      // Filter QR codes where eventId is in user's event IDs
      const allUsedQRCodes = await QRCode.find({
        used: true,
        eventId: { $in: eventIds }
      }).populate('eventId ticketId').sort('-createdAt');

      return res.json({ qrCodes: allUsedQRCodes });
    }

    const organizerId = req.user.organizer;
    const organizer = await Organizer.findById(organizerId);
    if (!organizer) return res.status(400).json({ error: 'Organizer not found' });

    const qrCodes = await QRCode.find({
      used: true,
      eventId: { $in: organizer.event },
    }).populate('eventId ticketId').sort('-createdAt');

    return res.json({ qrCodes });
  } catch (err) {
    return res.status(400).json({ error: 'Failed to fetch QR codes' });
  }
});

// POST to verify a QR code
router.post('/verify', auth, role.check(ROLES.Admin, ROLES.Organizer), async (req, res) => {
  try {
    let { code, scannedAt } = req.body;
    code = code.toUpperCase()

    if (!code) return res.status(400).json({ error: 'Code is required' });

    // Find the QR code
    const qr = await QRCode.findOne({ code }).populate('eventId ticketId');
    // check if the eventId for the qr is part of the event created by the user making the requests
    const userEvents = await Event.findById(qr.eventId);
    if (!userEvents.user.equals(req.user._id)) {
      return res.status(400).json({ error: "You cannot verify this code because you're not the host of this event" })
    }
    if (!qr) return res.status(400).json({ error: 'Code not found' });

    if (qr.used) {
      return res.status(400).json({ error: 'Code has already been scanned', data: qr });
    }

    // Mark it as used
    qr.used = true;
    qr.scannedAt = scannedAt
    await qr.save();
    // send ticket check in to user
    // give it to worker to send email to speed up check in
    const checkInData = {
      userName: qr.billingName,
      eventName: qr.eventName,
      ticketCode: qr.code,
      email: qr.billingEmail,
      scannedAt
    }
    await orderQueue.add('check-in', { checkInData });

    return res.json({ success: true,
                      message: 'Code verified successfully',
                      qr
    });
  } catch (err) {
    return res.status(400).json({ error: 'Failed to verify QR code' });
  }
});

router.post('/ticket-details', auth, role.check(ROLES.Admin, ROLES.Organizer), async (req, res) => {
  try {
    let { code, scanner } = req.body;
    code = code.toUpperCase()

    if (!code) return res.status(400).json({ error: 'Code is required' });

    // Find the QR code
    const qr = await QRCode.findOne({ code }).populate('eventId ticketId');
    // check if the eventId for the qr is part of the event created by the user making the requests
    const userEvents = await Event.findById(qr.eventId);
    if (!userEvents.user.equals(req.user._id)) {
      return res.status(400).json({ error: "You cannot verify this code because you're not the host of this event" })
    }
    if (!qr) return res.status(400).json({ error: 'Code not found' });

    if (qr.used) {
      if (scanner) {
        return res.status(400).json({ error: 'Code has already been scanned, close the scanner and try again!', data: qr });
      } else {
        return res.status(400).json({ error: 'Code has already been scanned', data: qr });
      }
    }

    if (qr.coupon) {
      // fetch coupon details
      const coupon = await Coupon.findOne({ _id: qr.coupon });
      qr.coupon = coupon.code;
    }

    return res.status(200).json({ success: true, message: 'Code verified successfully', qr });
  } catch (err) {
    return res.status(400).json({ error: 'Failed to verify QR code' });
  }
});

module.exports = router;
