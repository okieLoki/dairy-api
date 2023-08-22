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
      userId: user._id
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
      userId: user._id
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

module.exports = { settlePaymentByAdmin, settlePaymentByUser };