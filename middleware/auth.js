const jwt = require('jsonwebtoken');
const User = require('../model/User');
const secretKey = process.env.SECRET_KEY;

const auth = async (req, res, next) => {
  const token = req.header('Authorization');

  if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).json({
      status: 'Invalid or Missing Token'
    });
  }

  const modifiedToken = token.replace('Bearer ', '');

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

const admin = async (req, res, next) => {
  const token = req.header('Authorization').split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Access denied. Token missing.' });
  }

  try {
    const decodedToken = jwt.verify(token, secretKey);
    const user = await User.findById(decodedToken.user_id);

    if (!user.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }

    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token.' });
  }
}

module.exports = { auth, admin };
