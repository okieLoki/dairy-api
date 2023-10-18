const jwt = require('jsonwebtoken');
const User = require('../model/User');
const Admin = require('../model/Admin');
const Farmer = require('../model/Farmer');
const secretKey = process.env.SECRET_KEY;

const authUser = async (req, res, next) => {
  const token = req.header('Authorization');

  if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).json({
      status: 'Invalid or Missing Token'
    });
  }

  const modifiedToken = token.split(' ')[1];

  try {
    const decode = jwt.verify(modifiedToken, process.env.SECRET_KEY);
    req.user = await User.findById(decode.user_id).select('-password')
    next();
  } catch (error) {
    res.status(401).json({
      status: 'Invalid Token'
    });
  }
};

const authAdmin = async (req, res, next) => {
  const token = req.header('Authorization').split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Access denied. Token missing.' });
  }

  try {
    const decodedToken = jwt.verify(token, secretKey);
    const admin = await Admin.findById(decodedToken.admin_id);
    if (!admin) {
      return res.status(401).json({ message: 'Invalid token.' });
    }
    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token.' });
  }
};

const authFarmer  = async (req, res, next) => {
  const token = req.header('Authorization').split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Access denied. Token missing.' });
  }

  try {
    const decodedToken = jwt.verify(token, secretKey);
    const farmer = await Farmer.findById(decodedToken.farmer_id);

    if (!farmer) {
      return res.status(401).json({ message: 'Invalid token.' });
    }
    req.farmer = farmer;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token.' });
  }
}


const auth = async (req, res, next) => {
  const token = req.header('Authorization');

  if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).json({
      status: 'Invalid or Missing Token'
    });
  }

  const modifiedToken = token.split(' ')[1];

  try {
    const decodedToken = jwt.verify(modifiedToken, secretKey);

    if (decodedToken.user_id) {
      const user = await User.findById(decodedToken.user_id).select('-password');
      if (!user) {
        return res.status(401).json({ message: 'Invalid token.' });
      }
      req.user = user;
    } else if (decodedToken.admin_id) {
      const admin = await Admin.findById(decodedToken.admin_id);
      if (!admin) {
        return res.status(401).json({ message: 'Invalid token.' });
      }
      req.admin = admin;
    } else {
      return res.status(401).json({ message: 'Invalid token.' });
    }

    next();
  } catch (error) {
    res.status(401).json({
      status: 'Invalid Token'
    });
  }
};


module.exports = { authUser, authAdmin, auth, authFarmer };
