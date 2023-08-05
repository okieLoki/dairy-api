const mongoose = require('mongoose');

const rateListSchema = new mongoose.Schema({
  category: {
    type: String,
    required: [true, 'Category missing'],
    enum: ['KGFAT + KGSNF', 'KG FAT ONLY']
  },
  level: {
    type: Number,
    required: [true, 'Level missing'],
    enum: [1, 2, 3, 4]
  },
  rateChartName: {
    type: String,
    required: [true, 'Rate Chart Name missing']
  },
  stdFatRate: {
    type: Number,
    required: function () {
      return this.category === 'KGFAT + KGSNF' || this.category === 'KG FAT ONLY';
    }
  },
  stdSNFRate: {
    type: Number,
    required: function () {
      return this.category === 'KGFAT + KGSNF';
    }
  },
  stdTSRate: {
    type: Number,
    required: function () {
      return this.category === 'KGFAT + KGSNF';
    }
  },
  incentive: {
    type: Number,
    required: [true, 'Incentive missing']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'User Id missing'],
    ref: 'User'
  }
});

const RateList = mongoose.model('RateList', rateListSchema);

module.exports = RateList;
