require('dotenv').config();
const chalk = require('chalk');
const mongoose = require('mongoose');
const Setting = require('../models/setting');

const keys = require('../config/keys');
const { database } = keys;
const DB_HOST = database.HOST;
const DB_PORT = database.PORT;
const DB_NAME = database.NAME;
const DB_USER = database.USER;
const DB_PASS = database.PASS;
const DB_AUTH_SOURCE = database.AUTH_SOURCE;

const DB_URI = `mongodb://${DB_USER}:${encodeURIComponent(DB_PASS)}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=${DB_AUTH_SOURCE}`

// create default settings for site
const ensureDefaultSetting = async () => {
  try {
    const count = await Setting.countDocuments();
    if (count === 0) {
      await Setting.create({});
      console.log('Default Setting instance created.');
    } else {
      console.log('Setting instance already exists. No new instance created.');
    }
  } catch (error) {
    console.error('Error ensuring single Setting instance:', error);
  }
};

// Setup MongoDB connection
const setupDB = async () => {
  try {
    // Disable buffering
    mongoose.set('bufferCommands', false);

    // Connect to MongoDB with updated options
    await mongoose.connect(DB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      authSource: DB_AUTH_SOURCE,
    });

    console.log(`${chalk.green('✓')} ${chalk.blue('MongoDB Connected!')}`);
    await ensureDefaultSetting()
  } catch (error) {
    console.error(`${chalk.red('✗')} ${chalk.yellow('MongoDB Connection Error:')}`, error);
    process.exit(1);
  }
};

module.exports = setupDB;
