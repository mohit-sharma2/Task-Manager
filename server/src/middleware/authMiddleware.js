// const jwt = require('jsonwebtoken');

// const protect = (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(401).json({ error: 'Access denied. No token provided.' });
//   }

//   const token = authHeader.split(' ')[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     if (err.name === 'TokenExpiredError') {
//       return res.status(401).json({ error: 'Session expired. Please log in again.' });
//     }
//     return res.status(401).json({ error: 'Invalid token.' });
//   }
// };

// module.exports = protect;

const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  const token = req.cookies?.token; // ← ab header se nahi, cookie se padh raha hai

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Session expired. Please log in again.' });
    }
    return res.status(401).json({ error: 'Invalid token.' });
  }
};

module.exports = protect;
