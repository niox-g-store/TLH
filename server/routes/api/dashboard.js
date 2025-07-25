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
const { getCartPriceSummary } = require('../../template/cartSummary.js');
const html_to_pdf = require('html-pdf-node');
const { Parser } = require('json2csv');
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
      let { target, isRange, startDate, endDate, date = null } = req.body;
      if (startDate === 'all_time' && endDate === 'all_time') {
        startDate = new Date(0);
        endDate = new Date();
      }
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

router.post(
  '/first-three/download',
  auth,
  role.check(ROLES.Admin, ROLES.Organizer),
  async (req, res) => {
    try {
      let { target, isRange, startDate, endDate, date = null } = req.body;
      const isCSV = req.query.csv === 'true';
      const isPDF = req.query.pdf === 'true';

      if (!target) return res.status(400).json({ error: 'Target is required' });
      if (!isCSV && !isPDF) return res.status(400).json({ error: 'Specify either ?csv=true or ?pdf=true' });

      // Handle "all_time" range
      if (startDate === 'all_time' && endDate === 'all_time') {
        startDate = new Date(0);
        endDate = new Date();
      }

      const include = {
        tickets: target === 'tickets' ? 'tickets' : null,
        orders: target === 'orders' ? 'orders' : null,
        events: target === 'events' ? 'events' : null,
        income: target === 'income' ? 'income' : null,
      };

      const analytics = await getAnalytics({ startDate, endDate, date, include }, req);
      const result = analytics[target];

      if (!result) {
        return res.status(400).json({ error: 'No data found for export' });
      }

      let rows = [];

      if (target === 'tickets' || target === 'income') {
        if (!Array.isArray(result.labels) || !Array.isArray(result.data) || result.labels.length === 0) {
          return res.status(400).json({ error: 'No data found for export' });
        }

        rows = result.labels.map((label, i) => ({
          Date: label,
          ...(target === 'tickets' && { 'Tickets Sold': result.data[i] }),
          ...(target === 'income' && { 'Income Earned': result.data[i] }),
        }));
      }

      if (target === 'orders') {
        rows.push({
          'Start Date': result.start,
          'End Date': result.end,
          'Total Orders': result.total,
        });
      }

      if (target === 'events') {
        rows.push({
          'Start Date': result.start,
          'End Date': result.end,
          'Total Events': result.total,
        });
      }

      if (rows.length === 0) {
        return res.status(400).json({ error: 'Nothing to export' });
      }

      if (isCSV) {
        const fields = Object.keys(rows[0]);
        const parser = new Parser({ fields });
        const csv = parser.parse(rows);

        res.setHeader('Content-Disposition', `attachment; filename=${target}-analytics.csv`);
        res.setHeader('Content-Type', 'text/csv');
        return res.status(200).send(csv);
      }

      if (isPDF) {
        const htmlRows = rows.map(row =>
          `<tr>${Object.values(row).map(val => `<td>${val ?? ''}</td>`).join('')}</tr>`
      ).join('');

      const headers = Object.keys(rows[0]).map(h => `<th>${h}</th>`).join('');

      const html = `
        <!DOCTYPE html>
        <html>
        <head>
        <meta charset="utf-8">
        <title>Analytics</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            font-size: 12px;
          }
          h2 {
            margin-bottom: 20px;
            color: black;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }
          th, td {
            padding: 8px;
            border: 1px solid #ccc;
            text-align: left;
          }
          th {
            background-color: #f0f0f0;
          }
        </style>
      </head>
      <body>
        <h2>${target.charAt(0).toUpperCase() + target.slice(1)} Analytics</h2>
        <table>
          <thead><tr>${headers}</tr></thead>
          <tbody>${htmlRows}</tbody>
        </table>
      </body>
    </html>
  `;


const pdf = await html_to_pdf.generatePdf(
  { content: html },
  { format: 'A4', printBackground: true }
);

  res.setHeader('Content-Disposition', `attachment; filename=${target}-analytics.pdf`);
  res.setHeader('Content-Type', 'application/pdf');
  return res.status(200).send(pdf);
}

    } catch (err) {
      return res.status(400).json({ error: 'Download failed' });
    }
  }
);



