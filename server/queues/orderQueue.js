// queues/orderQueue.js
const Queue = require('bull');

const orderQueue = new Queue('orderQueue', {
    redis: {
        host: '127.0.0.1', port: 6379
    }
});

module.exports = orderQueue;
