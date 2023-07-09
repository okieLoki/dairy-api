const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).json({
      status: 'Invalid or Missing Token'
    });
  }

  const modifiedToken = token.replace('Bearer ', '');

  try {
    const decode = jwt.verify(modifiedToken, process.env.SECRET_KEY);
    next();
  } catch (error) {
    res.status(401).json({
      status: 'Invalid Token'
    });
  }
};

module.exports = auth;
