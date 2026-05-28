const router = require('express').Router();
const { register, login } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully.' });
});

module.exports = router;
