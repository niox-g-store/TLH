const dayjs = require('dayjs');
const isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
const isSameOrBefore = require('dayjs/plugin/isSameOrBefore');
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const Ticket = require('../models/Ticket');
const Event = require('../models/Event');
const Order = require('../models/Order');

async function getAnalytics({ startDate, endDate, date, include }) {
  const result = {};

  // Helper to split the time range into max 14 buckets
  function generateBuckets(start, end, maxPoints = 14) {
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

    for (let i = 0; i < buckets.length; i++) {
      const from = dayjs(buckets[i]);
      const to = dayjs(buckets[i + 1] || endDate);

      const tickets = await Ticket.find({
        createdAt: { $gte: from.toDate(), $lt: to.toDate() },
      });

      const sold = tickets.reduce((sum, ticket) => sum + (ticket.soldCount || 0), 0);

      labels.push(from.format('MMM D'));
      data.push(sold);
    }

    result.tickets = {
      labels,
      data,
      totalSold: data.reduce((a, b) => a + b, 0),
    };
  }

  // EVENTS ANALYTICS
  if (include.events) {
    const format = date === 'today' ? 'HH:mm' : 'MMM D';

    const events = await Event.find({
      createdAt: { $gte: startDate, $lte: endDate },
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

    const orders = await Order.find({
      createdAt: { $gte: startDate, $lte: endDate },
    });

    result.orders = {
      start: dayjs(startDate).format(format),
      end: dayjs(endDate).format(format),
      total: orders.length,
    };
  }

  return result;
}

module.exports = getAnalytics;