router.get(
    '/all-data',
    auth,
    role.check(ROLES.Admin, ROLES.Organizer),
    async (req, res) => {
  try {
    let { startDate, endDate } = req.query;
    if (startDate === 'all_time' && endDate === 'all_time') {
        startDate = new Date(0);
        endDate = new Date();
    }

    if (!startDate || !endDate) {
      startDate = dayjs().startOf('month').toISOString();
      endDate = dayjs().endOf('day').toISOString();
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

router.get(
  '/attendees/download',
  auth,
  role.check(ROLES.Admin, ROLES.Organizer),
  async (req, res) => {
  try {
    const isCSV = req.query.csv === 'true';
    const isPDF = req.query.pdf === 'true';

    const attendees = await getAttendees(req);

    if (!attendees.length) {
      return res.status(400).json({ error: 'No attendees found.' });
    }

    // --- CSV download ---
    if (isCSV) {
      const fields = ['name', 'ticketType', 'quantity', 'isGuest', 'checkedInCount', 'purchasedDate', 'email'];
      const parser = new Parser({ fields });
      const csv = parser.parse(attendees);

      res.setHeader('Content-Disposition', 'attachment; filename=attendees.csv');
      res.setHeader('Content-Type', 'text/csv');
      return res.status(200).send(csv);
    }

    // --- PDF download ---
    if (isPDF) {
      const tableRows = attendees.map(a => `
        <tr>
          <td>${a.name}</td>
          <td>${a.ticketType}</td>
          <td>${a.quantity}</td>
          <td>${a.isGuest ? 'Yes' : 'No'}</td>
          <td>${a.checkedInCount}</td>
          <td>${a.purchasedDate}</td>
          <td>${a.email}</td>
        </tr>
      `).join('');

      const htmlContent = `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              table { width: 100%; border-collapse: collapse; }
              th, td { padding: 8px 12px; border: 1px solid #ccc; font-size: 12px; }
              th { background-color: #f9f9f9; }
            </style>
          </head>
          <body>
            <h2>Attendees List</h2>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Ticket Type</th>
                  <th>Quantity</th>
                  <th>Guest?</th>
                  <th>Checked In</th>
                  <th>Purchase Date</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>${tableRows}</tbody>
            </table>
          </body>
        </html>
      `;

      const file = { content: htmlContent };
      const pdfBuffer = await html_to_pdf.generatePdf(file, { format: 'A4' });

      res.setHeader('Content-Disposition', 'attachment; filename=attendees.pdf');
      res.setHeader('Content-Type', 'application/pdf');
      return res.status(200).send(pdfBuffer);
    }

    // If no format is specified
    return res.status(400).json({ error: 'Please specify either ?csv=true or ?pdf=true in the query.' });
  } catch (err) {
    res.status(400).json({ error: 'Internal Server Error' });
  }
});


// functions

async function getAttendees(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const userId = req.user._id;
    const isAdmin = req.user.role === ROLES.Admin;

    let eventIds = [];

    if (isAdmin) {
      // Get users who are admins
      const adminUsers = await User.find({ role: ROLES.Admin }).select('_id');

      const adminUserIds = adminUsers.map(user => user._id);

      // Get events created by admin users
      const adminEvents = await Event.find({ user: { $in: adminUserIds } }).select('_id');
      eventIds = adminEvents.map(e => e._id);
    } else {
      // Get events created by the current (non-admin) user
      const userEvents = await Event.find({ user: userId }).select('_id');
      eventIds = userEvents.map(e => e._id);
    }

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
        const qrUsed = await QRCode.countDocuments({
          order: order._id,
          ticketId: ticket.ticketId,
          eventId: ticket.eventId,
          used: true
        });

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
          checkedInCount: qrUsed || 0,
          purchasedDate: formattedDate,
          email
        });
      }
    }

    // 4. Paginate
    const total = attendees.length;
    const paginated = attendees.slice(skip, skip + limit);

    if (res) {
      return res.json({
        attendees: paginated,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        totalAttendees: total
      });
    } else {
      return attendees
    }
  } catch (error) {
    res.status(400).json({ error: 'Internal Server Error' });
  }
}


async function getAnalytics({ startDate, endDate, date, include }, req) {
  const result = {};
  const userId = req.user._id;
  const isAdmin = req.user.role === ROLES.Admin;

  // 1. Get target user IDs (admins or current user)
  let eventUserIds = [userId];

  if (isAdmin) {
    const adminUsers = await User.find({ role: ROLES.Admin }).select('_id');
    eventUserIds = adminUsers.map(user => user._id.toString());
  }

  // 2. Fetch events for these users
  const allEvents = await Event.find({ user: { $in: eventUserIds } }, '_id');
  const eventIds = new Set(allEvents.map(event => event._id.toString()));

  function generateBuckets(start, end, maxPoints = 30) {
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

  // TICKETS
  if (include.tickets) {
    const buckets = generateBuckets(startDate, endDate);
    const labels = [];
    const data = [];

    const allOrders = await Order.find({ status: true }).populate('cart');

    const userOrders = allOrders.filter(ord =>
      ord?.cart?.tickets?.some(ticket => eventIds.has(ticket.eventId?.toString()))
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
          if (eventIds.has(item.eventId?.toString())) {
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

  // EVENTS
  if (include.events) {
    const format = date === 'today' ? 'HH:mm' : 'MMM D';

    const start = dayjs(startDate).toDate();
    const end = dayjs(endDate).endOf('day').toDate();

    const events = await Event.find({
      createdAt: { $gte: start, $lte: end },
      user: { $in: eventUserIds }
    });

    result.events = {
      start: dayjs(startDate).format(format),
      end: dayjs(endDate).format(format),
      total: events.length
    };
  }

  // ORDERS
  if (include.orders) {
    const format = date === 'today' ? 'HH:mm' : 'MMM D';

    const endOfDay = dayjs(endDate).endOf('day').toDate();
    const start = dayjs(startDate).toDate();

    const orders = await Order.find({
      createdAt: { $gte: start, $lte: endOfDay },
    }).populate('cart');

    const userOrderCount = orders.filter(ord =>
      ord?.cart?.tickets?.some(ticket => eventIds.has(ticket.eventId?.toString()))
    ).length;

    result.orders = {
      start: dayjs(startDate).format(format),
      end: dayjs(endDate).format(format),
      total: userOrderCount
    };
  }

  // INCOME
  if (include.income) {
    const isOrganizer = req.user.role === ROLES.Organizer;
    const start = dayjs(startDate);
    const end = dayjs(endDate).endOf('day');

    const buckets = generateBuckets(start, end, 30);
    const labels = [];
    const data = [];

    const orders = await Order.find({
      createdAt: { $gte: start.toDate(), $lte: end.toDate() },
      status: true
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
          if (!eventIds.has(item.eventId?.toString())) continue;

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
      total: totalIncome
    };
  }

  return result;
}


module.exports = router;
