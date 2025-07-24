const express = require('express');
const router = express.Router();
const multer = require('multer');
const keys = require('../../config/keys.js');
const crypto = require('crypto');
const path = require('path');
const mailgun = require('../../services/mailgun.js');
const Newsletter = require('../../models/newsletter.js');
const Campaign = require('../../models/campaign.js');
const User = require('../../models/user.js');
const Guest = require('../../models/guest.js');
const Event = require('../../models/event.js');
const Organizer = require('../../models/organizer');
const Order = require('../../models/order');
const QRCode = require('../../models/qrCode');
const Cart = require('../../models/cart');
const Ticket = require('../../models/ticket.js');
const role = require('../../middleware/role.js');
const auth = require('../../middleware/auth.js');
const { ROLES } = require('../../utils/constants');
const { getCartPriceSummary } = require('../../template/cartSummary.js')
const dayjs = require('dayjs');
const isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
const isSameOrBefore = require('dayjs/plugin/isSameOrBefore');
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

router.get('/attendees', auth, role.check(ROLES.Admin, ROLES.Organizer), getAttendees);

router.post(
  '/first-three',
  auth,
  role.check(ROLES.Admin, ROLES.Organizer),
  async (req, res) => {
    try {
      const { target, isRange, startDate, endDate, date = null } = req.body;
      const include = {
        tickets: target === 'tickets' ? 'tickets' : null,
        orders: target === 'orders' ? 'orders' : null,
        events: target === 'events' ? 'events' : null,
        income: target === 'income' ? 'income' : null
      };
      const anal = await getAnalytics({ startDate, endDate, date, include }, req);
      return res.status(200).json({ ...anal })
    } catch (error) {
        return res.status(400).json({ error: 'Failed to fetch data' });
    }
});


router.get(
    '/all-data',
    auth,
    role.check(ROLES.Admin, ROLES.Organizer),
    async (req, res) => {
  try {
    let { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      startDate = dayjs().startOf('month').toISOString();
      endDate = dayjs().endOf('day').toISOString();
    }

    if (startDate === 'all time' && endDate === 'all time') {
      startDate = new Date(0);
      endDate = new Date();
    }

    const analytics = await getAnalytics({
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      date: req.query.date || 'all',
      include: {
        tickets: true,
        events: true,
        orders: true,
        income: true
      }
    }, req);
    console.log(analytics)

    return res.json(analytics);
  } catch (err) {
    return res.status(400).json({ error: 'Something went wrong fetching data' });
  }
});

router.get(
    '/stats/overview',
    auth,
    role.check(ROLES.Admin, ROLES.Organizer),
    async (req, res) => {
  try {
    const role = req.user.role;
    const userId = req.user._id;

    const result = {};

    if (role === ROLES.Organizer) {
      // Top Selling Event
      const events = await Event.findOne({ user: userId })
        .sort({ attendees: -1 })
        .limit(1);

      result.topSellingEvent = events ? events.name : null;

      result.upcomingEvents = await Event.countDocuments({
        user: userId,
        status: 'Upcoming',
      });

      result.ongoingEvents = await Event.countDocuments({
        user: userId,
        status: 'Ongoing',
      });

      result.pastEvents = await Event.countDocuments({
        user: userId,
        status: 'Ended',
      });

      return res.json(result);
    }

    // FOR ADMINS AND DASHBOARD-WIDE STATS

    // Event with most attendees
    const allEvents = await Event.findOne({})
      .sort({ attendees: -1 })
      .limit(1);

    result.topSellingEvent = allEvents ? allEvents.name : null;
    result.totalEvents = await Event.countDocuments({});
    result.upcomingEvents = await Event.countDocuments({ status: 'Upcoming' });
    result.pastEvents = await Event.countDocuments({ status: 'Ended' });

    result.guestUsers = await Guest.countDocuments();
    result.totalUsers = await User.countDocuments({ role: ROLES.Member });
    result.organizers = await Organizer.countDocuments();
    result.admins = await User.countDocuments({ role: ROLES.Admin });

    return res.json(result);
  } catch (err) {
    return res.status(400).json({ message: 'Server error' });
  }
});

async function getAttendees (req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const userId = req.user._id;

    // 1. Get all events created by the current user
    const userEvents = await Event.find({ user: userId }).select('_id');

    const eventIds = userEvents.map(e => e._id);

    // 2. Get all orders that reference those events
    const orders = await Order.find({ events: { $in: eventIds }, status: true })
      .populate('guest')
      .populate('cart')
      .sort({ createdAt: -1 });

    // 3. Gather all attendee records
    const attendees = [];

    for (const order of orders) {
      const cartTickets = order.cart?.tickets || [];
      const purchasedDate = order.createdAt;
      const formattedDate = new Date(purchasedDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });

      for (const ticket of cartTickets) {
        const qrUsed = await QRCode.find({
          order: order._id,
          ticketId: ticket.ticketId,
          eventId: ticket.eventId,
          used: true
        }).countDocuments();

        const checkedInCount = qrUsed ? qrUsed : 0;

        const isGuest = !!order.guest;
        const name = isGuest
          ? order.guest?.name || 'Unknown Guest'
          : order.user?.name || 'Unknown User';

        const email = isGuest
          ? order.guest?.email || ''
          : order.billingEmail || '';

        attendees.push({
          name,
          ticketType: ticket.ticketType,
          quantity: ticket.quantity,
          isGuest,
          checkedInCount,
          purchasedDate: formattedDate,
          email
        });
      }
    }

    // 4. Paginate
    const total = attendees.length;
    const paginated = attendees.slice(skip, skip + limit);

    return res.json({
      attendees: paginated,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalAttendees: total
    });
  } catch (error) {
    res.status(400).json({ error: 'Internal Server Error' });
  }
}

