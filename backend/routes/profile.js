const express = require('express');
const router = express.Router();
const clerkAuth = require('../middleware/clerkAuth');

// GET profile data
router.get('/', clerkAuth, (req, res) => {
    try {
        const first_name = req.clerk_user?.data?.first_name || '';
        const profile_image = req.clerk_user?.data?.image_url || '';
        res.json({ first_name, profile_image });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;