const Farmer = require('../model/Farmer');
const Ledger = require('../model/Ledger');
const Payment = require('../model/Payment');
const User = require('../model/User');

const settlePaymentByAdmin = async (req, res) => {
  try {
    const { farmerId, date, amountToPay, remarks } = req.body;
    const { username } = req.params
    const user = await User.findOne({ username })

    if (!user) {
      return res.status(404).send({ message: 'No user found' });
    }

    if (!farmerId || !date || !amountToPay || !remarks) {
      return res.status(400).json({
        message: 'Please provide all the details',
      });
    }

    const farmer = await Farmer.findOne({ farmerId, userId: user._id });

    if (!farmer) {
      return res.status(404).send({ message: 'No farmer found' });
    }

    let previousBalance = Number(farmer.credit) - Number(farmer.debit);

    await Payment.create({
      farmerId,
      date,
      amountToPay,
      remarks,
      userId: user._id
    });

    await Ledger.create({
      farmerId,
      date,
      debit: amountToPay,
      remarks: remarks,
      userId: user._id,
      previousBalance: previousBalance,
    })

    farmer.debit = farmer.debit + Number(amountToPay);
    await farmer.save();


    return res.status(200).json({ message: 'Payment successfully made' })

  } catch (error) {
    console.log(error);

    res.status(400).json({
      status: 'Error',
    });
  }
};

const settlePaymentByUser = async (req, res) => {
  try {
    const { farmerId, date, amountToPay, remarks } = req.body;
    const { username } = req.params

    const user = await User.findOne({ username })

    if (!user) {
      return res.status(404).send({ message: 'No user found' });
    }

    if (user.permissions.allowPayment === 'Not Allow') {
      return res.status(403).send({ message: 'Payment not allowed' })
    }

    if (!farmerId || !date || !amountToPay || !remarks) {
      return res.status(400).json({
        message: 'Please provide all the details',
      });
    }

    const farmer = await Farmer.findOne({ farmerId, userId: user._id });

    if (!farmer) {
      return res.status(404).send({ message: 'No farmer found' });
    }

    let previousBalance = Number(farmer.credit) - Number(farmer.debit);

    await Payment.create({
      farmerId,
      date,
      amountToPay,
      remarks,
      userId: user._id
    });

    await Ledger.create({
      farmerId,
      date,
      debit: amountToPay,
      remarks: 'Payment',
      userId: user._id,
      previousBalance: previousBalance,
    })

    farmer.debit = farmer.debit + Number(amountToPay);
    await farmer.save();


    return res.status(200).json({ message: 'Payment successfully made' })

  } catch (error) {
    console.log(error);

    res.status(400).json({
      status: 'Error',
    });
  }
};

const getPaymentByAdmin = async (req, res) => {
  try {
    const { username } = req.params;
    const { startDate, endDate } = req.query;
    const formattedStartDate = new Date(startDate);
    const formattedEndDate = new Date(endDate);

    if (isNaN(formattedStartDate) || isNaN(formattedEndDate)) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Set the time part of the dates to midnight (00:00:00) to compare just the date part
    formattedStartDate.setHours(0, 0, 0, 0);
    formattedEndDate.setHours(0, 0, 0, 0);

    // Adjust the end date to the start of the next day minus one millisecond
    formattedEndDate.setDate(formattedEndDate.getDate() + 1);
    formattedEndDate.setTime(formattedEndDate.getTime() - 1);

    const payments = await Payment.find({
      $and: [
        { userId: user._id },
        {
          $expr: {
            $and: [
              { $gte: ['$date', formattedStartDate] },
              { $lt: ['$date', formattedEndDate] },
            ],
          },
        },
      ],
    }).sort({ date: -1 });

    res.status(200).json(payments);
  }
  catch (err) {
    console.log(err);
    res.status(400).json({
      status: 'Error',
    });
  }
}

module.exports = { settlePaymentByAdmin, settlePaymentByUser, getPaymentByAdmin };