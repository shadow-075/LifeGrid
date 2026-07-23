const express = require('express');
const router = express.Router();
const { signup, login, getMe } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const { signupRules, loginRules } = require('../validators/authValidator');
const { authLimiter } = require('../middlewares/rateLimiter');

router.post('/signup', authLimiter, signupRules, signup);
router.post('/login', authLimiter, loginRules, login);
router.get('/me', protect, getMe);

module.exports = router;
