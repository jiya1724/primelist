const express = require('express');
const router = express.Router();
const ConnectedSocialMedia = require('../models/ConnectedSocialMedia');
const clerkAuth = require('../middleware/clerkAuth');

// GET connected social media
router.get('/', clerkAuth, async (req, res) => {
    try {
        const connectedSocialMedia = await ConnectedSocialMedia.findOne();
        if (!connectedSocialMedia) {
            return res.status(404).json({ message: "No social media connected" });
        }
        res.json(connectedSocialMedia);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// UPDATE connected social media
router.post('/', clerkAuth, async (req, res) => {
    try {
        const { instagram_link, facebook_link, tiktok_link } = req.body;
        let socialMedia = await ConnectedSocialMedia.findOne();

        if (!socialMedia) {
            socialMedia = new ConnectedSocialMedia({
                instagram_link: instagram_link || '',
                facebook_link: facebook_link || '',
                tiktok_link: tiktok_link || ''
            });
        } else {
            if (instagram_link) socialMedia.instagram_link = instagram_link;
            if (facebook_link) socialMedia.facebook_link = facebook_link;
            if (tiktok_link) socialMedia.tiktok_link = tiktok_link;
        }

        await socialMedia.save();
        res.json(socialMedia);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;