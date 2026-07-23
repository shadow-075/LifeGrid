const express = require('express');
const router = express.Router();
const { getPublicProfiles, getPublicProfileByUsername } = require('../controllers/exploreController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', protect, getPublicProfiles);
router.get('/:username', protect, getPublicProfileByUsername);

module.exports = router;
