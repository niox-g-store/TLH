const express = require('express');
const router = express.Router();
const QRCode = require('../../models/qrCode');
const Organizer = require('../../models/organizer');
const { ROLES } = require('../../utils/constants');
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');

// GET all used QR codes (Admin and Organizer only)
router.get('/used', auth, role.check([ROLES.Admin, ROLES.Organizer]), async (req, res) => {
  try {
    if (req.user.role === ROLES.Admin) {
      const allUsedQRCodes = await QRCode.find({ used: true }).populate('eventId ticketId');
      return res.json({ qrCodes: allUsedQRCodes });
    }

    const organizerId = req.user.organizer;
    const organizer = await Organizer.findById(organizerId);
    if (!organizer) return res.status(403).json({ error: 'Organizer not found' });

    const qrCodes = await QRCode.find({
      used: true,
      eventId: { $in: organizer.event },
    }).populate('eventId ticketId');

    return res.json({ qrCodes });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch QR codes' });
  }
});

// POST to verify a QR code
router.post('/verify', async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) return res.status(400).json({ error: 'QR code is required' });

    // Find the QR code
    const qr = await QRCode.findOne({ code }).populate('eventId ticketId');
    if (!qr) return res.status(404).json({ error: 'QR code not found' });

    if (qr.used) {
      return res.status(409).json({ error: 'QR code has already been used', data: qr });
    }

    // Mark it as used
    qr.used = true;
    qr.scannedAt = new Date();
    await qr.save();

    return res.json({ success: true, message: 'QR code verified successfully', data: qr });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to verify QR code' });
  }
});

module.exports = router;
