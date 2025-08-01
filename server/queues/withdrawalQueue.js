const Queue = require('bull');

const withdrawalQueue = new Queue('withdrawalQueue', {
  redis: { host: '127.0.0.1', port: 6379 }
});

module.exports = withdrawalQueue;
