const mongoose = require('mongoose')

const collectionSchema = new mongoose.Schema(
  {
    farmerId: {
        type: Number,
        required: [true, 'Farmer ID missing']
    },
    farmerName: {
      type: String,
      required: [true, "Farmer Name missing"],
    },
    collectionDate: {
      type: Date,
      default: Date.now(),
      required: [true, "Collection Date missing"],
    },
    shift: {
      type: String,
      enum: ["Morning", "Evening"],
      required: [true, "Shift missing"],
    },
    qty: {
      type: Number,
      required: [true, "Quantity missing"],
    },
    fat: {
      type: Number,
    },
    snf: {
      type: Number,
    },
    rate: {
      type: Number,
      required: [true, "Rate missing"],
    },
    amount: {
      type: Number,
      required: [true, "Amount missing"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Collection = mongoose.model('Collection', collectionSchema)

module.exports = Collection