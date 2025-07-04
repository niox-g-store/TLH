const express = require('express');
const router = express.Router();
const Ticket = require('../../models/ticket');
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');
const { ROLES } = require('../../utils/constants');

// POST /ticket - Add a single ticket
router.post(
  '/',
  auth,
  role.check(ROLES.Admin, ROLES.Organizer),
  async (req, res) => {
    try {
      const { type, price, discount, discountPrice } = req.body;
      const user = req.user._id;

      const ticket = new Ticket({
        type,
        user,
        price,
        discount: discount || false,
        discountPrice: discountPrice || 0,
      });

      const savedTicket = await ticket.save();

      return res.status(201).json({ success: true, ticket: savedTicket });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Failed to add ticket', error: err.message });
    }
  }
);

// DELETE /ticket/:id - Delete a ticket by ID
router.delete(
  '/:id',
  auth,
  role.check(ROLES.Admin, ROLES.Organizer),
  async (req, res) => {
    try {
      const ticket = await Ticket.findByIdAndDelete(req.params.id);
      if (!ticket) {
        return res.status(404).json({ success: false, message: 'Ticket not found' });
      }
      return res.status(200).json({ success: true, message: 'Ticket deleted successfully' });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Failed to delete ticket', error: err.message });
    }
  }
);

// PUT /ticket/:id - Update a ticket
router.put(
  '/:id',
  auth,
  role.check(ROLES.Admin, ROLES.Organizer),
  async (req, res) => {
    try {
      const updatedTicket = await Ticket.findByIdAndUpdate(
        req.params.id,
        {
          ...req.body,
        },
        { new: true }
      );

      if (!updatedTicket) {
        return res.status(404).json({ success: false, message: 'Ticket not found' });
      }

      return res.status(200).json({ success: true, ticket: updatedTicket });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Failed to update ticket', error: err.message });
    }
  }
);

// POST /ticket/add - Add multiple tickets
router.post(
  '/add',
  auth,
  role.check(ROLES.Admin, ROLES.Organizer),
  async (req, res) => {
    try {
      let { tickets } = req.body;
      const user = req.user._id;

      tickets = tickets.map(ticket => ({
        ...ticket,
        user
      }));

      if (!Array.isArray(tickets) || tickets.length === 0) {
        return res.status(400).json({ success: false, message: 'Tickets is required' });
      }

      const savedTickets = await Ticket.insertMany(tickets);

      return res.status(201).json({ success: true, tickets: savedTickets });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Failed to add tickets', error: err.message });
    }
  }
);

module.exports = router;
