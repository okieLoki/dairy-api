const mongoose = require('mongoose');

const rateListSchema = new mongoose.Schema({
  category: {
    type: String,
    required: [true, 'Category missing'],
    enum: ['KGFAT + KGSNF', 'KG FAT ONLY', 'FAT ONLY', 'FAT + SNF']
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
  animal: {
    type: String,
    required: [true, 'Animal missing'],
    enum: ['COW', 'BUFFALO', 'BOTH']
  },
  stdFat: {
    type: Number,
    required: function() {
        return this.category === 'KGFAT + KGSNF' || this.category === 'FAT ONLY';
    }
  },
  stdSNF: {
    type: Number,
    required: function() {
      return this.category === 'KGFAT + KGSNF' || this.category === 'FAT + SNF';
    }
  },
  ratio: {
    type: String,
    required: function() {
        return this.category === 'KGFAT + KGSNF';
    },
    enum: ['60:40', '52:48', '50:50']
  },
  stdRate: {
    type: Number,
    required: function() {
      return this.category === 'KGFAT + KGSNF';
    }
  },
  minFat: {
    type: Number,
    required: function() {
      return this.category === 'FAT ONLY' || this.category === 'FAT + SNF';
    }
  },
  maxFat: {
    type: Number,
    required: function() {
      return this.category === 'FAT ONLY' || this.category === 'FAT + SNF';
    }
  },
  fatIncrement: {
    type: Number,
    required: function() {
      return this.category === 'FAT ONLY' || this.category === 'FAT + SNF';
    }
  },
  minSNF: {
    type: Number,
    required: function() {
      return this.category === 'FAT + SNF';
    }
  },
  maxSNF: {
    type: Number,
    required: function() {
      return this.category === 'FAT + SNF';
    }
  },
  snfIncrement: {
    type: Number,
    required: function() {
      return this.category === 'FAT + SNF';
    }
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'User Id missing'],
    ref: 'User'
  }
});

const RateList = mongoose.model('RateList', rateListSchema);

module.exports = RateList;