async function getAnalytics ({ startDate, endDate, date, include }, req) {
  const result = {};
  const userId = req.user._id;

  // Helper to split the time range into max 14 buckets
  function generateBuckets (start, end, maxPoints = 30) {
    const diff = dayjs(end).diff(start, 'day');
    const step = Math.max(1, Math.ceil(diff / maxPoints));
    const buckets = [];
    let current = dayjs(start);

    while (current.isSameOrBefore(end)) {
      buckets.push(current.toDate());
      current = current.add(step, 'day');
    }

    return buckets;
  }

  // TICKETS ANALYTICS
  if (include.tickets) {
  const buckets = generateBuckets(startDate, endDate);
  const labels = [];
  const data = [];

  // Get eventIds for this organizer
  const userEvents = await Event.find({ user: userId }, '_id');
  const userEventIds = new Set(userEvents.map(event => event._id.toString()));

  // Fetch all orders that contain tickets for this user's events
  const allOrders = await Order.find({}).populate('cart');

  // Pre-filter orders that have at least one ticket from this user's events
  const userOrders = allOrders.filter(ord =>
    ord?.cart?.tickets?.some(ticket => userEventIds.has(ticket.eventId?.toString()))
  );

  for (let i = 0; i < buckets.length; i++) {
    const from = dayjs(buckets[i]).startOf('day');
    const to = buckets[i + 1]
      ? dayjs(buckets[i + 1]).startOf('day')
      : dayjs(endDate).endOf('day');

    let totalSold = 0;

    for (const ord of userOrders) {
      const createdAt = dayjs(ord.createdAt);
      if (createdAt.isBefore(from) || createdAt.isAfter(to)) continue;

      for (const item of ord.cart.tickets || []) {
        const eventId = item.eventId?.toString();
        if (userEventIds.has(eventId)) {
          totalSold += item.quantity || 0;
        }
      }
    }

    labels.push(from.format('MMM D'));
    data.push(totalSold);
  }

  result.tickets = {
    labels,
    data,
    totalSold: data.reduce((a, b) => a + b, 0)
  };
}




// EVENTS ANALYTICS
if (include.events) {
  const format = date === 'today' ? 'HH:mm' : 'MMM D';

  const start = dayjs(startDate).toDate();
  const end = dayjs(endDate).endOf('day').toDate();

  const events = await Event.find({
    createdAt: { $gte: start, $lte: end },
    user: userId,
  });

  result.events = {
    start: dayjs(startDate).format(format),
    end: dayjs(endDate).format(format),
    total: events.length,
  };
}


// ORDERS ANALYTICS
if (include.orders) {
  const format = date === 'today' ? 'HH:mm' : 'MMM D';

  const endOfDay = dayjs(endDate).endOf('day').toDate();
  const start = dayjs(startDate).toDate();

  // Get eventIds for this organizer
  const userEvents = await Event.find({ user: userId }, '_id');
  const userEventIds = new Set(userEvents.map(event => event._id.toString()));

  const orders = await Order.find({
    createdAt: { $gte: start, $lte: endOfDay },
  }).populate('cart');

  // Count unique orders that contain at least one ticket from this user's events
  const userOrderCount = orders.filter(ord =>
    ord?.cart?.tickets?.some(ticket => userEventIds.has(ticket.eventId?.toString()))
  ).length;

  result.orders = {
    start: dayjs(startDate).format(format),
    end: dayjs(endDate).format(format),
    total: userOrderCount,
  };
}


// INCOME ANALYTICS
if (include.income) {
  const isAdmin = req.user.role === ROLES.Admin;
  const isOrganizer = req.user.role === ROLES.Organizer;

  const start = dayjs(startDate);
  const end = dayjs(endDate).endOf('day');

  const buckets = generateBuckets(start, end, 30); // limit to 30 points
  const labels = [];
  const data = [];

  const userEvents = await Event.find({ user: userId }, '_id');
  const userEventIds = new Set(userEvents.map(e => e._id.toString()));

  const orders = await Order.find({
    createdAt: { $gte: start.toDate(), $lte: end.toDate() }
  }).populate('cart');

  let totalIncome = 0;

  for (let i = 0; i < buckets.length; i++) {
    const from = dayjs(buckets[i]).startOf('day');
    const to = buckets[i + 1]
      ? dayjs(buckets[i + 1]).startOf('day')
      : end;

    let incomeForBucket = 0;

    for (const ord of orders) {
      const createdAt = dayjs(ord.createdAt);
      if (createdAt.isBefore(from) || createdAt.isAfter(to)) continue;

      for (const item of ord?.cart?.tickets || []) {
        const eventId = item.eventId?.toString();
        if (!userEventIds.has(eventId)) continue;

        if (isAdmin) {
          const summary = getCartPriceSummary(item);
          const paid = Number(summary.total.replace(/,/g, '')) * (item.quantity || 1);
          incomeForBucket += paid;
        }

        if (isOrganizer) {
          incomeForBucket += item.expectedPayout || 0;
        }
      }
    }

    labels.push(from.format('MMM D'));
    data.push(incomeForBucket);
    totalIncome += incomeForBucket;
  }

  result.income = {
    labels,
    data,
    total: totalIncome,
  };
}

  return result;
}

module.exports = router;
