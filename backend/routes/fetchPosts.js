const express = require('express');
const router = express.Router();
const ConnectedSocialMedia = require('../models/ConnectedSocialMedia');
const clerkAuth = require('../middleware/clerkAuth');
const InstaFetcher = require('../services/InstaFetcher');
const FacebookFetcher = require('../services/FacebookFetcher');

// GET Instagram posts
router.get('/', clerkAuth, async (req, res) => {
    try {
        const socialMedia = await ConnectedSocialMedia.findOne();
        if (!socialMedia || !socialMedia.instagram_link) {
            return res.status(400).json({ message: "Instagram not connected" });
        }

        const username = socialMedia.instagram_link.split(".com/")[1]?.trim();
        if (!username) {
            return res.status(400).json({ message: "Invalid Instagram URL" });
        }

        const fetcher = new InstaFetcher(process.env.RAPIDAPI_KEY);
        const postLinks = await fetcher.get_user_posts(username);
        
        res.json({ 
            message: "Posts fetched successfully",
            post_links: postLinks
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET Facebook posts
router.get('/facebook', clerkAuth, async (req, res) => {
    try {
        const socialMedia = await ConnectedSocialMedia.findOne();
        if (!socialMedia || !socialMedia.facebook_link) {
            return res.status(400).json({ message: "Facebook not connected" });
        }

        const scraper = new FacebookFetcher(process.env.FACEBOOK_RAPIDAPI_KEY);
        const posts = await scraper.fetch_posts_from_profile(socialMedia.facebook_link);
        
        if (!posts) {
            return res.status(500).json({ message: "Failed to fetch posts" });
        }

        res.json({ 
            message: "Posts fetched successfully",
            post_links: posts
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;