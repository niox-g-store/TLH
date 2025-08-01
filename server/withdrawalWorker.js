require('dotenv').config();
const setupDB = require('./db');

(async () => {
  await setupDB();

  const orderQueue = require('./queues/orderQueue');
  const withdrawalQueue = require('./queues/withdrawalQueue');
  const mailgun = require('./services/mailgun');
  const chalk = require('chalk');
  const { verifyTransfer } = require('./utils/paystack');
  const Withdrawal = require('./models/withdrawal');
  const AdminWithdrawal = require('./models/adminWithdrawal');
  const Organizer = require('./models/organizer');
  const User = require('./models/user');

  withdrawalQueue.process(async (job, done) => {
    try {
      const [pendingWithdrawals, pendingAdminWithdrawals] = await Promise.all([
        Withdrawal.find({ status: 'processing' }).populate('user'),
        AdminWithdrawal.find({ status: 'processing' }).populate('user')
      ]);

      for (const withdrawal of pendingWithdrawals) {
        const result = await verifyTransfer(withdrawal.reference);
        const { status } = result.data;

        if (status === 'success') {
          withdrawal.status = 'completed';
          withdrawal.processedAt = new Date();
          await withdrawal.save();

          const organizer = await Organizer.findById(withdrawal.user.organizer);
          if (organizer) {
            await mailgun.sendEmail(withdrawal.user.email, 'organizer-withdraw-successful', {
              withdrawal,
              organizer,
              order: { totalExpectedPayout: withdrawal.amount }
            });
          }
        }

        if (status === 'failed' || status === 'reversed') {
          withdrawal.status = 'failed';
          await withdrawal.save();

          const organizer = await Organizer.findById(withdrawal.user.organizer);
          if (organizer) {
            await mailgun.sendEmail(withdrawal.user.email, 'organizer-withdraw-failed', {
              withdrawal,
              organizer,
              order: { totalExpectedPayout: withdrawal.amount }
            });
          }
        }
      }

      for (const adminWithdrawal of pendingAdminWithdrawals) {
        const result = await verifyTransfer(adminWithdrawal.reference);
        const { status } = result.data;

        if (status === 'success') {
          adminWithdrawal.status = 'completed';
          adminWithdrawal.processedAt = new Date();
          await adminWithdrawal.save();
        }

        if (status === 'failed' || status === 'reversed') {
          adminWithdrawal.status = 'failed';
          await adminWithdrawal.save();
        }
      }

      done();
    } catch (err) {
      done(err);
    }
  });

  // Add repeat job to run every 5 seconds
  withdrawalQueue.add({}, {
    repeat: { every: 5000 },
    removeOnComplete: true,
    removeOnFail: true,
  });

  console.log(chalk.green.bold('[✔] Withdrawal Workers are active and listening for jobs...'));
})();
