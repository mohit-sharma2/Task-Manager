const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { registerSchema, loginSchema } = require('../validators/authValidator');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

exports.register = async (req, res, next) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const existing = await User.findOne({ email: value.email });
    if (existing) return res.status(400).json({ error: 'Email already registered.' });

    const hashed = await bcrypt.hash(value.password, 12);
    const user = await User.create({ ...value, password: hashed });

    const token = generateToken(user._id);
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const user = await User.findOne({ email: value.email });
    if (!user) return res.status(401).json({ error: 'Invalid email or password.' });

    const match = await bcrypt.compare(value.password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid email or password.' });

    const token = generateToken(user._id);
    res.status(200).json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    next(err);
  }
};


// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const User = require('../models/User');
// const { registerSchema, loginSchema } = require('../validators/authValidator');

// const sendTokenCookie = (res, token) => {
//   res.cookie('token', token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production',
//     sameSite: 'strict',
//     maxAge: 7 * 24 * 60 * 60 * 1000
//   });
// };

// exports.register = async (req, res, next) => {
//   try {
//     const { error, value } = registerSchema.validate(req.body);
//     if (error) return res.status(400).json({ error: error.details[0].message });

//     const existing = await User.findOne({ email: value.email });
//     if (existing) return res.status(400).json({ error: 'Email already registered.' });

//     const hashed = await bcrypt.hash(value.password, 12);
//     const user = await User.create({ ...value, password: hashed });

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: process.env.JWT_EXPIRES_IN
//     });

//     sendTokenCookie(res, token);

//     res.status(201).json({
//       user: { id: user._id, name: user.name, email: user.email }
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// exports.login = async (req, res, next) => {
//   try {
//     const { error, value } = loginSchema.validate(req.body);
//     if (error) return res.status(400).json({ error: error.details[0].message });

//     const user = await User.findOne({ email: value.email });
//     if (!user) return res.status(401).json({ error: 'Invalid email or password.' });

//     const match = await bcrypt.compare(value.password, user.password);
//     if (!match) return res.status(401).json({ error: 'Invalid email or password.' });

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: process.env.JWT_EXPIRES_IN
//     });

//     sendTokenCookie(res, token);

//     res.status(200).json({
//       user: { id: user._id, name: user.name, email: user.email }
//     });
//   } catch (err) {
//     next(err);
  }
};
