   const mongoose = require('mongoose');

   const settingSchema = new mongoose.Schema({
     maintenance: {
       type: Boolean,
       default: false
     },
     commission: {
       type: Number,
       default: 8
     },
     earningControl: {
       type: String,
       enum: ['fixed', 'hours'],
       default: 'fixed'
     },
     fixedDays: [{
       type: String,
       enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
     }],
     hours: {
       type: Number,
       enum: [24, 48, 72, 96],
       default: 24
     },
     createdAt: { type: Date, default: Date.now },
     updatedAt: { type: Date, default: Date.now }
   });

   settingSchema.pre('save', function (next) {
     this.updatedAt = new Date();
     next();
   });

   module.exports = mongoose.model('Setting', settingSchema);