const express = require('express');
const router = express.Router();
const ProductListings = require('../models/ProductListings');
const ConnectedSocialMedia = require('../models/ConnectedSocialMedia');
const clerkAuth = require('../middleware/clerkAuth');

// GET dashboard stats
router.get('/', clerkAuth, async (req, res) => {
    try {
        
        const totalProducts = await ProductListings.countDocuments();
        const approvedProducts = await ProductListings.countDocuments({ approved: true });
        const disapprovedProducts = totalProducts - approvedProducts;

        const socialMedia = await ConnectedSocialMedia.findOne();
        let connectedCount = 0;
        
        if (socialMedia) {
            const links = [
                socialMedia.instagram_link,
                socialMedia.facebook_link,
                socialMedia.tiktok_link
            ];
            connectedCount = links.filter(link => link && link.trim() !== '').length;
        }

        res.json({
            total_listings: totalProducts,
            approved_listings: approvedProducts,
            disapproved_listings: disapprovedProducts,
            connected_social_media: connectedCount
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;